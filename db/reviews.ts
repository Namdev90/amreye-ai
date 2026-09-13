import {sqliteTable,text} from 'drizzle-orm/sqlite-core';
export const implementationReviews=sqliteTable('implementation_reviews',{id:text('id').primaryKey(),status:text('status').notNull(),note:text('note').notNull(),updatedAt:text('updated_at').notNull()});
