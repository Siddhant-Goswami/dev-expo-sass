// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  bigserial,
  boolean,
  index,
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

export const users = pgTable(
  'userProfile',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
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
    displayNameIndex: index('display_name_idx').on(table.displayName),
  }),
);

export const devs = pgTable('devProfile', {
  userId: bigserial('userId', { mode: 'number' })
    .primaryKey()
    .references(() => users.id),
  availibity: boolean('availibity').notNull().default(true),
  devApprovedAt: timestamp('devApprovedAt', { withTimezone: true }),
  gitHubUrl: varchar('gitHubUrl', { length: 1024 }),
  linkedInUrl: varchar('linkedInUrl', { length: 1024 }),
  twitterUrl: varchar('twitterUrl', { length: 1024 }),
  websiteUrl: varchar('websiteUrl', { length: 1024 }),
});

export const recruiters = pgTable('recruiterProfile', {
  userId: bigserial('userId', { mode: 'number' })
    .primaryKey()
    .references(() => users.id),
  orgUrl: varchar('orgUrl', { length: 1024 }),
});

export const projects = pgTable(
  'project',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: bigserial('userId', { mode: 'number' }).references(() => users.id),
    title: varchar('title', { length: 50 }).notNull(),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    description: varchar('description', { length: 6000 }).notNull().default(''),
    coverImageUrl: varchar('coverImageUrl', { length: 1024 })
      .notNull()
      .default(''),
    hostedUrl: varchar('hostedUrl', { length: 1024 }).notNull().default(''),
    // ! TODO: This should be either specific to the git provider (github) or a generic URL
    sourceCodeUrl: varchar('sourceCodeUrl', { length: 1024 })
      .notNull()
      .default(''),
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
    projectId: bigserial('projectId', { mode: 'number' }).references(
      () => projects.id,
    ),
    tagId: bigserial('tagId', { mode: 'number' }).references(() => tags.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.projectId, table.tagId] }),
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

export const comments = pgTable(
  'comment',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userId: bigserial('userId', { mode: 'number' })
      .references(() => users.id)
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

export const projectBookmarks = pgTable(
  'projectBookmark',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectId: bigserial('projectId', { mode: 'number' }).references(
      () => projects.id,
    ),
    userId: bigserial('userId', { mode: 'number' }).references(() => users.id),
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
