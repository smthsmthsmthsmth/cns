import express, { Express, Request, Response, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { z } from "zod";
import { MongoStorage } from "./storage";
import { 
  createTopicSchema,
  insertTopicSchema, 
  insertStudyGuideSchema, 
  insertVideoSchema, 
  insertScheduleItemSchema, 
  insertBookmarkSchema, 
  insertNoteSchema, 
  insertStudyProgressSchema,
  insertUserSchema,
  loginSchema
} from "@shared/schema";
import { generateToken } from "./jwt.js";
import { authenticateToken, AuthenticatedRequest } from "./middleware.js";
import zlib from "zlib";
import { promisify } from "util";

// Promisify zlib functions
const gzip = promisify(zlib.gzip);
const gunzip = promisify(zlib.gunzip);

// Configure multer for temporary file storage during processing
const multerStorage = multer.memoryStorage(); // Store in memory instead of disk

const upload = multer({ 
  storage: multerStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
    files: 1
  },
  fileFilter: (req, file, cb) => {
    console.log('Multer fileFilter called with:', {
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size
    });
    
    // Only allow PDF files
    if (file.mimetype === 'application/pdf') {
      console.log('PDF file accepted');
      cb(null, true);
    } else {
      console.log('File rejected - not a PDF:', file.mimetype);
      cb(new Error('Only PDF files are allowed'));
    }
  }
}).single('pdf');

