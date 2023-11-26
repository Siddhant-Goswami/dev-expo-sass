'use server';

import { recruiterReachouts } from "../db/schema";
import { db } from "../db";

const createRecruiterReachout = async ({
    recruiterId,
    devId,
    workType,
    quotePrice,
    message
}:{
    recruiterId: number,
    devId: number,
    workType: string,
    quotePrice: number,
    message: string
}) => {
    await db.insert(recruiterReachouts).values({
        recruiterId,
        devId,
        workType: workType as 'freelance' | 'full-time',
        quotePrice,
        message,
        timestamp: new Date()
    })
}