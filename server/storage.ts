import { 
  type Topic, type InsertTopic,
  type StudyGuide, type InsertStudyGuide,
  type Video, type InsertVideo,
  type ScheduleItem, type InsertScheduleItem,
  type Bookmark, type InsertBookmark,
  type Note, type InsertNote,
  type StudyProgress, type InsertStudyProgress
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Topics
  getTopics(): Promise<Topic[]>;
  getTopic(id: string): Promise<Topic | undefined>;
  createTopic(topic: InsertTopic): Promise<Topic>;
  updateTopic(id: string, topic: Partial<InsertTopic>): Promise<Topic>;
  deleteTopic(id: string): Promise<boolean>;

  // Study Guides
  getStudyGuides(): Promise<StudyGuide[]>;
  getStudyGuidesByTopic(topicId: string): Promise<StudyGuide[]>;
  getStudyGuide(id: string): Promise<StudyGuide | undefined>;
  createStudyGuide(guide: InsertStudyGuide): Promise<StudyGuide>;
  updateStudyGuide(id: string, guide: Partial<InsertStudyGuide>): Promise<StudyGuide>;
  deleteStudyGuide(id: string): Promise<boolean>;

  // Videos
  getVideos(): Promise<Video[]>;
  getVideosByTopic(topicId: string): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: Partial<InsertVideo>): Promise<Video>;
  deleteVideo(id: string): Promise<boolean>;

  // Schedule Items
  getScheduleItems(): Promise<ScheduleItem[]>;
  getScheduleItemsForDate(date: Date): Promise<ScheduleItem[]>;
  getScheduleItem(id: string): Promise<ScheduleItem | undefined>;
  createScheduleItem(item: InsertScheduleItem): Promise<ScheduleItem>;
  updateScheduleItem(id: string, item: Partial<InsertScheduleItem>): Promise<ScheduleItem>;
  deleteScheduleItem(id: string): Promise<boolean>;

  // Bookmarks
  getBookmarks(): Promise<Bookmark[]>;
  getBookmark(id: string): Promise<Bookmark | undefined>;
  createBookmark(bookmark: InsertBookmark): Promise<Bookmark>;
  updateBookmark(id: string, bookmark: Partial<InsertBookmark>): Promise<Bookmark>;
  deleteBookmark(id: string): Promise<boolean>;

  // Notes
  getNotes(): Promise<Note[]>;
  getNotesByTopic(topicId: string): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: string, note: Partial<InsertNote>): Promise<Note>;
  deleteNote(id: string): Promise<boolean>;

  // Study Progress
  getStudyProgress(): Promise<StudyProgress>;
  updateStudyProgress(progress: Partial<InsertStudyProgress>): Promise<StudyProgress>;
}

export class MemStorage implements IStorage {
  private topics: Map<string, Topic>;
  private studyGuides: Map<string, StudyGuide>;
  private videos: Map<string, Video>;
  private scheduleItems: Map<string, ScheduleItem>;
  private bookmarks: Map<string, Bookmark>;
  private notes: Map<string, Note>;
  private studyProgress: StudyProgress;

  constructor() {
    this.topics = new Map();
    this.studyGuides = new Map();
    this.videos = new Map();
    this.scheduleItems = new Map();
    this.bookmarks = new Map();
    this.notes = new Map();
    
    // Initialize with default CNS topics and study progress
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize CNS topics
    const defaultTopics = [
      { name: "Neuroanatomy", description: "Structure of the nervous system", progress: 100, status: "completed", order: 1 },
      { name: "Neurophysiology", description: "Function of nervous system components", progress: 90, status: "completed", order: 2 },
      { name: "Neuropharmacology", description: "Drug effects on the nervous system", progress: 65, status: "in-progress", order: 3 },
      { name: "Neuropathology", description: "Diseases of the nervous system", progress: 0, status: "not-started", order: 4 },
      { name: "Neurodevelopment", description: "Development of the nervous system", progress: 0, status: "not-started", order: 5 },
      { name: "Clinical Neurology", description: "Clinical applications and case studies", progress: 0, status: "not-started", order: 6 },
    ];

    defaultTopics.forEach(topic => {
      const id = randomUUID();
      this.topics.set(id, { ...topic, id });
    });

    // Initialize study progress
    this.studyProgress = {
      id: randomUUID(),
      totalTopics: defaultTopics.length,
      completedTopics: 2,
      studyHours: 47,
      videosWatched: 23,
      bookmarkCount: 8,
      updatedAt: new Date(),
    };
  }

  // Topics
  async getTopics(): Promise<Topic[]> {
    return Array.from(this.topics.values()).sort((a, b) => a.order - b.order);
  }

  async getTopic(id: string): Promise<Topic | undefined> {
    return this.topics.get(id);
  }