export async function registerRoutes(app: Express) {
  // Health check endpoint for Render
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const storage = new MongoStorage();

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(validatedData);
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user.toObject();
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid registration data", errors: error.errors });
      }
      if (error instanceof Error && error.message.includes('already exists')) {
        return res.status(409).json({ message: error.message });
      }
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const validatedData = loginSchema.parse(req.body);
      const user = await storage.authenticateUser(validatedData);
      
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Generate JWT token
      const token = generateToken({
        userId: (user as any)._id.toString(),
        email: user.email,
        name: user.name
      });
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user.toObject();
      res.json({
        user: userWithoutPassword,
        token
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid login data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to authenticate user" });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUserById(req.user!.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't send password in response
      const { password, ...userWithoutPassword } = user.toObject();
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  // Topics routes
  app.get("/api/topics", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const topics = await storage.getTopics(req.user!.userId);
      res.json(topics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topics" });
    }
  });

  app.get("/api/topics/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const topic = await storage.getTopic(req.user!.userId, req.params.id);
      if (!topic) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json(topic);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch topic" });
    }
  });

              app.post("/api/topics", authenticateToken, async (req: AuthenticatedRequest, res) => {
              try {
                // Validate client data (without userId)
                const validatedData = createTopicSchema.parse(req.body);
                // Add userId and default color if not provided
                const topicDataWithDefaults = {
                  ...validatedData,
                  userId: req.user!.userId,
                  description: validatedData.description || '', // Default empty description
                  color: validatedData.color || '#3B82F6' // Default blue color
                };
                const topic = await storage.createTopic(req.user!.userId, topicDataWithDefaults);
                res.status(201).json(topic);
              } catch (error) {
                if (error instanceof z.ZodError) {
                  return res.status(400).json({ message: "Invalid topic data", errors: error.errors });
                }
                res.status(500).json({ message: "Failed to create topic" });
              }
            });

  app.put("/api/topics/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Validate client data (without userId)
      const updates = createTopicSchema.partial().parse(req.body);
      const topic = await storage.updateTopic(req.user!.userId, req.params.id, updates);
      res.json(topic);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid topic data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update topic" });
    }
  });

  app.delete("/api/topics/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await storage.deleteTopic(req.user!.userId, req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Topic not found" });
      }
      res.json({ message: "Topic deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete topic" });
    }
  });

  // Study Guides routes
  app.get("/api/study-guides", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const guides = await storage.getStudyGuides(req.user!.userId);
      res.json(guides);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study guides" });
    }
  });

  app.get("/api/study-guides/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const guide = await storage.getStudyGuide(req.user!.userId, req.params.id);
      if (!guide) {
        return res.status(404).json({ message: "Study guide not found" });
      }
      res.json(guide);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study guide" });
    }
  });

  app.post("/api/study-guides/upload", authenticateToken, upload, async (req: AuthenticatedRequest, res) => {
    try {
      console.log('Upload request received:', {
        hasFile: !!req.file,
        fileSize: req.file?.size,
        fileName: req.file?.originalname,
        body: req.body,
        userId: req.user?.userId,
        headers: req.headers,
        contentType: req.get('Content-Type')
      });

      if (!req.file) {
        console.log('No file in request - checking why...');
        console.log('Request body keys:', Object.keys(req.body || {}));
        console.log('Request files:', (req as any).files);
        return res.status(400).json({ message: "No PDF file uploaded" });
      }

      const { topicId, title } = req.body;
      if (!topicId || !title) {
        return res.status(400).json({ message: "Topic ID and title are required" });
      }

      console.log('Compressing PDF...');
      const compressedData = await gzip(req.file.buffer);
      console.log('Compression complete:', {
        originalSize: req.file.size,
        compressedSize: compressedData.length,
        compressionRatio: ((req.file.size - compressedData.length) / req.file.size * 100).toFixed(2) + '%'
      });

      const guideData = {
        topicId,
        title,
        fileName: req.file.originalname,
        compressedData: Buffer.from(compressedData), // Ensure correct Buffer type
        originalSize: req.file.size,
        compressedSize: compressedData.length,
        totalPages: undefined, // Would be determined by PDF processing
        currentPage: 1,
        userId: req.user!.userId,
      };

      console.log('Creating study guide with data:', {
        ...guideData,
        compressedDataLength: guideData.compressedData.length
      });

      const guide = await storage.createStudyGuide(req.user!.userId, guideData);
      console.log('Study guide created successfully:', guide._id);
      res.status(201).json(guide);
    } catch (error) {
      console.error('Upload error:', error);
      
      if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
          return res.status(413).json({ message: "File too large. Maximum size is 50MB." });
        } else if (error.code === 'LIMIT_FILE_COUNT') {
          return res.status(400).json({ message: "Too many files. Only one file allowed." });
        }
      }
      
      if (error instanceof Error && error.message.includes('Only PDF files are allowed')) {
        return res.status(400).json({ message: "Only PDF files are allowed" });
      }
      
      // Log the full error for debugging
      console.error('Full error details:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      res.status(500).json({ message: "Failed to upload study guide" });
    }
  });

  app.put("/api/study-guides/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertStudyGuideSchema.partial().parse(req.body);
      const guide = await storage.updateStudyGuide(req.user!.userId, req.params.id, updates);
      res.json(guide);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid study guide data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update study guide" });
    }
  });

  app.delete("/api/study-guides/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await storage.deleteStudyGuide(req.user!.userId, req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Study guide not found" });
      }
      res.json({ message: "Study guide deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete study guide" });
    }
  });

  // Get PDF file
  app.get("/api/study-guides/:id/file", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { id } = req.params;
      const studyGuide = await storage.getStudyGuide(req.user!.userId, id);
      
      if (!studyGuide) {
        return res.status(404).json({ message: "Study guide not found" });
      }

      // Check if study guide has compressed data (new format) or file path (old format)
      if (studyGuide.compressedData) {
        // New format: decompress and serve
        try {
          const decompressedData = await gunzip(studyGuide.compressedData);
          
          // Set headers for PDF download/view
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${studyGuide.fileName}"`);
          
          // Send the decompressed data
          res.send(decompressedData);
        } catch (decompressError) {
          console.error('Failed to decompress PDF:', decompressError);
          return res.status(500).json({ message: "Failed to process PDF file" });
        }
      } else if ((studyGuide as any).filePath) {
        // Old format: read from file system (for backward compatibility)
        try {
          const fs = await import('fs');
          const path = await import('path');
          
          const filePath = (studyGuide as any).filePath;
          if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: "PDF file not found" });
          }
          
          // Set headers for PDF download/view
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `inline; filename="${studyGuide.fileName}"`);
          
          // Stream the file
          const fileStream = fs.createReadStream(filePath);
          fileStream.pipe(res);
        } catch (fileError) {
          console.error('Failed to read PDF file:', fileError);
          return res.status(500).json({ message: "Failed to read PDF file" });
        }
      } else {
        console.error('Study guide missing both compressed data and file path:', studyGuide._id);
        return res.status(500).json({ message: "PDF data not available. Please re-upload the file." });
      }
      
    } catch (error) {
      console.error('PDF serving error:', error);
      res.status(500).json({ message: "Failed to serve PDF file" });
    }
  });

    // Test route to verify compression is working
    app.get("/api/test/compression", authenticateToken, async (req: AuthenticatedRequest, res) => {
      try {
        const testData = Buffer.from("This is a test PDF content for compression testing");
        const compressed = await gzip(testData);
        const decompressed = await gunzip(compressed);
        
        res.json({
          originalSize: testData.length,
          compressedSize: compressed.length,
          compressionRatio: ((testData.length - compressed.length) / testData.length * 100).toFixed(2) + '%',
          decompressedMatches: testData.equals(decompressed),
          message: "Compression test successful"
        });
      } catch (error: any) {
        console.error('Compression test error:', error);
        res.status(500).json({ message: "Compression test failed", error: error.message || 'Unknown error' });
      }
    });

    // Test route to check database schema
    app.get("/api/test/schema", authenticateToken, async (req: AuthenticatedRequest, res) => {
      try {
        const studyGuides = await storage.getStudyGuides(req.user!.userId);
        const schemaInfo = studyGuides.map(guide => ({
          id: guide._id,
          title: guide.title,
          hasCompressedData: !!guide.compressedData,
          hasFilePath: !!(guide as any).filePath,
          compressedDataSize: guide.compressedData ? guide.compressedData.length : null,
          originalSize: guide.originalSize || null,
          compressedSize: guide.compressedSize || null
        }));
        
        res.json({
          totalGuides: studyGuides.length,
          guides: schemaInfo,
          message: "Schema check completed"
        });
      } catch (error: any) {
        console.error('Schema test error:', error);
        res.status(500).json({ message: "Schema test failed", error: error.message || 'Unknown error' });
      }
    });

    // Migration route to convert old study guides to new compressed format
    app.post("/api/study-guides/migrate", authenticateToken, async (req: AuthenticatedRequest, res) => {
      try {
        const studyGuides = await storage.getStudyGuides(req.user!.userId);
        let migratedCount = 0;
        let errors = [];

        for (const guide of studyGuides) {
          try {
            // Check if this guide needs migration (has filePath but no compressedData)
            if ((guide as any).filePath && !guide.compressedData) {
              const guideId = guide._id?.toString() || 'unknown';
              console.log(`Migrating study guide: ${guideId}`);
              
              // Read the file from the old filePath
              const fs = await import('fs');
              
              if (fs.existsSync((guide as any).filePath)) {
                const fileBuffer = fs.readFileSync((guide as any).filePath);
                const compressedData = await gzip(fileBuffer);
                
                // Update the study guide with compressed data
                await storage.updateStudyGuide(req.user!.userId, guideId, {
                  compressedData: Buffer.from(compressedData),
                  originalSize: fileBuffer.length,
                  compressedSize: compressedData.length
                });
                
                // Remove the old file
                fs.unlinkSync((guide as any).filePath);
                migratedCount++;
              } else {
                errors.push(`File not found for guide ${guideId}: ${(guide as any).filePath}`);
              }
            }
          } catch (migrationError: any) {
            const guideId = guide._id?.toString() || 'unknown';
            console.error(`Failed to migrate guide ${guideId}:`, migrationError);
            errors.push(`Failed to migrate guide ${guideId}: ${migrationError.message || 'Unknown error'}`);
          }
        }

        res.json({ 
          message: `Migration completed. ${migratedCount} guides migrated.`,
          migratedCount,
          errors: errors.length > 0 ? errors : undefined
        });
        
      } catch (error) {
        console.error('Migration error:', error);
        res.status(500).json({ message: "Failed to migrate study guides" });
      }
    });

  // Videos routes
  app.get("/api/videos", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { topicId } = req.query;
      let videos;
      
      if (topicId && typeof topicId === 'string') {
        videos = await storage.getVideos(req.user!.userId).then(videos => 
          videos.filter(video => video.topicId?.toString() === topicId)
        );
      } else {
        videos = await storage.getVideos(req.user!.userId);
      }
      
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  app.get("/api/videos/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const video = await storage.getVideo(req.user!.userId, req.params.id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  app.post("/api/videos", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertVideoSchema.parse({ ...req.body, userId: req.user!.userId });
      const video = await storage.createVideo(req.user!.userId, validatedData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  app.put("/api/videos/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      // Remove userId from updates since it shouldn't be changed
      const { userId, ...updateData } = req.body;
      const updates = insertVideoSchema.partial().omit({ userId: true }).parse(updateData);
      const video = await storage.updateVideo(req.user!.userId, req.params.id, updates);
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid video data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  app.delete("/api/videos/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await storage.deleteVideo(req.user!.userId, req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Video not found" });
      }
      res.json({ message: "Video deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Schedule routes
  app.get("/api/schedule", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { date } = req.query;
      let scheduleItems;
      
      if (date && typeof date === 'string') {
        scheduleItems = await storage.getScheduleItems(req.user!.userId, date);
      } else {
        scheduleItems = await storage.getScheduleItems(req.user!.userId);
      }
      
      res.json(scheduleItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule items" });
    }
  });

  app.get("/api/schedule/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const item = await storage.getScheduleItem(req.user!.userId, req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Schedule item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch schedule item" });
    }
  });

  app.post("/api/schedule", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertScheduleItemSchema.parse({ ...req.body, userId: req.user!.userId });
      const item = await storage.createScheduleItem(req.user!.userId, validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create schedule item" });
    }
  });

  app.put("/api/schedule/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertScheduleItemSchema.partial().parse(req.body);
      const item = await storage.updateScheduleItem(req.user!.userId, req.params.id, updates);
      res.json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid schedule item data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update schedule item" });
    }
  });

  app.delete("/api/schedule/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await storage.deleteScheduleItem(req.user!.userId, req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Schedule item not found" });
      }
      res.json({ message: "Schedule item deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete schedule item" });
    }
  });

  // Bookmarks routes
  app.get("/api/bookmarks", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const bookmarks = await storage.getBookmarks(req.user!.userId);
      res.json(bookmarks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  app.get("/api/bookmarks/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const bookmark = await storage.getBookmark(req.user!.userId, req.params.id);
      if (!bookmark) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json(bookmark);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch bookmark" });
    }
  });

  app.post("/api/bookmarks", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertBookmarkSchema.parse({ ...req.body, userId: req.user!.userId });
      const bookmark = await storage.createBookmark(req.user!.userId, validatedData);
      res.status(201).json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.put("/api/bookmarks/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertBookmarkSchema.partial().parse(req.body);
      const bookmark = await storage.updateBookmark(req.user!.userId, req.params.id, updates);
      res.json(bookmark);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid bookmark data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update bookmark" });
    }
  });

  app.delete("/api/bookmarks/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await storage.deleteBookmark(req.user!.userId, req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Bookmark not found" });
      }
      res.json({ message: "Bookmark deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete bookmark" });
    }
  });

  // Notes routes
  app.get("/api/notes", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { topicId } = req.query;
      let notes;
      
      if (topicId && typeof topicId === 'string') {
        notes = await storage.getNotes(req.user!.userId).then(notes => 
          notes.filter(note => note.topicId?.toString() === topicId)
        );
      } else {
        notes = await storage.getNotes(req.user!.userId);
      }
      
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const note = await storage.getNote(req.user!.userId, req.params.id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = insertNoteSchema.parse({ ...req.body, userId: req.user!.userId });
      const note = await storage.createNote(req.user!.userId, validatedData);
      res.status(201).json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create note" });
    }
  });

  app.put("/api/notes/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(req.user!.userId, req.params.id, updates);
      res.json(note);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid note data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update note" });
    }
  });

  app.delete("/api/notes/:id", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const deleted = await storage.deleteNote(req.user!.userId, req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json({ message: "Note deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // Study Progress routes
  app.get("/api/study-progress", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const progress = await storage.getStudyProgress(req.user!.userId);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch study progress" });
    }
  });

  app.put("/api/study-progress", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const updates = insertStudyProgressSchema.partial().parse(req.body);
      const progress = await storage.updateStudyProgress(req.user!.userId, updates);
      res.json(progress);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid study progress data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to update study progress" });
    }
  });

  // Search route
  app.get("/api/search", authenticateToken, async (req: AuthenticatedRequest, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const query = q.toLowerCase();
      
      // Search across topics, study guides, videos, and notes
      const [topics, studyGuides, videos, notes] = await Promise.all([
        storage.getTopics(req.user!.userId),
        storage.getStudyGuides(req.user!.userId),
        storage.getVideos(req.user!.userId),
        storage.getNotes(req.user!.userId)
      ]);

      const results = {
        topics: topics.filter(topic => 
          topic.name.toLowerCase().includes(query) || 
          topic.description.toLowerCase().includes(query)
        ),
        studyGuides: studyGuides.filter(guide => 
          guide.title.toLowerCase().includes(query) || 
          guide.fileName.toLowerCase().includes(query)
        ),
        videos: videos.filter(video => 
          video.title.toLowerCase().includes(query) || 
          (video.description && video.description.toLowerCase().includes(query))
        ),
        notes: notes.filter(note => 
          note.title.toLowerCase().includes(query) || 
          note.content.toLowerCase().includes(query)
        )
      };

      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search" });
    }
  });
}

// Error handling for multer - this should be registered after routes
export function registerMulterErrorHandling(app: Express) {
  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (error instanceof multer.MulterError) {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: "File too large. Maximum size is 50MB." });
      } else if (error.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ message: "Too many files. Only one file allowed." });
      }
    }
    
    if (error instanceof Error && error.message.includes('Only PDF files are allowed')) {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }
    
    next(error);
  });
}
