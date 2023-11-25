'use server';
import { eq } from "drizzle-orm";

import { db } from "../db";
import { devs, projects, recruiters, users } from "../db/schema";

// create user
export const createUser = async ({
    username,
    displayName,
    displayPictureURL,
    bio,
}:{
    username: string,
    displayName: string,
    displayPictureURL: string,
    bio: string,
}) => {
    const userID = await db.insert(users).values({
        username,
        displayName,
        displayPictureURL,
        bio,
    })

    return userID;
}
// create dev
export const approveDev = async ({
    userID,
    availibity,
    gitHubURL,
    linkedInURL,
    twitterURL,
    websiteURL,

}:{
    userID: number,
    availibity: boolean,
    gitHubURL: string,
    linkedInURL: string,
    twitterURL: string,
    websiteURL: string,
}) => {
    
        await db.insert(devs).values({
            userID,
            availibity,
            gitHubURL,
            linkedInURL,
            twitterURL,
            websiteURL,
        })
}

// create recruiter
export const approveRecruiter = async ({
    userID,
    orgURL,
}:{
    userID: number,
    orgURL: string,
}) => {
    
        await db.insert(recruiters).values({
            userID,
            orgURL,
        })
}

// getUserInfo
export const getUserInfo = async ({userID}:{userID: number}) => {
    const userInfo = await db.query.users.findFirst({
        where: eq(users.id, userID),
        with: {
            dev: true,
            recruiter: true,
        }
    })

    const projectsCount = await db.query.projects.findMany({
        where: eq(projects.userID, userID),
    })

    return {userInfo, projectsCount};
}