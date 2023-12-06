'use server';
import {
  flushServerEvents,
  logServerEvent,
} from '@/lib/analytics/posthog/server';
import { URLs } from '@/lib/constants';
import { projectFormSchema } from '@/lib/validations/project';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { db } from '../db';
import {
  comments,
  projectBookmarks,
  projectMedia,
  projectTags,
  projects,
  tags as tagsTable,
  upvotes,
  userProfiles,
  type ProjectSelect,
  type UserProfileSelect,
} from '../db/schema';

const getProjectsValidationSchema = z.object({
  limit: z.number().optional(),
  offset: z.number().optional(),
});

export const getAllProjectsSortedByLikes = async (
  _props: z.infer<typeof getProjectsValidationSchema>,
) => {
  const { limit, offset } = getProjectsValidationSchema.parse(_props);
  const likesCount = sql<number>`cast(COUNT(${upvotes}.id) as int)`;

  const newProjects = await db
    .select({
      project: projects,
      likesCount,
      userProfile: userProfiles,
    })
    .from(projects)
    .leftJoin(upvotes, eq(upvotes.projectId, projects.id))
    .orderBy(desc(likesCount))
    .limit(limit ? limit : 8)
    .leftJoin(userProfiles, eq(userProfiles.id, projects.userId))
    .groupBy(projects.id, userProfiles.id);

  const projectIds = newProjects.map((p) => p.project.id);
  const mediaPromise = db
    .select()
    .from(projectMedia)
    .where(inArray(projectMedia.projectId, projectIds));
  const tagsPromise = db.query.projectTags.findMany({
    where: inArray(projectTags.projectId, projectIds),
    with: {
      tag: true,
    },
  });

  const [media, tags] = await Promise.all([mediaPromise, tagsPromise]);

  const result = newProjects.map((data) => {
    const { project, likesCount, userProfile } = data;
    return {
      project,
      likesCount,
      user: userProfile!,
      tags: tags
        .filter((pt) => pt.projectId === project.id)
        .filter((pt) => pt.tag.name !== 'ignore_this_tag')
        .map((pt) => pt.tag),
      media: media.filter((m) => m.projectId === project.id),
    };
  });
  return result;
};

// TODO: filter categories
// get all projects ordered by date
// for home feed
export const getAllProjects = async (
  _props: z.infer<typeof getProjectsValidationSchema>,
) => {
  const { limit, offset } = getProjectsValidationSchema.parse(_props);
  const allProjects = await db.query.projects.findMany({
    where: (p, { isNotNull }) => isNotNull(p.publishedAt),
    with: {
      userProfile: true,
      projectMedia: true,
      projectTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: [desc(projects.publishedAt)],
    limit: limit ? limit : undefined,
  });

  const result = allProjects.map((data) => {
    const { projectTags, projectMedia, userProfile, ...project } = data;
    return {
      project,
      user: userProfile,
      tags: projectTags
        .filter((pt) => pt.tag.name !== 'ignore_this_tag')
        .map((pt) => pt.tag),
      media: projectMedia,
    };
  });

  return result;
};

// get all projects of a user
export const getProjectsByUserId = async (userId: UserProfileSelect['id']) => {
  const allProjects = await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    with: {
      userProfile: true,
      projectMedia: true,
      projectTags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: [desc(projects.publishedAt)],
  });
  const result = allProjects.map((data) => {
    const { projectTags, projectMedia, userProfile, ...project } = data;
    return {
      project,
      user: userProfile,
      tags: projectTags
        .filter((pt) => pt.tag.name !== 'ignore_this_tag')
        .map((pt) => pt.tag),
      media: projectMedia,
    };
  });
  return result;
};

// get project by Id
export const getProjectById = async (projectId: ProjectSelect['id']) => {
  const projectWithMedia = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
    with: {
      projectMedia: true,
    },
  });

  if (!projectWithMedia) {
    return null;
  }

  const tagsPromise = db.query.projectTags.findMany({
    where: eq(projectTags.projectId, projectWithMedia.id),
  });

  const userPromise = db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, projectWithMedia.userId),
  });

  const totalLikes = db
    .select({ recordCount: sql`COUNT(*)` })
    .from(upvotes)
    .where(eq(upvotes.projectId, projectWithMedia.id));

  const [tags, user, likesCount] = await Promise.all([
    tagsPromise,
    userPromise,
    totalLikes,
  ]);

  return {
    project: projectWithMedia,
    dev: user,
    tags,
    likesCount: Number(likesCount[0]?.recordCount),
  };
};

export const getProjectUpvotes = async ({
  projectId,
}: {
  projectId: number;
}) => {
  const totalLikes = await db
    .select({ recordCount: sql`COUNT(*)` })
    .from(upvotes)
    .where(eq(upvotes.projectId, projectId));
  return Number(totalLikes[0]?.recordCount);
};

export const isLikedByUser = async ({ projectId }: { projectId: number }) => {
  try {
    const supabase = createServerActionClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    const userId = session?.user.id;

    if (!userId) {
      throw new Error('Unauthorized');
    }
    console.log('my user id', userId);
    const [result] = await db
      .select({ count: sql<number>`cast(count(${upvotes}) as int)` })
      .from(upvotes)
      .where(and(eq(upvotes.projectId, projectId), eq(upvotes.userId, userId)));

    console.log('result', result);

    const userLikeRecord = z.coerce
      .number()
      .catch(0)
      .parse(result?.count);

    return userLikeRecord === 1;
  } catch (err) {
    console.error(err);
    return false;
  }
};

