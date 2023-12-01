import { env } from '@/env';
import { createTRPCRouter, privateProcedure } from '@/server/api/trpc';
import { devApplicationMedia } from '@/server/db/schema';
import { presign } from '@/utils/cloudinary';
import { sendLogToDiscord } from '@/utils/discord';
import { TRPCError } from '@trpc/server';
import cloudinary, { v2 } from 'cloudinary';
import { createHash } from 'crypto';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

export const devApplicationRouter = createTRPCRouter({
  presign: privateProcedure
    .input(
      z.object({
        props: z.record(z.string(), z.string().or(z.number())),
      }),
    )
    .mutation(({ input }) => {
      // timestamp - Unix time in seconds of the current time (e.g., 1315060076).
      const timestamp = Math.round(new Date().getTime() / 1000);
      const signature = v2.utils.api_sign_request(
        { ...input.props, timestamp },
        env.CLOUDINARY_API_SECRET,
      );
      return {
        signature,
        timestamp,
        cloudName: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      };
    }),

  initiateFacecamUpload: privateProcedure
    .input(
      z.object({
        applicationId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      //
      const { applicationId } = input;

      const userId = ctx.session.user.id;
      const userEmail = ctx.session.user.email;

      try {
        const existingDevApplicationForUser =
          await ctx.db.query.devApplications.findFirst({
            where: (da, { and, eq }) =>
              and(eq(da.userId, userId), eq(da.id, applicationId)),

            with: {
              devApplicationMedia: true,
            },
          });

        if (!existingDevApplicationForUser?.id) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: `Could not find existing application for user ${userId} with id ${applicationId}`,
          });
        }

        if (existingDevApplicationForUser.devApplicationMedia?.url) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: `Application already has a facecam video`,
          });
        }

        const uploadInitiatedAt = new Date();

        const filePublicId = createHash('sha256')
          .update(
            JSON.stringify({
              userId,
              userEmail,
              uploadInitiatedAt,
              applicationId,
            }),
          )
          .digest('hex'); // TODO: More programatically generate inputHash, with more params

        const { cloudName, signature, timestamp } = await presign({
          // userId,
          public_id: filePublicId,
        });
        const [devApplicationMediaResult] = await ctx.db
          .insert(devApplicationMedia)
          .values({
            userId,
            type: 'video',
            applicationId,
            publicId: filePublicId,
            // "Expires" in 24 hours
            expiresAt: new Date(
              uploadInitiatedAt.getTime() + 24 * 60 * 60 * 1000,
            ),
            uploadInitiatedAt: uploadInitiatedAt,
          })
          .returning({
            id: devApplicationMedia.id,
          });

        if (!devApplicationMediaResult?.id) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `Could not create dev application media record`,
          });
        }

        const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${'video'}/upload`;

        return {
          success: true,
          uploadUrl,
          public_id: filePublicId,
          signature,
          timestamp,
          devApplicationMediaId: devApplicationMediaResult.id,
        };
      } catch (err) {
        console.error(err);

        await sendLogToDiscord(
          `Error while initiating new Cloudinary image upload: ${
            (err as Error)?.message ?? 'Unknown err...'
          }`,
        );

        return {
          success: false,
          error: (err as Error)?.message ?? 'Could not get upload URL!',
        };
      }
    }),

  validateAndPersistFacecamUpload: privateProcedure
    .input(
      z.object({
        devApplicationId: z.number(),
        publicId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { devApplicationId, publicId } = input;

      const userId = ctx.session.user.id;
      const userEmail = ctx.session.user.email;

      const existingMediaInDb =
        await ctx.db.query.devApplicationMedia.findFirst({
          where: (dam, { eq, and }) =>
            and(
              eq(dam.publicId, publicId),
              eq(dam.applicationId, devApplicationId),
              eq(dam.userId, userId),
            ),
        });

      if (!existingMediaInDb?.id) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Could not find existing application media for user ${userId} with id ${devApplicationId}`,
        });
      }

      if (!existingMediaInDb?.expiresAt) {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'This upload has already been validated and persisted.',
        });
      }

      if (existingMediaInDb?.expiresAt.getTime() < new Date().getTime()) {
        await ctx.db
          .delete(devApplicationMedia)
          .where(eq(devApplicationMedia.id, existingMediaInDb.id));

        return {
          message: 'This upload has expired.',
          success: false,
        };
      }

      cloudinary.v2.config({
        api_key: env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
        api_secret: env.CLOUDINARY_API_SECRET,
        cloud_name: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        secure: true,
      });
      const assetUrl = cloudinary.v2.utils.url(publicId);

      const [updatedRecord] = await ctx.db
        .update(devApplicationMedia)
        .set({
          expiresAt: null,
          updatedAt: new Date(),
          url: assetUrl,
        })
        .where(eq(devApplicationMedia.id, existingMediaInDb.id))
        .returning({ id: devApplicationMedia.id });

      const updatedMediaId = updatedRecord?.id;
      if (!updatedMediaId) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Could not update existing dev application media record`,
        });
      }

      console.log(`💚 Updated media id: ${updatedMediaId}`);

      return {
        success: true,
        message: 'Successfully validated and persisted upload',
      };
    }),
});
