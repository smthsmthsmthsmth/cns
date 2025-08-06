import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const topics = pgTable("topics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  progress: integer("progress").notNull().default(0),
  status: text("status").notNull().default("not-started"), // "not-started", "in-progress", "completed"
  order: integer("order").notNull().default(0),
});

export const studyGuides = pgTable("study_guides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topicId: varchar("topic_id").references(() => topics.id),
  title: text("title").notNull(),
  fileName: text("file_name").notNull(),
  filePath: text("file_path").notNull(),
  totalPages: integer("total_pages"),
  currentPage: integer("current_page").default(1),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topicId: varchar("topic_id").references(() => topics.id),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  platform: text("platform"), // "youtube", "khan-academy", "osmosis", etc.
  duration: text("duration"),
  thumbnailUrl: text("thumbnail_url"),
  addedAt: timestamp("added_at").defaultNow(),
});

export const scheduleItems = pgTable("schedule_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topicId: varchar("topic_id").references(() => topics.id),
  title: text("title").notNull(),
  description: text("description"),
  startTime: timestamp("start_time").notNull(),
  endTime: timestamp("end_time").notNull(),
  status: text("status").notNull().default("not-started"), // "not-started", "in-progress", "completed"
  createdAt: timestamp("created_at").defaultNow(),
});

export const bookmarks = pgTable("bookmarks", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(), // "pdf", "video", "note"
  resourceId: varchar("resource_id").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  pageNumber: integer("page_number"), // for PDF bookmarks
  timestamp: text("timestamp"), // for video bookmarks
  createdAt: timestamp("created_at").defaultNow(),
});

export const notes = pgTable("notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  topicId: varchar("topic_id").references(() => topics.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const studyProgress = pgTable("study_progress", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  totalTopics: integer("total_topics").notNull().default(0),
  completedTopics: integer("completed_topics").notNull().default(0),
  studyHours: integer("study_hours").notNull().default(0),
  videosWatched: integer("videos_watched").notNull().default(0),
  bookmarkCount: integer("bookmark_count").notNull().default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertTopicSchema = createInsertSchema(topics).omit({ id: true });
export const insertStudyGuideSchema = createInsertSchema(studyGuides).omit({ id: true, uploadedAt: true });
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, addedAt: true });
export const insertScheduleItemSchema = createInsertSchema(scheduleItems).omit({ id: true, createdAt: true });
export const insertBookmarkSchema = createInsertSchema(bookmarks).omit({ id: true, createdAt: true });
export const insertNoteSchema = createInsertSchema(notes).omit({ id: true, createdAt: true, updatedAt: true });
export const insertStudyProgressSchema = createInsertSchema(studyProgress).omit({ id: true, updatedAt: true });

// Types
export type Topic = typeof topics.$inferSelect;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type StudyGuide = typeof studyGuides.$inferSelect;
export type InsertStudyGuide = z.infer<typeof insertStudyGuideSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type ScheduleItem = typeof scheduleItems.$inferSelect;
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type Bookmark = typeof bookmarks.$inferSelect;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type Note = typeof notes.$inferSelect;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type StudyProgress = typeof studyProgress.$inferSelect;
export type InsertStudyProgress = z.infer<typeof insertStudyProgressSchema>;
