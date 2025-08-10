import { z } from "zod";
import mongoose from "mongoose";

// MongoDB Document Interfaces
export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopic extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudyGuide extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  title: string;
  fileName: string;
  compressedData: Buffer; // Store compressed PDF data in database
  originalSize: number; // Original file size in bytes
  compressedSize: number; // Compressed size in bytes
  totalPages?: number;
  currentPage: number;
  uploadedAt: Date;
  updatedAt: Date;
}

export interface IVideo extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  url: string;
  platform: string;
  duration?: number;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IScheduleItem extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface IBookmark extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  resourceType: 'study-guide' | 'video';
  resourceId: mongoose.Types.ObjectId;
  resourceTitle: string;
  title: string;
  description?: string;
  pageNumber?: number;
  timestamp?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface INote extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  topicId?: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStudyProgress extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  totalTopics: number;
  completedTopics: number;
  studyHours: number;
  videosWatched: number;
  bookmarkCount: number;
  updatedAt: Date;
}

// TypeScript types
export type User = IUser;
export type Topic = ITopic;
export type StudyGuide = IStudyGuide;
export type Video = IVideo;
export type ScheduleItem = IScheduleItem;
export type Bookmark = IBookmark;
export type Note = INote;
export type StudyProgress = IStudyProgress;

// Zod schemas for validation
export const insertUserSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required")
});

export const loginSchema = z.object({
  email: z.string().email("Must be a valid email"),
  password: z.string().min(1, "Password is required")
});

// Client-side schemas (without userId - it comes from auth header)
export const createTopicSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color").optional()
});

// Server-side schemas (with userId for database operations)
export const insertTopicSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, "Color must be a valid hex color")
});

export const insertStudyGuideSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  topicId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  fileName: z.string().min(1, "File name is required"),
  compressedData: z.instanceof(Buffer, { message: "Compressed data is required" }),
  originalSize: z.number().min(1, "Original size is required"),
  compressedSize: z.number().min(1, "Compressed size is required"),
  totalPages: z.number().optional(),
  currentPage: z.number().default(1)
});

export const insertVideoSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  topicId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  url: z.string().url("Must be a valid URL"),
  platform: z.string().optional(), // Made optional to match frontend
  duration: z.number().optional(),
  thumbnailUrl: z.string().url("Must be a valid URL").optional()
});

export const insertScheduleItemSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  topicId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  startTime: z.string().datetime("Must be a valid datetime"),
  endTime: z.string().datetime("Must be a valid datetime"),
  status: z.enum(['pending', 'in-progress', 'completed']).default('pending')
});

export const insertBookmarkSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  resourceType: z.enum(['study-guide', 'video']),
  resourceId: z.string().min(1, "Resource ID is required"),
  resourceTitle: z.string().min(1, "Resource title is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  pageNumber: z.number().optional(),
  timestamp: z.number().optional()
});

export const insertNoteSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  topicId: z.string().optional(),
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required")
});

export const insertStudyProgressSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  totalTopics: z.number().default(0),
  completedTopics: z.number().default(0),
  studyHours: z.number().default(0),
  videosWatched: z.number().default(0),
  bookmarkCount: z.number().default(0)
});

// Type exports for insert operations
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertStudyGuide = z.infer<typeof insertStudyGuideSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertStudyProgress = z.infer<typeof insertStudyProgressSchema>;
