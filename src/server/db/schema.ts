// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { InferInsertModel, InferSelectModel, relations } from 'drizzle-orm';
import {
  bigserial,
  boolean,
  index,
  integer,
  pgTableCreator,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `dev_expo_${name}`);

const commonUserIdSchema = (tableName: string) =>
  varchar(tableName, { length: 100 });

export const userProfiles = pgTable(
  'userProfile',
  {
    id: commonUserIdSchema('id').primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    displayName: varchar('displayName', { length: 256 }).notNull(),
    displayPictureUrl: varchar('displayPictureUrl', { length: 1024 })
      .notNull()
      .default(''),
    bio: varchar('bio', { length: 512 }).notNull().default(''),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    usernameIndex: index('username_idx').on(table.username),
    displayNameIndex: index('display_name_idx').on(table.displayName),
  }),
);

export type UserProfileSelect = InferSelectModel<typeof userProfiles>;
export type UserProfileInsert = InferInsertModel<typeof userProfiles>;

export const devProfiles = pgTable('devProfile', {
  userId: commonUserIdSchema('userId')
    .primaryKey()
    .references(() => userProfiles.id),
  availibity: boolean('availibity').notNull().default(true),
  devApprovedAt: timestamp('devApprovedAt', {
    withTimezone: true,
  }).defaultNow(),
  gitHubUrl: varchar('gitHubUrl', { length: 1024 }).notNull(),
  linkedInUrl: varchar('linkedInUrl', { length: 1024 }),
  twitterUrl: varchar('twitterUrl', { length: 1024 }),
  websiteUrl: varchar('websiteUrl', { length: 1024 }),
});

export type DevProfileSelect = InferSelectModel<typeof devProfiles>;
export type DevProfileInsert = InferInsertModel<typeof devProfiles>;

export const devApplications = pgTable('devApplication', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  userId: commonUserIdSchema('userId')
    .references(() => userProfiles.id)
    .notNull(),
  displayName: varchar('displayName', { length: 256 }).notNull(),
  bio: varchar('bio', { length: 500 }).notNull(),
  applicationVideoPublicId: varchar('applicationVideoPublicId', {
    length: 1024,
  }),
  appliedAt: timestamp('appliedAt', { withTimezone: true }).notNull(),
  status: varchar('status', { enum: ['pending', 'approved', 'rejected'] })
    .notNull()
    .default('pending'),
  websiteUrl: varchar('websiteUrl', { length: 1024 }),
  gitHubUrl: varchar('gitHubUrl', { length: 1024 }).notNull(),
  twitterUrl: varchar('twitterUrl', { length: 1024 }),
  linkedInUrl: varchar('linkedInUrl', { length: 1024 }),
});

export type DevApplicationSelect = InferSelectModel<typeof devApplications>;
export type DevApplicationInsert = InferInsertModel<typeof devApplications>;

export const recruiterProfiles = pgTable('recruiterProfile', {
  userId: commonUserIdSchema('userId')
    .primaryKey()
    .references(() => userProfiles.id),
  orgUrl: varchar('orgUrl', { length: 1024 }),
});

export type RecruiterProfileSelect = InferSelectModel<typeof recruiterProfiles>;
export type RecruiterProfileInsert = InferInsertModel<typeof recruiterProfiles>;

export const projects = pgTable(
  'project',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: commonUserIdSchema('userId')
      .references(() => userProfiles.id)
      .notNull(),
    title: varchar('title', { length: 50 }).notNull(),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    description: varchar('description', { length: 6000 }).notNull().default(''),
    hostedUrl: varchar('hostedUrl', { length: 1024 }),
    youtubeUrl: varchar('youtubeUrl', { length: 1024 }),
    // ! TODO: This should be either specific to the git provider (github) or a generic URL
    sourceCodeUrl: varchar('sourceCodeUrl', { length: 1024 }),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    publishedAt: timestamp('publishedAt', { withTimezone: true }),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      slugIndex: index('slug_idx').on(table.slug),
    };
  },
);

export type ProjectSelect = InferSelectModel<typeof projects>;
export type ProjectInsert = InferInsertModel<typeof projects>;

export const tags = pgTable(
  'tag',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: varchar('name', { length: 50 }).notNull().unique(),
    isCategory: boolean('isCategory').notNull().default(false),
    description: varchar('description', { length: 512 }).notNull().default(''),
  },
  (table) => {
    return {
      nameIndex: index('name_idx').on(table.name),
      isCatgeoryIndex: index('is_category_idx').on(table.isCategory),
    };
  },
);

export const projectTags = pgTable(
  'projectTag',
  {
    projectId: bigserial('projectId', { mode: 'number' })
      .references(() => projects.id)
      .notNull(),
    tagId: bigserial('tagId', { mode: 'number' }).references(() => tags.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.projectId, table.tagId] }),
    };
  },
);

