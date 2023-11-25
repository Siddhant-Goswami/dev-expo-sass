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

// TODO project info bhi saath main bhejo (n(likes), n(comments), n(bookmarks))

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
    where: eq(projects.userID, userId),
    orderBy: [desc(projects.publishedAt)],
  });

  return userProjects;
};

// get project by ID
export const getProjectById = async (projectId: number) => {
  const project = await db.query.projects.findFirst({
    where: eq(projects.id, projectId),
  });

  const likeCount = (
    await db.query.likes.findMany({
      where: eq(likes.projectID, projectId),
    })
  ).length;

  const commentCount = (
    await db.query.comments.findMany({
      where: eq(comments.projectID, projectId),
    })
  ).length;

  const bookmarkCount = (
    await db.query.projectBookmarks.findMany({
      where: eq(projectBookmarks.projectID, projectId),
    })
  ).length;

  return { project, likeCount, commentCount, bookmarkCount };
};

// create a new project
export const createProject = async ({
  userID,
  title,
  description,
  coverImageUrl,
  hostedUrl,
  sourceCodeUrl,
  tagsList,
}: {
  userID: number;
  title: string;
  description: string;
  coverImageUrl: string;
  hostedUrl: string;
  sourceCodeUrl: string;
  tagsList: Array<{
    name: string;
  }>;
}) => {
  // TODO: slug handling and image handling
  const [result] = await db
    .insert(projects)
    .values({
      userID,
      slug: '',
      title,
      description,
      coverImageUrl,
      hostedUrl,
      sourceCodeUrl,
      publishedAt: new Date(),
    })
    .returning({ projectID: projects.id });

  const projectID = result?.projectID;

  for (const currentTag of tagsList) {
    let [tagResult] = await db.select({ tagID: tags.id }).from(tags);
    let tagID = tagResult!.tagID;

    await db.query.tags.findFirst({
      where: eq(tags.name, currentTag.name),
    });

    if (!tagID) {
      [tagResult] = await db
        .insert(tags)
        .values({
          name: currentTag.name,
        })
        .returning({ tagID: tags.id });
      tagID = tagResult!.tagID;
    }

    await db.insert(projectTags).values({
      projectID,
      tagID,
    });
  }

  return projectID;
};

// add comment
export const createComment = async ({
  userID,
  projectID,
  content,
}: {
  userID: number;
  projectID: number;
  content: string;
}) => {
  const commentID = await db
    .insert(comments)
    .values({
      userID,
      projectID,
      content,
      postedAt: new Date(),
    })
    .returning({ commentID: comments.id });

  return commentID;
};

// add like
export const createLike = async ({
  userID,
  projectID,
}: {
  userID: number;
  projectID: number;
}) => {
  await db.insert(likes).values({
    userID,
    projectID,
    timestamp: new Date(),
  });
};

// bookmark
export const createBookmark = async ({
  userID,
  projectID,
}: {
  userID: number;
  projectID: number;
}) => {
  await db.insert(projectBookmarks).values({
    userID,
    projectID,
    timestamp: new Date(),
  });
};
