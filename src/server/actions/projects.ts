import { db } from "../db";
// import { projects } from "../db/schema";
import { eq, desc } from "drizzle-orm";
import { projects } from "../db/schema";

// table ka naam ya model ka naam?

// get all projects ordered by date
const getAllProjects = async () => {

    const allProjects = await db.query.projects.findMany({
        orderBy: [desc(projects.publishedAt)],
    })

    return allProjects;
}

// get all projects of a user
const getUserProjects = async (userId: number) => {

    const userProjects = await db.query.projects.findMany({
        where: eq(projects.userId, userId),
        orderBy: [desc(projects.publishedAt)],
    });

    return userProjects;
}

// create a new project
const createProject = async ({userId, title, description, coverImageUrl, hostedUrl, sourceCodeUrl, tags}) => {

    // TODO: slug handling and image handling
    const projectID = await db.insert(projects).values({
        userId,
        title,
        description,
        coverImageUrl,
        hostedUrl,
        sourceCodeUrl,
        publishedAt : new Date(),  
    }).returning({projectID: project.projectID});

    tags.forEach(async (currentTag) => {

        let tagID = db.query.tag.findOne({
            where: eq(currentTag.name, tag.name),
        })

        if(!tagID) {
            tagID = await db.insert(tags).values({
                name: currentTag.name,
            }).returning({tagID: tag.tagID});
        }

        await db.insert(projectTags).values({
            projectID,
            tagID: tag.tagID,
        });
    })
} 

// add comment

const createComment = async ({userID, projectID, content}) => {

    const commentID = await db.insert(comments).values({
        userID,
        projectID,
        content,
        createdAt: new Date(),
    }).returning({commentID: comment.commentID});

    return commentID;
}

// add like
// bookmark
