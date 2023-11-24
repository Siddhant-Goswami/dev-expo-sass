// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  bigserial,
  index,
  pgTableCreator,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const pgTable = pgTableCreator((name) => `dev-expo_${name}`);

export const users = pgTable(
  'user',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    displayName: varchar('displayName', { length: 256 }).notNull(),
    displayPicture: varchar('displayPicture', { length: 1024 }).notNull(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    devApprovedAt: timestamp('devApprovedAt', { withTimezone: true }),
    recruiterApprovedAt: timestamp('recruiterApprovedAt', {
      withTimezone: true,
    }),
    bio: varchar('bio', { length: 512 }).notNull().default(''),
    tagline: varchar('tagline', { length: 256 }).notNull().default(''),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      // .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),

    // TODO: Add social links and stuff
    // TODO: Add DOB?
  },
  (table) => ({
    displayNameIndex: index('display_name_idx').on(table.displayName),
  }),
);

export const projects = pgTable(
  'project',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: bigserial('userId', { mode: 'number' }).references(() => users.id),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
    publishedAt: timestamp('publishedAt', { withTimezone: true }),
    updatedAt: timestamp('updatedAt', { withTimezone: true })
      .defaultNow()
      .notNull(),

    hostedUrl: varchar('hostedUrl', { length: 1024 }).notNull().default(''),

    coverImageUrl: varchar('coverImageUrl', { length: 1024 })
      .notNull()
      .default(''),

    // ! TODO: This should be either specific to the git provider (github) or a generic URL
    sourceCodeUrl: varchar('sourceCodeUrl', { length: 1024 })
      .notNull()
      .default(''),

    // TODO: Add fields related to git provider
  },
  (table) => {
    return {
      slugIndex: index('slug_idx').on(table.slug),
    };
  },
);

export const projectMedia = pgTable(
  'projectMedia',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectId: bigserial('projectId', { mode: 'number' }).references(
      () => projects.id,
    ),
    type: varchar('type', { length: 50 }).notNull(),
    url: varchar('url', { length: 1024 }).notNull(),
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
    };
  },
);

export const projectCategories = pgTable(
  'projectCategory',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    name: varchar('name', { length: 50 }).notNull(),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    description: varchar('description', { length: 512 }).notNull().default(''),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
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

export const comments = pgTable(
  'comment',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: bigserial('userId', { mode: 'number' }).references(() => users.id),
    projectId: bigserial('projectId', { mode: 'number' }).references(
      () => projects.id,
    ),
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

export const favorites = pgTable(
  'favorite',
  {
    userId: bigserial('userId', { mode: 'number' }).references(() => users.id),
    projectId: bigserial('projectId', { mode: 'number' }).references(
      () => projects.id,
    ),
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

export const projectsCategoriesJoin = pgTable(
  'projectsCategoriesJoin',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectId: bigserial('projectId', { mode: 'number' }).references(
      () => projects.id,
    ),
    categoryId: bigserial('categoryId', { mode: 'number' }).references(
      () => projectCategories.id,
    ),
  },
  (table) => {
    return {
      projectIdIndex: index('project_id_idx').on(table.projectId),
      categoryIdIndex: index('category_id_idx').on(table.categoryId),
    };
  },
);

export const userFollows = pgTable(
  'userFollow',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    followerId: bigserial('followerId', { mode: 'number' }).references(
      () => users.id,
    ),
    followingId: bigserial('followingId', { mode: 'number' }).references(
      () => users.id,
    ),
    timestamp: timestamp('timestamp', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      followerIdIndex: index('follower_id_idx').on(table.followerId),
      followingIdIndex: index('following_id_idx').on(table.followingId),
    };
  },
);

export const projectBookmarks = pgTable(
  'projectBookmark',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectsId: bigserial('projectsId', { mode: 'number' }).references(
      () => projects.id,
    ),
    userId: bigserial('userId', { mode: 'number' }).references(() => users.id),
    timestamp: timestamp('timestamp', { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      projectsIdIndex: index('projects_id_idx').on(table.projectsId),
      userIdIndex: index('user_id_idx').on(table.userId),
    };
  },
);

export const projectViews = pgTable('projectView', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  projectId: bigserial('projectId', { mode: 'number' }).references(
    () => projects.id,
  ),
  uniqueFingerprint: varchar('uniqueFingerprint', { length: 1024 }).notNull(),
  timestamp: timestamp('timestamp', { withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: timestamp('createdAt', { withTimezone: true })
    .defaultNow()
    .notNull(),
});
