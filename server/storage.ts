import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import type { 
  User,
  Topic, 
  StudyGuide, 
  Video, 
  ScheduleItem, 
  Bookmark, 
  Note, 
  StudyProgress,
  InsertUser,
  LoginData,
  InsertTopic,
  InsertStudyGuide,
  InsertVideo,
  InsertScheduleItem,
  InsertBookmark,
  InsertNote,
  InsertStudyProgress
} from "@shared/schema";

// MongoDB Models
const UserModel = mongoose.model<User>('User', new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const TopicModel = mongoose.model<Topic>('Topic', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const StudyGuideModel = mongoose.model<StudyGuide>('StudyGuide', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  title: { type: String, required: true },
  fileName: { type: String, required: true },
  compressedData: { type: Buffer, required: true }, // Store compressed PDF data
  originalSize: { type: Number, required: true }, // Original file size
  compressedSize: { type: Number, required: true }, // Compressed size
  totalPages: { type: Number },
  currentPage: { type: Number, default: 1 },
  uploadedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const VideoModel = mongoose.model<Video>('Video', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  title: { type: String, required: true },
  description: { type: String },
  url: { type: String, required: true },
  platform: { type: String }, // Made optional to match schema
  duration: { type: Number },
  thumbnailUrl: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const ScheduleItemModel = mongoose.model<ScheduleItem>('ScheduleItem', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  title: { type: String, required: true },
  description: { type: String },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const BookmarkModel = mongoose.model<Bookmark>('Bookmark', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  resourceType: { type: String, enum: ['study-guide', 'video'], required: true },
  resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
  resourceTitle: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  pageNumber: { type: Number },
  timestamp: { type: Number },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const NoteModel = mongoose.model<Note>('Note', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  topicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic' },
  title: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}));

const StudyProgressModel = mongoose.model<StudyProgress>('StudyProgress', new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  totalTopics: { type: Number, default: 0 },
  completedTopics: { type: Number, default: 0 },
  studyHours: { type: Number, default: 0 },
  videosWatched: { type: Number, default: 0 },
  bookmarkCount: { type: Number, default: 0 },
  updatedAt: { type: Date, default: Date.now }
}));

export class MongoStorage {
  // User Authentication Methods
  async createUser(userData: InsertUser): Promise<User> {
    const { email, password, name } = userData;
    
    // Check if user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const newUser = new UserModel({
      email,
      password: hashedPassword,
      name
    });
    
    return await newUser.save();
  }

  async authenticateUser(loginData: LoginData): Promise<User | null> {
    const { email, password } = loginData;
    
    const user = await UserModel.findOne({ email });
    if (!user) {
      return null;
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }
    
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return await UserModel.findById(id);
  }

  // Topics
  async getTopics(userId: string): Promise<Topic[]> {
    return await TopicModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getTopic(userId: string, id: string): Promise<Topic | null> {
    return await TopicModel.findOne({ _id: id, userId });
  }

  async createTopic(userId: string, topic: InsertTopic): Promise<Topic> {
    const newTopic = new TopicModel({ ...topic, userId });
    return await newTopic.save();
  }

  async updateTopic(userId: string, id: string, updates: Partial<InsertTopic>): Promise<Topic | null> {
    return await TopicModel.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async deleteTopic(userId: string, id: string): Promise<boolean> {
    const result = await TopicModel.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  // Study Guides
  async getStudyGuides(userId: string): Promise<StudyGuide[]> {
    return await StudyGuideModel.find({ userId }).populate('topicId').sort({ uploadedAt: -1 });
  }

  async getStudyGuide(userId: string, id: string): Promise<StudyGuide | null> {
    return await StudyGuideModel.findOne({ _id: id, userId }).populate('topicId');
  }

  async createStudyGuide(userId: string, guide: InsertStudyGuide): Promise<StudyGuide> {
    const newGuide = new StudyGuideModel({ ...guide, userId });
    return await newGuide.save();
  }

  async updateStudyGuide(userId: string, id: string, updates: Partial<InsertStudyGuide>): Promise<StudyGuide | null> {
    return await StudyGuideModel.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async deleteStudyGuide(userId: string, id: string): Promise<boolean> {
    const result = await StudyGuideModel.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  // Videos
  async getVideos(userId: string): Promise<Video[]> {
    return await VideoModel.find({ userId }).populate('topicId').sort({ createdAt: -1 });
  }

  async getVideo(userId: string, id: string): Promise<Video | null> {
    return await VideoModel.findOne({ _id: id, userId }).populate('topicId');
  }

  async createVideo(userId: string, video: InsertVideo): Promise<Video> {
    const newVideo = new VideoModel({ ...video, userId });
    return await newVideo.save();
  }

  async updateVideo(userId: string, id: string, updates: Partial<InsertVideo>): Promise<Video | null> {
    return await VideoModel.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async deleteVideo(userId: string, id: string): Promise<boolean> {
    const result = await VideoModel.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  // Schedule Items
  async getScheduleItems(userId: string, date?: string): Promise<ScheduleItem[]> {
    const query: any = { userId };
    if (date) {
      query.startTime = { 
        $gte: new Date(date), 
        $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) 
      };
    }
    return await ScheduleItemModel.find(query).populate('topicId').sort({ startTime: 1 });
  }

  async getScheduleItem(userId: string, id: string): Promise<ScheduleItem | null> {
    return await ScheduleItemModel.findOne({ _id: id, userId }).populate('topicId');
  }

  async createScheduleItem(userId: string, item: InsertScheduleItem): Promise<ScheduleItem> {
    const newItem = new ScheduleItemModel({ ...item, userId });
    return await newItem.save();
  }

  async updateScheduleItem(userId: string, id: string, updates: Partial<InsertScheduleItem>): Promise<ScheduleItem | null> {
    return await ScheduleItemModel.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async deleteScheduleItem(userId: string, id: string): Promise<boolean> {
    const result = await ScheduleItemModel.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  // Bookmarks
  async getBookmarks(userId: string): Promise<Bookmark[]> {
    return await BookmarkModel.find({ userId }).sort({ createdAt: -1 });
  }

  async getBookmark(userId: string, id: string): Promise<Bookmark | null> {
    return await BookmarkModel.findOne({ _id: id, userId });
  }

  async createBookmark(userId: string, bookmark: InsertBookmark): Promise<Bookmark> {
    const newBookmark = new BookmarkModel({ ...bookmark, userId });
    return await newBookmark.save();
  }

  async updateBookmark(userId: string, id: string, updates: Partial<InsertBookmark>): Promise<Bookmark | null> {
    return await BookmarkModel.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async deleteBookmark(userId: string, id: string): Promise<boolean> {
    const result = await BookmarkModel.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  // Notes
  async getNotes(userId: string): Promise<Note[]> {
    return await NoteModel.find({ userId }).populate('topicId').sort({ createdAt: -1 });
  }

  async getNote(userId: string, id: string): Promise<Note | null> {
    return await NoteModel.findOne({ _id: id, userId }).populate('topicId');
  }

  async createNote(userId: string, note: InsertNote): Promise<Note> {
    const newNote = new NoteModel({ ...note, userId });
    return await newNote.save();
  }

  async updateNote(userId: string, id: string, updates: Partial<InsertNote>): Promise<Note | null> {
    return await NoteModel.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async deleteNote(userId: string, id: string): Promise<boolean> {
    const result = await NoteModel.findOneAndDelete({ _id: id, userId });
    return !!result;
  }

  // Study Progress
  async getStudyProgress(userId: string): Promise<StudyProgress> {
    let progress = await StudyProgressModel.findOne({ userId });
    if (!progress) {
      progress = new StudyProgressModel({
        userId,
        totalTopics: 0,
        completedTopics: 0,
        studyHours: 0,
        videosWatched: 0,
        bookmarkCount: 0
      });
      await progress.save();
    }
    return progress;
  }

  async updateStudyProgress(userId: string, updates: Partial<InsertStudyProgress>): Promise<StudyProgress> {
    const progress = await StudyProgressModel.findOne({ userId });
    if (progress) {
      Object.assign(progress, updates);
      await progress.save();
      return progress;
    } else {
      const newProgress = new StudyProgressModel({ ...updates, userId });
      return await newProgress.save();
    }
  }
}

export const storage = new MongoStorage();
