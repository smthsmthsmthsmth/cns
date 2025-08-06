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
  private studyProgress!: StudyProgress;

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
      this.topics.set(id, { 
        id, 
        name: topic.name,
        description: topic.description,
        progress: topic.progress,
        status: topic.status,
        order: topic.order
      });
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

    // Initialize sample videos
    this.initializeSampleVideos();
    
    // Initialize sample schedule items
    this.initializeSampleSchedule();
    
    // Initialize sample notes
    this.initializeSampleNotes();
    
    // Initialize sample bookmarks
    this.initializeSampleBookmarks();
  }

  private initializeSampleVideos() {
    const topicIds = Array.from(this.topics.keys());
    const sampleVideos = [
      {
        topicId: topicIds[0], // Neuroanatomy
        title: "Central Nervous System Overview",
        description: "Comprehensive overview of the central nervous system structure and function",
        url: "https://www.youtube.com/watch?v=qPix_X-9t7E",
        platform: "YouTube",
        duration: "45:32",
        thumbnailUrl: null
      },
      {
        topicId: topicIds[0], // Neuroanatomy
        title: "Brain Anatomy - Cerebral Cortex",
        description: "Detailed exploration of cerebral cortex anatomy and functional areas",
        url: "https://www.youtube.com/watch?v=HVGlfcP3ATI",
        platform: "YouTube",
        duration: "28:15",
        thumbnailUrl: null
      },
      {
        topicId: topicIds[1], // Neurophysiology
        title: "Action Potentials and Neural Signaling",
        description: "Understanding how neurons communicate through electrical signals",
        url: "https://www.youtube.com/watch?v=oa6rvUJlg7o",
        platform: "Khan Academy",
        duration: "12:45",
        thumbnailUrl: null
      },
      {
        topicId: topicIds[2], // Neuropharmacology
        title: "Neurotransmitters and Synaptic Transmission",
        description: "How chemical signals work in the nervous system",
        url: "https://www.youtube.com/watch?v=WhowH0kb7n0",
        platform: "Osmosis",
        duration: "35:20",
        thumbnailUrl: null
      }
    ];

    sampleVideos.forEach(video => {
      const id = randomUUID();
      this.videos.set(id, {
        id,
        topicId: video.topicId,
        title: video.title,
        description: video.description,
        url: video.url,
        platform: video.platform,
        duration: video.duration,
        thumbnailUrl: video.thumbnailUrl,
        addedAt: new Date()
      });
    });
  }

  private initializeSampleSchedule() {
    const topicIds = Array.from(this.topics.keys());
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const sampleSchedule = [
      {
        topicId: topicIds[0],
        title: "Review Neuroanatomy Lectures",
        description: "Go through lecture slides and take notes on key structures",
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10, 30),
        status: "completed"
      },
      {
        topicId: topicIds[1],
        title: "Study Action Potentials",
        description: "Watch videos and practice problem sets on neural signaling",
        startTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
        endTime: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
        status: "in-progress"
      },
      {
        topicId: topicIds[2],
        title: "Neuropharmacology Reading",
        description: "Read chapter 8-10 in the textbook",
        startTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 10, 0),
        endTime: new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate(), 12, 0),
        status: "not-started"
      }
    ];

    sampleSchedule.forEach(item => {
      const id = randomUUID();
      this.scheduleItems.set(id, {
        id,
        topicId: item.topicId,
        title: item.title,
        description: item.description,
        startTime: item.startTime,
        endTime: item.endTime,
        status: item.status,
        createdAt: new Date()
      });
    });
  }

  private initializeSampleNotes() {
    const topicIds = Array.from(this.topics.keys());
    const sampleNotes = [
      {
        topicId: topicIds[0], // Neuroanatomy
        title: "Key Brain Structures",
        content: "Important structures to remember:\n\n1. Cerebral Cortex - Outer layer of the brain, responsible for complex thinking\n2. Cerebellum - Balance and coordination\n3. Brain Stem - Controls vital functions like breathing and heart rate\n4. Thalamus - Relay station for sensory information\n5. Hypothalamus - Regulates hormones and basic drives\n\nNote: The blood-brain barrier protects the brain from toxins but also makes drug delivery challenging."
      },
      {
        topicId: topicIds[1], // Neurophysiology
        title: "Action Potential Steps",
        content: "Action Potential Process:\n\n1. Resting potential: -70mV\n2. Depolarization: Na+ channels open, membrane becomes positive\n3. Repolarization: K+ channels open, Na+ channels close\n4. Hyperpolarization: Brief overshoot below resting potential\n5. Return to resting potential\n\nKey concept: All-or-nothing principle - action potentials are binary events."
      },
      {
        topicId: topicIds[2], // Neuropharmacology
        title: "Major Neurotransmitters",
        content: "Important neurotransmitters and their functions:\n\n• Dopamine - Reward, motivation, movement control\n• Serotonin - Mood regulation, sleep, appetite\n• GABA - Primary inhibitory neurotransmitter\n• Glutamate - Primary excitatory neurotransmitter\n• Acetylcholine - Muscle contraction, memory\n• Norepinephrine - Alertness, arousal\n\nRemember: Many psychiatric medications target these systems."
      }
    ];

    sampleNotes.forEach(note => {
      const id = randomUUID();
      const now = new Date();
      this.notes.set(id, {
        id,
        topicId: note.topicId,
        title: note.title,
        content: note.content,
        createdAt: now,
        updatedAt: now
      });
    });
  }

  private initializeSampleBookmarks() {
    const videoIds = Array.from(this.videos.keys());
    const noteIds = Array.from(this.notes.keys());
    
    const sampleBookmarks = [
      {
        type: "video",
        resourceId: videoIds[0] || "sample-video-1",
        title: "CNS Overview Video",
        description: "Comprehensive overview of central nervous system",
        timestamp: "15:30"
      },
      {
        type: "video", 
        resourceId: videoIds[1] || "sample-video-2",
        title: "Brain Anatomy Deep Dive",
        description: "Detailed cortex anatomy explanation",
        timestamp: "22:45"
      },
      {
        type: "note",
        resourceId: noteIds[0] || "sample-note-1", 
        title: "Brain Structures Summary",
        description: "Quick reference for key anatomical structures"
      },
      {
        type: "pdf",
        resourceId: "sample-pdf-1",
        title: "Neuroanatomy Chapter 3",
        description: "Important diagrams and explanations",
        pageNumber: 45
      }
    ];

    sampleBookmarks.forEach(bookmark => {
      const id = randomUUID();
      this.bookmarks.set(id, {
        id,
        type: bookmark.type,
        resourceId: bookmark.resourceId,
        title: bookmark.title,
        description: bookmark.description,
        pageNumber: bookmark.pageNumber || null,
        timestamp: bookmark.timestamp || null,
        createdAt: new Date()
      });
    });
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
    const topic: Topic = { 
      id,
      name: insertTopic.name,
      description: insertTopic.description || null,
      progress: insertTopic.progress || 0,
      status: insertTopic.status || "not-started",
      order: insertTopic.order || 0
    };
    this.topics.set(id, topic);
    return topic;
  }

  async updateTopic(id: string, updates: Partial<InsertTopic>): Promise<Topic> {
    const existing = this.topics.get(id);
    if (!existing) throw new Error("Topic not found");
    
    const updated: Topic = { 
      ...existing, 
      ...updates,
      description: updates.description !== undefined ? updates.description : existing.description
    };
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
    const guide: StudyGuide = { 
      id, 
      topicId: insertGuide.topicId || null,
      title: insertGuide.title,
      fileName: insertGuide.fileName,
      filePath: insertGuide.filePath,
      totalPages: insertGuide.totalPages || null,
      currentPage: insertGuide.currentPage || null,
      uploadedAt: new Date()
    };
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
    const video: Video = { 
      id,
      topicId: insertVideo.topicId || null,
      title: insertVideo.title,
      description: insertVideo.description || null,
      url: insertVideo.url,
      platform: insertVideo.platform || null,
      duration: insertVideo.duration || null,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      addedAt: new Date()
    };
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
    const item: ScheduleItem = { 
      id,
      topicId: insertItem.topicId || null,
      title: insertItem.title,
      description: insertItem.description || null,
      startTime: insertItem.startTime,
      endTime: insertItem.endTime,
      status: insertItem.status || "not-started",
      createdAt: new Date()
    };
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
    const bookmark: Bookmark = { 
      id,
      type: insertBookmark.type,
      resourceId: insertBookmark.resourceId,
      title: insertBookmark.title,
      description: insertBookmark.description || null,
      pageNumber: insertBookmark.pageNumber || null,
      timestamp: insertBookmark.timestamp || null,
      createdAt: new Date()
    };
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
    const note: Note = { 
      id,
      topicId: insertNote.topicId || null,
      title: insertNote.title,
      content: insertNote.content,
      createdAt: now,
      updatedAt: now
    };
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