  async createTopic(insertTopic: InsertTopic): Promise<Topic> {
    const id = randomUUID();
    const topic: Topic = { ...insertTopic, id };
    this.topics.set(id, topic);
    return topic;
  }

  async updateTopic(id: string, updates: Partial<InsertTopic>): Promise<Topic> {
    const existing = this.topics.get(id);
    if (!existing) throw new Error("Topic not found");
    
    const updated = { ...existing, ...updates };
    this.topics.set(id, updated);
    return updated;
  }

  async deleteTopic(id: string): Promise<boolean> {
    return this.topics.delete(id);
  }

  // Study Guides
  async getStudyGuides(): Promise<StudyGuide[]> {
    return Array.from(this.studyGuides.values());
  }

  async getStudyGuidesByTopic(topicId: string): Promise<StudyGuide[]> {
    return Array.from(this.studyGuides.values()).filter(guide => guide.topicId === topicId);
  }

  async getStudyGuide(id: string): Promise<StudyGuide | undefined> {
    return this.studyGuides.get(id);
  }

  async createStudyGuide(insertGuide: InsertStudyGuide): Promise<StudyGuide> {
    const id = randomUUID();
    const guide: StudyGuide = { ...insertGuide, id, uploadedAt: new Date() };
    this.studyGuides.set(id, guide);
    return guide;
  }

  async updateStudyGuide(id: string, updates: Partial<InsertStudyGuide>): Promise<StudyGuide> {
    const existing = this.studyGuides.get(id);
    if (!existing) throw new Error("Study guide not found");
    
    const updated = { ...existing, ...updates };
    this.studyGuides.set(id, updated);
    return updated;
  }

  async deleteStudyGuide(id: string): Promise<boolean> {
    return this.studyGuides.delete(id);
  }

  // Videos
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideosByTopic(topicId: string): Promise<Video[]> {
    return Array.from(this.videos.values()).filter(video => video.topicId === topicId);
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { ...insertVideo, id, addedAt: new Date() };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: string, updates: Partial<InsertVideo>): Promise<Video> {
    const existing = this.videos.get(id);
    if (!existing) throw new Error("Video not found");
    
    const updated = { ...existing, ...updates };
    this.videos.set(id, updated);
    return updated;
  }

  async deleteVideo(id: string): Promise<boolean> {
    return this.videos.delete(id);
  }

  // Schedule Items
  async getScheduleItems(): Promise<ScheduleItem[]> {
    return Array.from(this.scheduleItems.values()).sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getScheduleItemsForDate(date: Date): Promise<ScheduleItem[]> {
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    return Array.from(this.scheduleItems.values())
      .filter(item => item.startTime >= startOfDay && item.startTime < endOfDay)
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getScheduleItem(id: string): Promise<ScheduleItem | undefined> {
    return this.scheduleItems.get(id);
  }

  async createScheduleItem(insertItem: InsertScheduleItem): Promise<ScheduleItem> {
    const id = randomUUID();
    const item: ScheduleItem = { ...insertItem, id, createdAt: new Date() };
    this.scheduleItems.set(id, item);
    return item;
  }

  async updateScheduleItem(id: string, updates: Partial<InsertScheduleItem>): Promise<ScheduleItem> {
    const existing = this.scheduleItems.get(id);
    if (!existing) throw new Error("Schedule item not found");
    
    const updated = { ...existing, ...updates };
    this.scheduleItems.set(id, updated);
    return updated;
  }

  async deleteScheduleItem(id: string): Promise<boolean> {
    return this.scheduleItems.delete(id);
  }

  // Bookmarks
  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getBookmark(id: string): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = { ...insertBookmark, id, createdAt: new Date() };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async updateBookmark(id: string, updates: Partial<InsertBookmark>): Promise<Bookmark> {
    const existing = this.bookmarks.get(id);
    if (!existing) throw new Error("Bookmark not found");
    
    const updated = { ...existing, ...updates };
    this.bookmarks.set(id, updated);
    return updated;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async getNotesByTopic(topicId: string): Promise<Note[]> {
    return Array.from(this.notes.values())
      .filter(note => note.topicId === topicId)
      .sort((a, b) => b.updatedAt!.getTime() - a.updatedAt!.getTime());
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = { ...insertNote, id, createdAt: now, updatedAt: now };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<InsertNote>): Promise<Note> {
    const existing = this.notes.get(id);
    if (!existing) throw new Error("Note not found");
    
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.notes.set(id, updated);
    return updated;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Study Progress
  async getStudyProgress(): Promise<StudyProgress> {
    return this.studyProgress;
  }

  async updateStudyProgress(updates: Partial<InsertStudyProgress>): Promise<StudyProgress> {
    this.studyProgress = { ...this.studyProgress, ...updates, updatedAt: new Date() };
    return this.studyProgress;
  }
}

export const storage = new MemStorage();
