'use server';
import { db } from '../db';
import { eq, desc } from 'drizzle-orm';
import {
  comments,
  likes,
  projectBookmarks,
  projectTags,
  projects,
  tags,
} from '../db/schema';

// TODO: filter categories

// get all projects ordered by date
export const getAllProjects = async () => {
  const allProjects = await db.query.projects.findMany({
    orderBy: [desc(projects.publishedAt)],
  });

  return allProjects;
};

// get all projects of a user
export const getUserProjects = async (userId: number) => {
  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    orderBy: [desc(projects.publishedAt)],
  });

  return userProjects;
};

// get project by Id
export const getProjectById = async (projectId: number) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  const likeCount = (
    await db.query.likes.findMany({
      where: eq(likes.projectId, projectId),
    })
  ).length;

  const commentCount = (
    await db.query.comments.findMany({
      where: eq(comments.projectId, projectId),
    })
  ).length;

  const bookmarkCount = (
    await db.query.projectBookmarks.findMany({
      where: eq(projectBookmarks.projectId, projectId),
    })
  ).length;

  return { project, likeCount, commentCount, bookmarkCount };
};

// create a new project
export const createProject = async ({
  userId,
  title,
  description,
  images,
  hostedUrl,
  sourceCodeUrl,
  tagsList,
}: {
  userId: number;
  title: string;
  description: string;
  hostedUrl: string;
  images: FileList[];
  sourceCodeUrl: string;
  tagsList: Array<{
    name: string;
  }>;
}) => {
  // TODO: slug handling and image handling

  const coverImageUrl = '';

  const [result] = await db
    .insert(projects)
    .values({
      userId,
      slug: title,
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
      .where(eq(tags.name, currentTag.name));
    let tagId = tagResult?.tagId;

    await db.query.tags.findFirst({
      where: eq(tags.name, currentTag.name),
    });

    if (!tagId) {
      [tagResult] = await db
        .insert(tags)
        .values({
          name: currentTag.name,
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
      userId,
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
    userId,
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
    userId,
    projectId,
    timestamp: new Date(),
  });
};
