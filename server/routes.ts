import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { storage } from "./storage";
import { 
  insertTopicSchema,
  insertStudyGuideSchema,
  insertVideoSchema,
  insertScheduleItemSchema,
  insertBookmarkSchema,
  insertNoteSchema,
  insertStudyProgressSchema
} from "@shared/schema";
import { z } from "zod";

// Configure multer for PDF uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Topics routes
  app.get("/api/topics", async (req, res) => {
    try {
      const topics = await storage.getTopics();
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:id", async (req, res) => {
    try {
      const topic = await storage.getTopic(req.params.id);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

  app.post("/api/topics", async (req, res) => {
    try {
      const validatedData = insertTopicSchema.parse(req.body);
      const topic = await storage.createTopic(validatedData);
      res.status(201).json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid topic data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create topic" });
    }
  });

  app.put("/api/topics/:id", async (req, res) => {
    try {
      const updates = insertTopicSchema.partial().parse(req.body);
      const topic = await storage.updateTopic(req.params.id, updates);
      res.json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid topic data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update topic" });
    }
  });

  app.delete("/api/topics/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteTopic(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json({ message: "Topic deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete topic" });
    }
  });

  // Study Guides routes
  app.get("/api/study-guides", async (req, res) => {
    try {
      const { topicId } = req.query;
      let guides;
      
      if (topicId && typeof topicId === 'string') {
        guides = await storage.getStudyGuidesByTopic(topicId);
      } else {
        guides = await storage.getStudyGuides();
      }
      
      res.json(guides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study guides" });
    }
  });

  app.get("/api/study-guides/:id", async (req, res) => {
    try {
      const guide = await storage.getStudyGuide(req.params.id);
      if (!guide) {
        return res.status(404).json({ message: "Study guide not found" });
      }
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study guide" });
    }
  });

  app.post("/api/study-guides/upload", upload.single('pdf'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const { topicId, title } = req.body;
      if (!topicId || !title) {
        return res.status(400).json({ message: "Topic ID and title are required" });
      }

      const guideData = {
        topicId,
        title,
        fileName: req.file.originalname,
        filePath: req.file.path,
        totalPages: null, // Would be determined by PDF processing
        currentPage: 1,
      };

      const guide = await storage.createStudyGuide(guideData);
      res.status(201).json(guide);
    } catch (error) {
      res.status(500).json({ message: "Failed to upload study guide" });
    }
  });

  app.put("/api/study-guides/:id", async (req, res) => {
    try {
      const updates = insertStudyGuideSchema.partial().parse(req.body);
      const guide = await storage.updateStudyGuide(req.params.id, updates);
      res.json(guide);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid study guide data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update study guide" });
    }
  });

  // Videos routes
  app.get("/api/videos", async (req, res) => {
    try {
      const { topicId } = req.query;
      let videos;
      
      if (topicId && typeof topicId === 'string') {
        videos = await storage.getVideosByTopic(topicId);
      } else {
        videos = await storage.getVideos();
      }
      
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // Schedule routes
  app.get("/api/schedule", async (req, res) => {
    try {
      const { date } = req.query;
      let scheduleItems;
      
      if (date && typeof date === 'string') {
        scheduleItems = await storage.getScheduleItemsForDate(new Date(date));
      } else {
        scheduleItems = await storage.getScheduleItems();
      }
      
      res.json(scheduleItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule items" });
    }
  });

  app.post("/api/schedule", async (req, res) => {
    try {
      const validatedData = insertScheduleItemSchema.parse(req.body);
      const item = await storage.createScheduleItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create schedule item" });
    }
  });

  app.put("/api/schedule/:id", async (req, res) => {
    try {
      const updates = insertScheduleItemSchema.partial().parse(req.body);
      const item = await storage.updateScheduleItem(req.params.id, updates);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update schedule item" });
    }
  });

  // Bookmarks routes
  app.get("/api/bookmarks", async (req, res) => {
    try {
      const bookmarks = await storage.getBookmarks();
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.post("/api/bookmarks", async (req, res) => {
    try {
      const validatedData = insertBookmarkSchema.parse(req.body);
      const bookmark = await storage.createBookmark(validatedData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.delete("/api/bookmarks/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteBookmark(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // Notes routes
  app.get("/api/notes", async (req, res) => {
    try {
      const { topicId } = req.query;
      let notes;
      
      if (topicId && typeof topicId === 'string') {
        notes = await storage.getNotesByTopic(topicId);
      } else {
        notes = await storage.getNotes();
      }
      
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const updates = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(req.params.id, updates);
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  // Study Progress routes
  app.get("/api/study-progress", async (req, res) => {
    try {
      const progress = await storage.getStudyProgress();
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study progress" });
    }
  });

  app.put("/api/study-progress", async (req, res) => {
    try {
      const updates = insertStudyProgressSchema.partial().parse(req.body);
      const progress = await storage.updateStudyProgress(updates);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update study progress" });
    }
  });

  // Search route
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const query = q.toLowerCase();
      
      // Search across topics, study guides, videos, and notes
      const [topics, studyGuides, videos, notes] = await Promise.all([
        storage.getTopics(),
        storage.getStudyGuides(),
        storage.getVideos(),
        storage.getNotes()
      ]);

      const results = {
        topics: topics.filter(topic => 
          topic.name.toLowerCase().includes(query) ||
          topic.description?.toLowerCase().includes(query)
        ),
        studyGuides: studyGuides.filter(guide =>
          guide.title.toLowerCase().includes(query)
        ),
        videos: videos.filter(video =>
          video.title.toLowerCase().includes(query) ||
          video.description?.toLowerCase().includes(query)
        ),
        notes: notes.filter(note =>
          note.title.toLowerCase().includes(query) ||
          note.content.toLowerCase().includes(query)
        )
      };

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
