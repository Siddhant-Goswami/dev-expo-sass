'use server';
import { projectFormSchema } from '@/lib/validations/project';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { desc, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { db } from '../db';
import {
  comments,
  likes,
  projectBookmarks,
  projectTags,
  projects,
  tags as tagsTable,
  userProfiles,
  type ProjectSelect,
  type UserProfileSelect,
  projectMedia,
} from '../db/schema';

// TODO: filter categories

// get all projects ordered by date
// for home feed
export const getAllProjects = async ({
  limit,
  offset,
}: {
  limit?: number;
  offset?: number;
}) => {
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
    where: eq(projects.userId, userId.toString()),
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
    .from(likes)
    .where(eq(likes.projectId, projectWithMedia.id));

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

export const getProjectLikes = async ({ projectId }: { projectId: number }) => {
  const totalLikes = await db
    .select({ recordCount: sql`COUNT(*)` })
    .from(likes)
    .where(eq(likes.projectId, projectId));
  return Number(totalLikes[0]?.recordCount);
};

export const isLikedByUser = async ({ projectId }: { projectId: number }) => {
  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const likes = await db.query.likes.findMany({
    where: (likes, { eq }) => eq(likes.projectId, projectId),
  });
  const hasUserLiked = likes.find((like) => like.userId === userId);
  return !!hasUserLiked;
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

  return { projectId };
};

export const deleteProject = async (projectId: number) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });
  if (!project) {
    throw new Error('Project not found');
  }
  await db.delete(projectTags).where(eq(projectTags.projectId, projectId));
  await db.delete(likes).where(eq(likes.projectId, projectId));
  await db.delete(projectMedia).where(eq(projectMedia.projectId, projectId));
  await db.delete(projects).where(eq(projects.id, projectId));
  redirect('/feed');
};

// add comment
export const createComment = async ({
  userId,
  projectId,
  content,
}: {
  userId: number;
  projectId: number;
  content: string;
}) => {
  const commentId = await db
    .insert(comments)
    .values({
      userId: userId.toString(),
      projectId,
      content,
      postedAt: new Date(),
    })
    .returning({ commentId: comments.id });

  return commentId;
};

// add like
export const createOrDeleteLike = async (projectId: number) => {
  const supabase = createServerActionClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.user.id) {
    throw new Error('Unauthorized');
  }

  const userId = session.user.id;

  const like = await db.query.likes.findFirst({
    where: eq(likes.userId, userId) && eq(likes.projectId, projectId),
  });
  if (like) {
    await db
      .delete(likes)
      .where(eq(likes.projectId, projectId) && eq(likes.userId, userId));
    return;
  }
  await db.insert(likes).values({
    userId: userId.toString(),
    projectId,
    timestamp: new Date(),
  });
  revalidatePath(`/projects/${projectId}`);
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

export const deleteAllLikes = async () => {
  await db.delete(likes);
};

export const getAllLikes = async () => {
  const likes = await db.query.likes.findMany();
  console.log(likes);
};
