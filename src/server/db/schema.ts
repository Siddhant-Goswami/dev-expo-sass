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
    userId: bigserial('userId', { mode: 'number' }).primaryKey(), // Comes from Clerk
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
    userId: bigserial('userId', { mode: 'number' }).references(
      () => users.userId,
    ),
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