type ProjectMediaType = 'image' | 'video';
export const projectMedia = pgTable(
  'projectMedia',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectId: bigserial('projectId', { mode: 'number' })
      .references(() => projects.id)
      .notNull(),
    type: varchar('type', { length: 50 }).$type<ProjectMediaType>().notNull(),
    url: varchar('url', { length: 1024 }),

    uploadInitiatedAt: timestamp('uploadInitiatedAt', { withTimezone: true })
      .notNull()
      .defaultNow(),

    expiresAt: timestamp('expiresAt', { withTimezone: true }),

    userId: commonUserIdSchema('userId')
      .notNull()
      .references(() => userProfiles.id),

    // TODO: Add data specific to different upload providers, like S3 keys and cloudinary public ids...
    publicId: varchar('publicId', { length: 2048 }).notNull().unique(), // Cloudinary public id

    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      typeIndex: index('type_idx').on(table.type),
      projectIdIndex: index('project_id_idx').on(table.projectId),
      userIdIndex: index('user_id_idx').on(table.userId),
      publicIdIndex: index('public_id_idx').on(table.publicId),
      expiresAtIndex: index('expires_at_idx').on(table.expiresAt),
    };
  },
);

export type ProjectMediaSelect = InferSelectModel<typeof projectMedia>;
export type ProjectMediaInsert = InferInsertModel<typeof projectMedia>;

export const comments = pgTable(
  'comment',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: commonUserIdSchema('userId')
      .references(() => userProfiles.id)
      .notNull(),
    projectId: bigserial('projectId', { mode: 'number' })
      .references(() => projects.id)
      .notNull(),
    content: varchar('content', { length: 1500 }).notNull(),
    postedAt: timestamp('postedAt', { withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIndex: index('user_id_idx').on(table.userId),
      projectIdIndex: index('project_id_idx').on(table.projectId),
    };
  },
);

export const likes = pgTable(
  'likes',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: commonUserIdSchema('userId')
      .references(() => userProfiles.id)
      .notNull(),
    projectId: bigserial('projectId', { mode: 'number' })
      .references(() => projects.id)
      .notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIndex: index('user_id_idx').on(table.userId),
      projectIdIndex: index('project_id_idx').on(table.projectId),
    };
  },
);

export const projectBookmarks = pgTable(
  'projectBookmark',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectId: bigserial('projectId', { mode: 'number' })
      .references(() => projects.id)
      .notNull(),
    userId: commonUserIdSchema('userId')
      .references(() => userProfiles.id)
      .notNull(),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      projectsIdIndex: index('projects_id_idx').on(table.projectId),
      userIdIndex: index('user_id_idx').on(table.userId),
    };
  },
);

export const recruiterReachouts = pgTable('recruiterReachout', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  recruiterId: commonUserIdSchema('recruiterId')
    .references(() => userProfiles.id)
    .notNull(),
  devId: commonUserIdSchema('devId')
    .references(() => userProfiles.id)
    .notNull(),
  workType: varchar('workType', { enum: ['freelance', 'full-time'] }).notNull(),
  quotePrice: integer('quotePrice').notNull(),
  message: varchar('message', { length: 1500 }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export type RecruiterReachoutSelect = InferSelectModel<
  typeof recruiterReachouts
>;
export type RecruiterReachoutInsert = InferInsertModel<
  typeof recruiterReachouts
>;

export const userProfileRelations = relations(userProfiles, ({ one, many }) => {
  return {
    projects: many(projects),
    devProfiles: one(devProfiles, {
      fields: [userProfiles.id],
      references: [devProfiles.userId],
    }),
    recruiterProfiles: one(recruiterProfiles, {
      fields: [userProfiles.id],
      references: [recruiterProfiles.userId],
    }),
  };
});

export const projectsRelation = relations(projects, ({ one, many }) => {
  return {
    userProfile: one(userProfiles, {
      fields: [projects.userId],
      references: [userProfiles.id],
    }),
    projectTags: many(projectTags),
    projectMedia: many(projectMedia),
    comments: many(comments),
    likes: many(likes),
    projectBookmarks: many(projectBookmarks),
  };
});

export const tagsRelation = relations(tags, ({ many }) => {
  return {
    projectTags: many(projectTags),
  };
});

export const projectTagsRelation = relations(projectTags, ({ one }) => {
  return {
    project: one(projects, {
      fields: [projectTags.projectId],
      references: [projects.id],
    }),
    tag: one(tags, { fields: [projectTags.tagId], references: [tags.id] }),
  };
});

export const projectMediaRelation = relations(projectMedia, ({ one }) => {
  return {
    project: one(projects, {
      fields: [projectMedia.projectId],
      references: [projects.id],
    }),
  };
});
