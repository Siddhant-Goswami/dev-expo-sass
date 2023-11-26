'use server';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db';
import {
  ProjectInsert,
  ProjectSelect,
  UserProfileSelect,
  comments,
  likes,
  projectBookmarks,
  projectMedia,
  projectTags,
  projects,
  tags,
  userProfiles,
} from '../db/schema';

// TODO: filter categories

// get all projects ordered by date
// for home feed
export const getAllProjects = async () => {
  const allProjects = await db
    .select()
    .from(projects)
    .orderBy(desc(projects.publishedAt));
  const result = allProjects.map(async (project) => {
    const devId = project.userId;
    const userPromise = db.query.userProfiles.findFirst({
      where: eq(userProfiles.id, devId),
    });
    const tagsPromise = db.query.projectTags.findMany({
      where: eq(projectTags.projectId, project.id),
    });
    const mediaPromise = db.query.projectMedia.findMany({
      where: eq(projectMedia.projectId, project.id),
    });
    const [user, tags, media] = await Promise.all([
      userPromise,
      tagsPromise,
      mediaPromise,
    ]);
    return {
      project,
      user,
      tags,
      media,
    };
  });
  return await Promise.all(result);
};

// get all projects of a user
export const getProjectsByUserId = async (userId: UserProfileSelect['id']) => {
  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, userId.toString()),
    orderBy: [desc(projects.publishedAt)],
  });
  console.log(userProjects);
  return userProjects;
};

// get project by Id
export const getProjectById = async (projectId: ProjectSelect['id']) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  if (!project) {
    return null;
  }

  const tagsPromise = db.query.projectTags.findMany({
    where: eq(projectTags.projectId, project.id),
  });

  const mediaPromise = db.query.projectMedia.findMany({
    where: eq(projectMedia.projectId, project.id),
  });

  const userPromise = db.query.userProfiles.findFirst({
    where: eq(userProfiles.id, project?.userId),
  });

  const [tags, media, user] = await Promise.all([
    tagsPromise,
    mediaPromise,
    userPromise,
  ]);

  // const likeCount = (
  //   await db.query.likes.findMany({
  //     where: eq(likes.projectId, projectId),
  //   })
  // ).length;

  // const commentCount = (
  //   await db.query.comments.findMany({
  //     where: eq(comments.projectId, projectId),
  //   })
  // ).length;

  // const bookmarkCount = (
  //   await db.query.projectBookmarks.findMany({
  //     where: eq(projectBookmarks.projectId, projectId),
  //   })
  // ).length;

  return {
    project,
    dev: user,
    tags,
    media,
  };
};

// create a new project
export const createProject = async ({
  userId,
  title,
  description,
  // images,
  hostedUrl,
  sourceCodeUrl,
  tagsList,
}: ProjectInsert & {
  tagsList: string[];
}) => {
  // TODO: slug handling and image handling

  const coverImageUrl = '';

  const [result] = await db
    .insert(projects)
    .values({
      userId: userId.toString(),
      slug:
        title.replace(/\s+/g, '-').toLowerCase() + '-' + Date.now().toString(),
      title,
      description,
      coverImageUrl,
      hostedUrl,
      sourceCodeUrl,
      publishedAt: new Date(),
    })
    .returning({ projectId: projects.id });

  const projectId = result?.projectId;

  for (const currentTag of tagsList) {
    let [tagResult] = await db
      .select({ tagId: tags.id })
      .from(tags)
      .where(eq(tags.name, currentTag));
    let tagId = tagResult?.tagId;

    await db.query.tags.findFirst({
      where: eq(tags.name, currentTag),
    });

    if (!tagId) {
      [tagResult] = await db
        .insert(tags)
        .values({
          name: currentTag,
        })
        .returning({ tagId: tags.id });
      tagId = tagResult!.tagId;
    }

    await db.insert(projectTags).values({
      projectId,
      tagId,
    });
  }

  return projectId;
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
export const createLike = async ({
  userId,
  projectId,
}: {
  userId: number;
  projectId: number;
}) => {
  await db.insert(likes).values({
    userId: userId.toString(),
    projectId,
    timestamp: new Date(),
  });
};

// bookmark
export const createBookmark = async ({
  userId,
  projectId,
}: {
  userId: number;
  projectId: number;
}) => {
  await db.insert(projectBookmarks).values({
    userId: userId.toString(),
    projectId,
    timestamp: new Date(),
  });
};
