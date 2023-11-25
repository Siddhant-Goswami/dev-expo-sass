// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  bigserial,
  boolean,
  index,
  pgTable,
  primaryKey,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

// user.displayname pe index kyun? username pe rehna chahiye
// project-devs join table

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
// export const pgTable = pgTableCreator((name) => `dev-expo_${name}`);

export const users = pgTable(
  'user',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    username: varchar('username', { length: 50 }).notNull().unique(),
    displayName: varchar('displayName', { length: 256 }).notNull(),
    displayPictureURL: varchar('displayPictureURL', { length: 1024 })
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

export const devs = pgTable('dev', {
  userID: bigserial('userId', { mode: 'number' })
    .primaryKey()
    .references(() => users.id),
  availibity: boolean('availibity').notNull().default(true),
  devApprovedAt: timestamp('devApprovedAt', { withTimezone: true }),
  gitHubURL: varchar('gitHubURL', { length: 1024 }),
  linkedInURL: varchar('linkedInURL', { length: 1024 }),
  twitterURL: varchar('twitterURL', { length: 1024 }),
  websiteURL: varchar('websiteURL', { length: 1024 }),
});

export const recruiters = pgTable('recruiter', {
  userID: bigserial('userId', { mode: 'number' })
    .primaryKey()
    .references(() => users.id),
  orgURL: varchar('websiteURL', { length: 1024 }),
});

export const projects = pgTable(
  'project',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userID: bigserial('userID', { mode: 'number' }).references(() => users.id),
    title: varchar('title', { length: 50 }).notNull(),
    slug: varchar('slug', { length: 50 }).notNull().unique(),
    description: varchar('description', { length: 2000 }).notNull().default(''),
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
    desccription: varchar('description', { length: 512 }).notNull().default(''),
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
    projectID: bigserial('projectID', { mode: 'number' }).references(
      () => projects.id,
    ),
    tagID: bigserial('tagID', { mode: 'number' }).references(() => tags.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.projectID, table.tagID] }),
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
    userID: bigserial('userID', { mode: 'number' })
      .references(() => users.id)
      .notNull(),
    projectID: bigserial('projectID', { mode: 'number' })
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
      userIdIndex: index('user_id_idx').on(table.userID),
      projectIdIndex: index('project_id_idx').on(table.projectID),
    };
  },
);

export const likes = pgTable(
  'likes',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    userID: bigserial('userID', { mode: 'number' }).references(() => users.id),
    projectID: bigserial('projectID', { mode: 'number' }).references(
      () => projects.id,
    ),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      userIdIndex: index('user_id_idx').on(table.userID),
      projectIdIndex: index('project_id_idx').on(table.projectID),
    };
  },
);

export const projectBookmarks = pgTable(
  'projectBookmark',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    projectID: bigserial('projectID', { mode: 'number' }).references(
      () => projects.id,
    ),
    userID: bigserial('userID', { mode: 'number' }).references(() => users.id),
    timestamp: timestamp('timestamp', { withTimezone: true }).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => {
    return {
      projectsIdIndex: index('projects_id_idx').on(table.projectID),
      userIdIndex: index('user_id_idx').on(table.userID),
    };
  },
);