type ProjectData = z.infer<typeof projectFormSchema>;
export const uploadNewProject = async (_project: ProjectData) => {
  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const project = projectFormSchema.parse(_project);

  try {
    const projectSlug =
      project.title.replace(/\s+/g, '-').toLowerCase() +
      '-' +
      Date.now().toString();

    project.tags.push('ignore_this_tag');

    const [result] = await db
      .insert(projects)
      .values({
        ...project,
        userId,
        slug: projectSlug,
        publishedAt: new Date(),
      })
      .returning({ projectId: projects.id });

    const projectId = result?.projectId;

    if (!projectId) {
      throw new Error('Could not get id of newly created project!');
    }

    for (const currentTag of project.tags) {
      let [tagResult] = await db
        .select({ tagId: tagsTable.id })
        .from(tagsTable)
        .where(eq(tagsTable.name, currentTag));
      let tagId = tagResult?.tagId;

      await db.query.tags.findFirst({
        where: eq(tagsTable.name, currentTag),
      });

      if (!tagId) {
        [tagResult] = await db
          .insert(tagsTable)
          .values({
            name: currentTag,
          })
          .returning({ tagId: tagsTable.id });
        tagId = tagResult!.tagId;
      }

      await db.insert(projectTags).values({
        projectId,
        tagId,
      });
    }

    logServerEvent('project_create_success', {
      distinct_id: userId,
      properties: { userId, projectId: projectId.toString() },
    });
    await flushServerEvents();

    return { success: true, projectId };
  } catch (err) {
    console.error(err);

    const errorMessage = (err as Error)?.message ?? 'Unknown error';

    logServerEvent('project_create_failed', {
      distinct_id: userId,
      properties: { userId, reason: errorMessage },
    });

    await flushServerEvents();

    if (err instanceof Error) {
      throw err;
    }

    throw new Error(`Could not create project! ${err as string}`);
  }
};

export const deleteProject = async (projectId: number) => {
  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const userId = session?.user.id;
  if (!userId) {
    throw new Error('Unauthorized');
  }

  try {
    const existingProjectInDb = await db.query.projects.findFirst({
      where: (p, { eq, and }) => and(eq(p.id, projectId), eq(p.userId, userId)),
    });

    if (!existingProjectInDb) {
      throw new Error('Project not found for this user to delete!');
    }

    await Promise.allSettled([
      db.delete(upvotes).where(eq(upvotes.projectId, projectId)),

      // TODO: This is bad because it will delete the tags from the tags table even if they are used by other projects...
      db.delete(projectTags).where(and(eq(projectTags.projectId, projectId))),

      // TODO: Actually delete the media from the storage bucket too...
      db.delete(projectMedia).where(eq(projectMedia.projectId, projectId)),
    ]);

    // Finally delete the project itself
    // This will fail if any other table that has a foreign key constraint on the project id is not deleted first
    await db.delete(projects).where(eq(projects.id, projectId));

    logServerEvent('project_delete_success', {
      distinct_id: userId,
      properties: { userId, projectId: projectId.toString() },
    });

    await flushServerEvents();
  } catch (err) {
    console.error(err);

    const errorMessage = (err as Error)?.message ?? 'Unknown error';

    logServerEvent('project_delete_failed', {
      distinct_id: userId,
      properties: {
        userId,
        projectId: projectId.toString(),
        reason: errorMessage,
      },
    });
    await flushServerEvents();
    return {
      success: false,
      error: 'Could not delete project!',
    };
  }
};

// TODO: Relocate this
const commentInsertValidationSchema = z.object({
  projectId: z.number(),
  content: z.string().max(1500),
});

// add comment
// TODO: add event logging for this
export const createComment = async (
  _props: z.infer<typeof commentInsertValidationSchema>,
) => {
  try {
    const supabase = createServerActionClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user.id) {
      throw new Error('Unauthorized');
    }

    const { projectId, content } = commentInsertValidationSchema.parse(_props);

    const userId = session.user.id;

    const [newComment] = await db
      .insert(comments)
      .values({
        userId,
        projectId,
        content,
        postedAt: new Date(),
      })
      .returning({ id: comments.id });

    if (!newComment?.id) {
      throw new Error('Could not get id of newly created comment!');
    }

    return {
      success: true,
      commentId: newComment.id,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Could not create comment!',
    };
  }
};

// add like
export const createOrDeleteLike = async (projectId: number) => {
  try {
    const supabase = createServerActionClient({ cookies });

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user.id) {
      throw new Error('Unauthorized');
    }

    const userId = session.user.id;

    // TODO: Make this more efficient by taking the "state" of the like from client, and safely insert/delete in db
    const upvote = await db.query.upvotes.findFirst({
      where: (upv, { eq, and }) =>
        and(eq(upv.userId, userId), eq(upv.projectId, projectId)),
    });
    if (upvote) {
      await db
        .delete(upvotes)
        .where(eq(upvotes.projectId, projectId) && eq(upvotes.userId, userId));
    } else {
      await db.insert(upvotes).values({
        userId: userId,
        projectId,
        timestamp: new Date(),
      });
    }
    // Probably not needed
    revalidatePath(URLs.projectPage(projectId.toString()));
    return {
      success: true,
    };
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Could not create or delete like!',
    };
  }
};

// bookmark
export const createBookmark = async ({
  userId,
  projectId,
}: {
  userId: string;
  projectId: number;
}) => {
  await db.insert(projectBookmarks).values({
    userId: userId,
    projectId,
    timestamp: new Date(),
  });
};
