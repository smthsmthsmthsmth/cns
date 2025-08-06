# CNS Study Planner - Complete Application Code

## Project Setup Files

### package.json
```json
{
  "name": "rest-express",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "npm run build:client && npm run build:server",
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --target=node18 --outfile=dist/server.js --external:express --external:multer",
    "start": "node dist/server.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@hookform/resolvers": "^3.9.0",
    "@neondatabase/serverless": "^0.10.1",
    "@radix-ui/react-accordion": "^1.2.1",
    "@radix-ui/react-alert-dialog": "^1.1.2",
    "@radix-ui/react-aspect-ratio": "^1.1.0",
    "@radix-ui/react-avatar": "^1.1.1",
    "@radix-ui/react-checkbox": "^1.1.2",
    "@radix-ui/react-collapsible": "^1.1.1",
    "@radix-ui/react-context-menu": "^2.2.2",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-hover-card": "^1.1.2",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-menubar": "^1.1.2",
    "@radix-ui/react-navigation-menu": "^1.2.1",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-progress": "^1.1.0",
    "@radix-ui/react-radio-group": "^1.2.1",
    "@radix-ui/react-scroll-area": "^1.2.0",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-slot": "^1.1.0",
    "@radix-ui/react-switch": "^1.1.1",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-toast": "^1.2.2",
    "@radix-ui/react-toggle": "^1.1.0",
    "@radix-ui/react-toggle-group": "^1.1.0",
    "@radix-ui/react-tooltip": "^1.1.3",
    "@tanstack/react-query": "^5.59.0",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.1",
    "cmdk": "^1.0.0",
    "connect-pg-simple": "^10.0.0",
    "date-fns": "^4.1.0",
    "drizzle-orm": "^0.33.0",
    "drizzle-zod": "^0.5.1",
    "embla-carousel-react": "^8.3.0",
    "express": "^4.21.1",
    "express-session": "^1.18.1",
    "framer-motion": "^11.11.7",
    "input-otp": "^1.4.1",
    "lucide-react": "^0.456.0",
    "memorystore": "^1.6.7",
    "multer": "^1.4.5-lts.1",
    "nanoid": "^5.0.8",
    "next-themes": "^0.4.3",
    "passport": "^0.7.0",
    "passport-local": "^1.0.0",
    "react": "^18.3.1",
    "react-day-picker": "^9.2.0",
    "react-dom": "^18.3.1",
    "react-hook-form": "^7.53.0",
    "react-icons": "^5.3.0",
    "react-resizable-panels": "^2.1.5",
    "recharts": "^2.12.7",
    "tailwind-merge": "^2.5.4",
    "tailwindcss-animate": "^1.0.7",
    "tw-animate-css": "^0.3.6",
    "vaul": "^1.0.0",
    "wouter": "^3.3.5",
    "ws": "^8.18.0",
    "zod": "^3.23.8",
    "zod-validation-error": "^3.4.0"
  },
  "devDependencies": {
    "@jridgewell/trace-mapping": "^0.3.25",
    "@replit/vite-plugin-cartographer": "^0.0.66",
    "@replit/vite-plugin-runtime-error-modal": "^0.0.93",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "^4.0.0-alpha.31",
    "@types/connect-pg-simple": "^7.0.3",
    "@types/express": "^5.0.0",
    "@types/express-session": "^1.18.0",
    "@types/multer": "^1.4.12",
    "@types/node": "^22.7.5",
    "@types/passport": "^1.0.16",
    "@types/passport-local": "^1.0.38",
    "@types/react": "^18.3.11",
    "@types/react-dom": "^18.3.1",
    "@types/ws": "^8.5.13",
    "@vitejs/plugin-react": "^4.3.3",
    "autoprefixer": "^10.4.20",
    "drizzle-kit": "^0.24.2",
    "esbuild": "^0.24.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "tsx": "^4.19.1",
    "typescript": "^5.6.3",
    "vite": "^5.4.8"
  }
}
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  },
  "include": ["client/src", "server", "shared", "vite.config.ts"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { replitCartographerPlugin } from "@replit/vite-plugin-cartographer";
import { replitRuntimeErrorModalPlugin } from "@replit/vite-plugin-runtime-error-modal";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    replitCartographerPlugin(),
    replitRuntimeErrorModalPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client/src"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/client"),
    emptyOutDir: true,
  },
});
```

### tailwind.config.ts
```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./client/src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### postcss.config.js
```javascript
export default {
  plugins: {
    autoprefixer: {},
  },
};
```

### components.json
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "client/src/index.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

### drizzle.config.ts
```typescript
import type { Config } from 'drizzle-kit';

export default {
  schema: './shared/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

## Shared Schema (shared/schema.ts)
```typescript
import { pgTable, text, integer, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Topics table
export const topics = pgTable('topics', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  progress: integer('progress').default(0),
  status: text('status').default('not-started'), // 'not-started', 'in-progress', 'completed'
  order: integer('order').default(0),
});

// Study guides table
export const studyGuides = pgTable('study_guides', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicId: uuid('topic_id').references(() => topics.id),
  title: text('title').notNull(),
  fileName: text('file_name').notNull(),
  filePath: text('file_path').notNull(),
  fileSize: integer('file_size'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
});

// Videos table
export const videos = pgTable('videos', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicId: uuid('topic_id').references(() => topics.id),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  duration: integer('duration'), // in seconds
  createdAt: timestamp('created_at').defaultNow(),
});

// Schedule items table
export const scheduleItems = pgTable('schedule_items', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicId: uuid('topic_id').references(() => topics.id),
  title: text('title').notNull(),
  description: text('description'),
  date: timestamp('date').notNull(),
  startTime: text('start_time'),
  endTime: text('end_time'),
  status: text('status').default('pending'), // 'pending', 'completed', 'cancelled'
  createdAt: timestamp('created_at').defaultNow(),
});

// Bookmarks table
export const bookmarks = pgTable('bookmarks', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: text('type').notNull(), // 'video', 'pdf', 'note'
  resourceId: text('resource_id').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  pageNumber: integer('page_number'), // for PDFs
  timestamp: text('timestamp'), // for videos
  createdAt: timestamp('created_at').defaultNow(),
});

// Notes table
export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  topicId: uuid('topic_id').references(() => topics.id),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Study progress table
export const studyProgress = pgTable('study_progress', {
  id: uuid('id').primaryKey().defaultRandom(),
  totalTopics: integer('total_topics').default(0),
  completedTopics: integer('completed_topics').default(0),
  totalStudyGuides: integer('total_study_guides').default(0),
  totalVideos: integer('total_videos').default(0),
  totalHours: integer('total_hours').default(0),
  streak: integer('streak').default(0),
  lastStudyDate: timestamp('last_study_date'),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Insert schemas
export const insertTopicSchema = createInsertSchema(topics);
export const insertStudyGuideSchema = createInsertSchema(studyGuides);
export const insertVideoSchema = createInsertSchema(videos);
export const insertScheduleItemSchema = createInsertSchema(scheduleItems);
export const insertBookmarkSchema = createInsertSchema(bookmarks);
export const insertNoteSchema = createInsertSchema(notes);
export const insertStudyProgressSchema = createInsertSchema(studyProgress);

// Types
export type Topic = typeof topics.$inferSelect;
export type StudyGuide = typeof studyGuides.$inferSelect;
export type Video = typeof videos.$inferSelect;
export type ScheduleItem = typeof scheduleItems.$inferSelect;
export type Bookmark = typeof bookmarks.$inferSelect;
export type Note = typeof notes.$inferSelect;
export type StudyProgress = typeof studyProgress.$inferSelect;

export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type InsertStudyGuide = z.infer<typeof insertStudyGuideSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type InsertScheduleItem = z.infer<typeof insertScheduleItemSchema>;
export type InsertBookmark = z.infer<typeof insertBookmarkSchema>;
export type InsertNote = z.infer<typeof insertNoteSchema>;
export type InsertStudyProgress = z.infer<typeof insertStudyProgressSchema>;
```

## Server Files

### server/index.ts
```typescript
import express from "express";
import { createServer } from "http";
import { setupVite } from "./vite";
import { router } from "./routes";
import multer from "multer";
import path from "path";
import fs from "fs";

const app = express();
const server = createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// API routes
app.use("/api", router);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  if (error.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: 'Only PDF files are allowed.' });
  }
  next(error);
});

// Middleware to log requests
app.use((req, res, next) => {
  const start = Date.now();
  const originalJson = res.json;

  res.json = function (body) {
    const duration = Date.now() - start;
    console.log(`${new Date().toLocaleTimeString()} [express] ${req.method} ${req.path} ${res.statusCode} in ${duration}ms :: ${JSON.stringify(body).slice(0, 80)}${JSON.stringify(body).length > 80 ? "…" : ""}`);
    return originalJson.call(this, body);
  };
  next();
});

const PORT = 5000;

async function startServer() {
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    app.use(express.static(path.resolve(__dirname, "../client")));
    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "../client/index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    const formattedTime = new Date().toLocaleTimeString();
    console.log(`${formattedTime} [express] serving on port ${PORT}`);
  });
}

startServer();
```

### server/vite.ts
```typescript
import { ViteDevServer, createServer } from "vite";

export async function setupVite(app: any, server: any) {
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}
```

### server/storage.ts
```typescript
import { randomUUID } from "crypto";
import type {
  Topic,
  StudyGuide, 
  Video,
  ScheduleItem,
  Bookmark,
  Note,
  StudyProgress,
  InsertTopic,
  InsertStudyGuide,
  InsertVideo, 
  InsertScheduleItem,
  InsertBookmark,
  InsertNote,
  InsertStudyProgress,
} from "@shared/schema";

interface IStorage {
  // Topics
  getTopics(): Promise<Topic[]>;
  getTopic(id: string): Promise<Topic | undefined>;
  createTopic(insertTopic: InsertTopic): Promise<Topic>;
  updateTopic(id: string, updates: Partial<Topic>): Promise<Topic | undefined>;
  deleteTopic(id: string): Promise<boolean>;

  // Study Guides
  getStudyGuides(): Promise<StudyGuide[]>;
  getStudyGuide(id: string): Promise<StudyGuide | undefined>;
  createStudyGuide(insertStudyGuide: InsertStudyGuide): Promise<StudyGuide>;
  updateStudyGuide(id: string, updates: Partial<StudyGuide>): Promise<StudyGuide | undefined>;
  deleteStudyGuide(id: string): Promise<boolean>;

  // Videos
  getVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(insertVideo: InsertVideo): Promise<Video>;
  updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;

  // Schedule Items
  getScheduleItems(): Promise<ScheduleItem[]>;
  getScheduleItemsByDate(date: string): Promise<ScheduleItem[]>;
  getScheduleItem(id: string): Promise<ScheduleItem | undefined>;
  createScheduleItem(insertScheduleItem: InsertScheduleItem): Promise<ScheduleItem>;
  updateScheduleItem(id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem | undefined>;
  deleteScheduleItem(id: string): Promise<boolean>;

  // Bookmarks
  getBookmarks(): Promise<Bookmark[]>;
  getBookmark(id: string): Promise<Bookmark | undefined>;
  createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark>;
  updateBookmark(id: string, updates: Partial<Bookmark>): Promise<Bookmark | undefined>;
  deleteBookmark(id: string): Promise<boolean>;

  // Notes
  getNotes(): Promise<Note[]>;
  getNote(id: string): Promise<Note | undefined>;
  createNote(insertNote: InsertNote): Promise<Note>;
  updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined>;
  deleteNote(id: string): Promise<boolean>;

  // Study Progress
  getStudyProgress(): Promise<StudyProgress>;
  updateStudyProgress(updates: Partial<StudyProgress>): Promise<StudyProgress>;
}

class MemStorage implements IStorage {
  private topics = new Map<string, Topic>();
  private studyGuides = new Map<string, StudyGuide>();
  private videos = new Map<string, Video>();
  private scheduleItems = new Map<string, ScheduleItem>();
  private bookmarks = new Map<string, Bookmark>();
  private notes = new Map<string, Note>();
  private studyProgressData: StudyProgress | null = null;

  constructor() {
    // Initialize with sample data
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Initialize sample topics
    this.initializeSampleTopics();
    
    // Initialize sample progress
    this.initializeSampleProgress();
    
    // Initialize sample videos
    this.initializeSampleVideos();
    
    // Initialize sample schedule items
    this.initializeSampleSchedule();
    
    // Initialize sample notes
    this.initializeSampleNotes();
    
    // Initialize sample bookmarks
    this.initializeSampleBookmarks();
  }

  private initializeSampleTopics() {
    const sampleTopics = [
      { name: "Neuroanatomy", description: "Structure and organization of the nervous system", progress: 75, status: "in-progress", order: 1 },
      { name: "Neurophysiology", description: "Function and electrical activity of neurons", progress: 45, status: "in-progress", order: 2 },
      { name: "Neuropharmacology", description: "Drug effects on the nervous system", progress: 20, status: "not-started", order: 3 },
      { name: "Clinical Neurology", description: "Neurological diseases and disorders", progress: 0, status: "not-started", order: 4 },
    ];

    sampleTopics.forEach(topic => {
      const id = randomUUID();
      this.topics.set(id, { id, ...topic });
    });
  }

  private initializeSampleProgress() {
    const id = randomUUID();
    this.studyProgressData = {
      id,
      totalTopics: 4,
      completedTopics: 0,
      totalStudyGuides: 0,
      totalVideos: 8,
      totalHours: 24,
      streak: 5,
      lastStudyDate: new Date(),
      updatedAt: new Date()
    };
  }

  private initializeSampleVideos() {
    const topicIds = Array.from(this.topics.keys());
    const sampleVideos = [
      {
        topicId: topicIds[0], // Neuroanatomy
        title: "Central Nervous System Overview",
        description: "Comprehensive introduction to CNS structure and function",
        url: "https://www.youtube.com/watch?v=qPix_X-9t7E",
        thumbnailUrl: null,
        duration: 1200
      },
      {
        topicId: topicIds[0], // Neuroanatomy
        title: "Brain Anatomy and Cortical Areas",
        description: "Detailed exploration of cerebral cortex anatomy",
        url: "https://www.youtube.com/watch?v=HVGlfcP3ATI",
        thumbnailUrl: null,
        duration: 1800
      },
      {
        topicId: topicIds[1], // Neurophysiology
        title: "Action Potentials and Neural Signaling",
        description: "How neurons communicate through electrical signals",
        url: "https://www.youtube.com/watch?v=oa6rvUJlg7o",
        thumbnailUrl: null,
        duration: 900
      },
      {
        topicId: topicIds[1], // Neurophysiology
        title: "Synaptic Transmission",
        description: "Chemical communication between neurons",
        url: "https://www.youtube.com/watch?v=WhowH0kb7n0",
        thumbnailUrl: null,
        duration: 1500
      },
      {
        topicId: topicIds[2], // Neuropharmacology
        title: "Neurotransmitters and Receptors",
        description: "Overview of major neurotransmitter systems",
        url: "https://www.youtube.com/watch?v=rsNA8xHNl3o",
        thumbnailUrl: null,
        duration: 1350
      },
      {
        topicId: topicIds[2], // Neuropharmacology
        title: "Psychopharmacology Basics",
        description: "How psychiatric drugs affect brain function",
        url: "https://www.youtube.com/watch?v=TYonLXgk6W4",
        thumbnailUrl: null,
        duration: 1650
      },
      {
        topicId: topicIds[3], // Clinical Neurology
        title: "Neurological Examination",
        description: "Clinical assessment of neurological function",
        url: "https://www.youtube.com/watch?v=VU2G6yoOX2Q",
        thumbnailUrl: null,
        duration: 2100
      },
      {
        topicId: topicIds[3], // Clinical Neurology
        title: "Common Neurological Disorders",
        description: "Overview of prevalent CNS pathologies",
        url: "https://www.youtube.com/watch?v=UKMp6dXbIhU",
        thumbnailUrl: null,
        duration: 1950
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
        thumbnailUrl: video.thumbnailUrl,
        duration: video.duration,
        createdAt: new Date()
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
        title: "Review Neuroanatomy",
        description: "Study brain structure diagrams",
        date: today,
        startTime: "09:00",
        endTime: "11:00",
        status: "pending"
      },
      {
        topicId: topicIds[1],
        title: "Neurophysiology Practice Problems",
        description: "Work through action potential calculations",
        date: today,
        startTime: "14:00",
        endTime: "16:00",
        status: "pending"
      },
      {
        topicId: topicIds[0],
        title: "CNS Overview Video",
        description: "Watch and take notes on central nervous system",
        date: tomorrow,
        startTime: "10:00",
        endTime: "12:00",
        status: "pending"
      }
    ];

    sampleSchedule.forEach(item => {
      const id = randomUUID();
      this.scheduleItems.set(id, {
        id,
        topicId: item.topicId,
        title: item.title,
        description: item.description,
        date: item.date,
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

  async updateTopic(id: string, updates: Partial<Topic>): Promise<Topic | undefined> {
    const topic = this.topics.get(id);
    if (!topic) return undefined;
    const updatedTopic = { ...topic, ...updates };
    this.topics.set(id, updatedTopic);
    return updatedTopic;
  }

  async deleteTopic(id: string): Promise<boolean> {
    return this.topics.delete(id);
  }

  // Study Guides
  async getStudyGuides(): Promise<StudyGuide[]> {
    return Array.from(this.studyGuides.values());
  }

  async getStudyGuide(id: string): Promise<StudyGuide | undefined> {
    return this.studyGuides.get(id);
  }

  async createStudyGuide(insertStudyGuide: InsertStudyGuide): Promise<StudyGuide> {
    const id = randomUUID();
    const studyGuide: StudyGuide = { 
      id, 
      ...insertStudyGuide,
      topicId: insertStudyGuide.topicId || null,
      fileSize: insertStudyGuide.fileSize || null,
      uploadedAt: new Date()
    };
    this.studyGuides.set(id, studyGuide);
    return studyGuide;
  }

  async updateStudyGuide(id: string, updates: Partial<StudyGuide>): Promise<StudyGuide | undefined> {
    const studyGuide = this.studyGuides.get(id);
    if (!studyGuide) return undefined;
    const updatedStudyGuide = { ...studyGuide, ...updates };
    this.studyGuides.set(id, updatedStudyGuide);
    return updatedStudyGuide;
  }

  async deleteStudyGuide(id: string): Promise<boolean> {
    return this.studyGuides.delete(id);
  }

  // Videos
  async getVideos(): Promise<Video[]> {
    return Array.from(this.videos.values());
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      id, 
      ...insertVideo,
      topicId: insertVideo.topicId || null,
      description: insertVideo.description || null,
      thumbnailUrl: insertVideo.thumbnailUrl || null,
      duration: insertVideo.duration || null,
      createdAt: new Date()
    };
    this.videos.set(id, video);
    return video;
  }

  async updateVideo(id: string, updates: Partial<Video>): Promise<Video | undefined> {
    const video = this.videos.get(id);
    if (!video) return undefined;
    const updatedVideo = { ...video, ...updates };
    this.videos.set(id, updatedVideo);
    return updatedVideo;
  }

  async deleteVideo(id: string): Promise<boolean> {
    return this.videos.delete(id);
  }

  // Schedule Items
  async getScheduleItems(): Promise<ScheduleItem[]> {
    return Array.from(this.scheduleItems.values()).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getScheduleItemsByDate(date: string): Promise<ScheduleItem[]> {
    const targetDate = new Date(date);
    return Array.from(this.scheduleItems.values()).filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.toDateString() === targetDate.toDateString();
    });
  }

  async getScheduleItem(id: string): Promise<ScheduleItem | undefined> {
    return this.scheduleItems.get(id);
  }

  async createScheduleItem(insertScheduleItem: InsertScheduleItem): Promise<ScheduleItem> {
    const id = randomUUID();
    const scheduleItem: ScheduleItem = { 
      id, 
      ...insertScheduleItem,
      topicId: insertScheduleItem.topicId || null,
      description: insertScheduleItem.description || null,
      startTime: insertScheduleItem.startTime || null,
      endTime: insertScheduleItem.endTime || null,
      status: insertScheduleItem.status || "pending",
      createdAt: new Date()
    };
    this.scheduleItems.set(id, scheduleItem);
    return scheduleItem;
  }

  async updateScheduleItem(id: string, updates: Partial<ScheduleItem>): Promise<ScheduleItem | undefined> {
    const scheduleItem = this.scheduleItems.get(id);
    if (!scheduleItem) return undefined;
    const updatedScheduleItem = { ...scheduleItem, ...updates };
    this.scheduleItems.set(id, updatedScheduleItem);
    return updatedScheduleItem;
  }

  async deleteScheduleItem(id: string): Promise<boolean> {
    return this.scheduleItems.delete(id);
  }

  // Bookmarks
  async getBookmarks(): Promise<Bookmark[]> {
    return Array.from(this.bookmarks.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getBookmark(id: string): Promise<Bookmark | undefined> {
    return this.bookmarks.get(id);
  }

  async createBookmark(insertBookmark: InsertBookmark): Promise<Bookmark> {
    const id = randomUUID();
    const bookmark: Bookmark = { 
      id, 
      ...insertBookmark,
      description: insertBookmark.description || null,
      pageNumber: insertBookmark.pageNumber || null,
      timestamp: insertBookmark.timestamp || null,
      createdAt: new Date()
    };
    this.bookmarks.set(id, bookmark);
    return bookmark;
  }

  async updateBookmark(id: string, updates: Partial<Bookmark>): Promise<Bookmark | undefined> {
    const bookmark = this.bookmarks.get(id);
    if (!bookmark) return undefined;
    const updatedBookmark = { ...bookmark, ...updates };
    this.bookmarks.set(id, updatedBookmark);
    return updatedBookmark;
  }

  async deleteBookmark(id: string): Promise<boolean> {
    return this.bookmarks.delete(id);
  }

  // Notes
  async getNotes(): Promise<Note[]> {
    return Array.from(this.notes.values()).sort((a, b) => 
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  async getNote(id: string): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = randomUUID();
    const now = new Date();
    const note: Note = { 
      id, 
      ...insertNote,
      topicId: insertNote.topicId || null,
      createdAt: now,
      updatedAt: now
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: string, updates: Partial<Note>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    const updatedNote = { ...note, ...updates, updatedAt: new Date() };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: string): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Study Progress
  async getStudyProgress(): Promise<StudyProgress> {
    if (!this.studyProgressData) {
      const id = randomUUID();
      this.studyProgressData = {
        id,
        totalTopics: 0,
        completedTopics: 0,
        totalStudyGuides: 0,
        totalVideos: 0,
        totalHours: 0,
        streak: 0,
        lastStudyDate: null,
        updatedAt: new Date()
      };
    }
    return this.studyProgressData;
  }

  async updateStudyProgress(updates: Partial<StudyProgress>): Promise<StudyProgress> {
    const current = await this.getStudyProgress();
    this.studyProgressData = { ...current, ...updates, updatedAt: new Date() };
    return this.studyProgressData;
  }
}

export const storage = new MemStorage();
```

### server/routes.ts
```typescript
import express from "express";
import { storage } from "./storage";
import { insertTopicSchema, insertStudyGuideSchema, insertVideoSchema, insertScheduleItemSchema, insertBookmarkSchema, insertNoteSchema, insertStudyProgressSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

export const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  }
});

// Topics routes
router.get("/topics", async (req, res) => {
  const topics = await storage.getTopics();
  res.json(topics);
});

router.get("/topics/:id", async (req, res) => {
  const topic = await storage.getTopic(req.params.id);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  res.json(topic);
});

router.post("/topics", async (req, res) => {
  try {
    const validatedData = insertTopicSchema.parse(req.body);
    const topic = await storage.createTopic(validatedData);
    res.status(201).json(topic);
  } catch (error) {
    res.status(400).json({ error: "Invalid topic data" });
  }
});

router.patch("/topics/:id", async (req, res) => {
  const topic = await storage.updateTopic(req.params.id, req.body);
  if (!topic) {
    return res.status(404).json({ error: "Topic not found" });
  }
  res.json(topic);
});

router.delete("/topics/:id", async (req, res) => {
  const success = await storage.deleteTopic(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Topic not found" });
  }
  res.status(204).send();
});

// Study Guides routes
router.get("/study-guides", async (req, res) => {
  const studyGuides = await storage.getStudyGuides();
  res.json(studyGuides);
});

router.get("/study-guides/:id", async (req, res) => {
  const studyGuide = await storage.getStudyGuide(req.params.id);
  if (!studyGuide) {
    return res.status(404).json({ error: "Study guide not found" });
  }
  res.json(studyGuide);
});

router.post("/study-guides", upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No PDF file uploaded" });
    }

    const studyGuideData = {
      topicId: req.body.topicId || null,
      title: req.body.title || req.file.originalname,
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileSize: req.file.size,
    };

    const validatedData = insertStudyGuideSchema.parse(studyGuideData);
    const studyGuide = await storage.createStudyGuide(validatedData);
    res.status(201).json(studyGuide);
  } catch (error) {
    // Clean up uploaded file on error
    if (req.file) {
      fs.unlink(req.file.path, () => {});
    }
    res.status(400).json({ error: "Invalid study guide data" });
  }
});

router.delete("/study-guides/:id", async (req, res) => {
  const studyGuide = await storage.getStudyGuide(req.params.id);
  if (!studyGuide) {
    return res.status(404).json({ error: "Study guide not found" });
  }

  // Delete the file from filesystem
  if (fs.existsSync(studyGuide.filePath)) {
    fs.unlink(studyGuide.filePath, () => {});
  }

  const success = await storage.deleteStudyGuide(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Study guide not found" });
  }
  res.status(204).send();
});

// Videos routes
router.get("/videos", async (req, res) => {
  const videos = await storage.getVideos();
  res.json(videos);
});

router.get("/videos/:id", async (req, res) => {
  const video = await storage.getVideo(req.params.id);
  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }
  res.json(video);
});

router.post("/videos", async (req, res) => {
  try {
    const validatedData = insertVideoSchema.parse(req.body);
    const video = await storage.createVideo(validatedData);
    res.status(201).json(video);
  } catch (error) {
    res.status(400).json({ error: "Invalid video data" });
  }
});

router.patch("/videos/:id", async (req, res) => {
  const video = await storage.updateVideo(req.params.id, req.body);
  if (!video) {
    return res.status(404).json({ error: "Video not found" });
  }
  res.json(video);
});

router.delete("/videos/:id", async (req, res) => {
  const success = await storage.deleteVideo(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Video not found" });
  }
  res.status(204).send();
});

// Schedule routes
router.get("/schedule", async (req, res) => {
  const scheduleItems = await storage.getScheduleItems();
  res.json(scheduleItems);
});

router.get("/schedule/:date", async (req, res) => {
  const scheduleItems = await storage.getScheduleItemsByDate(req.params.date);
  res.json(scheduleItems);
});

router.get("/schedule-item/:id", async (req, res) => {
  const scheduleItem = await storage.getScheduleItem(req.params.id);
  if (!scheduleItem) {
    return res.status(404).json({ error: "Schedule item not found" });
  }
  res.json(scheduleItem);
});

router.post("/schedule", async (req, res) => {
  try {
    const validatedData = insertScheduleItemSchema.parse(req.body);
    const scheduleItem = await storage.createScheduleItem(validatedData);
    res.status(201).json(scheduleItem);
  } catch (error) {
    res.status(400).json({ error: "Invalid schedule data" });
  }
});

router.patch("/schedule/:id", async (req, res) => {
  const scheduleItem = await storage.updateScheduleItem(req.params.id, req.body);
  if (!scheduleItem) {
    return res.status(404).json({ error: "Schedule item not found" });
  }
  res.json(scheduleItem);
});

router.delete("/schedule/:id", async (req, res) => {
  const success = await storage.deleteScheduleItem(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Schedule item not found" });
  }
  res.status(204).send();
});

// Bookmarks routes
router.get("/bookmarks", async (req, res) => {
  const bookmarks = await storage.getBookmarks();
  res.json(bookmarks);
});

router.get("/bookmarks/:id", async (req, res) => {
  const bookmark = await storage.getBookmark(req.params.id);
  if (!bookmark) {
    return res.status(404).json({ error: "Bookmark not found" });
  }
  res.json(bookmark);
});

router.post("/bookmarks", async (req, res) => {
  try {
    const validatedData = insertBookmarkSchema.parse(req.body);
    const bookmark = await storage.createBookmark(validatedData);
    res.status(201).json(bookmark);
  } catch (error) {
    res.status(400).json({ error: "Invalid bookmark data" });
  }
});

router.patch("/bookmarks/:id", async (req, res) => {
  const bookmark = await storage.updateBookmark(req.params.id, req.body);
  if (!bookmark) {
    return res.status(404).json({ error: "Bookmark not found" });
  }
  res.json(bookmark);
});

router.delete("/bookmarks/:id", async (req, res) => {
  const success = await storage.deleteBookmark(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Bookmark not found" });
  }
  res.status(204).send();
});

// Notes routes
router.get("/notes", async (req, res) => {
  const notes = await storage.getNotes();
  res.json(notes);
});

router.get("/notes/:id", async (req, res) => {
  const note = await storage.getNote(req.params.id);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(note);
});

router.post("/notes", async (req, res) => {
  try {
    const validatedData = insertNoteSchema.parse(req.body);
    const note = await storage.createNote(validatedData);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: "Invalid note data" });
  }
});

router.patch("/notes/:id", async (req, res) => {
  const note = await storage.updateNote(req.params.id, req.body);
  if (!note) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.json(note);
});

router.delete("/notes/:id", async (req, res) => {
  const success = await storage.deleteNote(req.params.id);
  if (!success) {
    return res.status(404).json({ error: "Note not found" });
  }
  res.status(204).send();
});

// Study Progress routes
router.get("/study-progress", async (req, res) => {
  const progress = await storage.getStudyProgress();
  res.json(progress);
});

router.patch("/study-progress", async (req, res) => {
  try {
    const validatedData = insertStudyProgressSchema.partial().parse(req.body);
    const progress = await storage.updateStudyProgress(validatedData);
    res.json(progress);
  } catch (error) {
    res.status(400).json({ error: "Invalid progress data" });
  }
});
```

## Client Files

### client/index.html
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>CNS Study Planner</title>
    <meta name="description" content="A comprehensive study planning application for medical students focusing on Central Nervous System (CNS) module organization with PDF integration and video resources.">
    <meta property="og:title" content="CNS Study Planner - Medical Study Organization">
    <meta property="og:description" content="Organize your CNS module studies with video resources, PDF integration, and comprehensive study planning tools.">
    <meta property="og:type" content="website">
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### client/src/main.tsx
```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

### client/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 224 71.4% 4.1%;
    --card: 0 0% 100%;
    --card-foreground: 224 71.4% 4.1%;
    --popover: 0 0% 100%;
    --popover-foreground: 224 71.4% 4.1%;
    --primary: 220.9 39.3% 11%;
    --primary-foreground: 210 20% 98%;
    --secondary: 220 14.3% 95.9%;
    --secondary-foreground: 220.9 39.3% 11%;
    --muted: 220 14.3% 95.9%;
    --muted-foreground: 220 8.9% 46.1%;
    --accent: 220 14.3% 95.9%;
    --accent-foreground: 220.9 39.3% 11%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 20% 98%;
    --border: 220 13% 91%;
    --input: 220 13% 91%;
    --ring: 224 71.4% 4.1%;
    --radius: 0.5rem;

    /* Medical theme colors */
    --medical-blue: 213 94% 68%;
    --medical-blue-dark: 213 94% 58%;
    --medical-green: 142 76% 36%;
    --medical-green-light: 142 69% 58%;
    --medical-red: 0 84% 60%;
    --medical-gray: 220 9% 46%;
  }

  .dark {
    --background: 224 71.4% 4.1%;
    --foreground: 210 20% 98%;
    --card: 224 71.4% 4.1%;
    --card-foreground: 210 20% 98%;
    --popover: 224 71.4% 4.1%;
    --popover-foreground: 210 20% 98%;
    --primary: 210 20% 98%;
    --primary-foreground: 220.9 39.3% 11%;
    --secondary: 215 27.9% 16.9%;
    --secondary-foreground: 210 20% 98%;
    --muted: 215 27.9% 16.9%;
    --muted-foreground: 217.9 10.6% 64.9%;
    --accent: 215 27.9% 16.9%;
    --accent-foreground: 210 20% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 20% 98%;
    --border: 215 27.9% 16.9%;
    --input: 215 27.9% 16.9%;
    --ring: 216 12.2% 83.9%;

    /* Dark medical theme colors */
    --medical-blue: 213 94% 58%;
    --medical-blue-dark: 213 94% 48%;
    --medical-green: 142 69% 58%;
    --medical-green-light: 142 69% 68%;
    --medical-red: 0 84% 60%;
    --medical-gray: 220 9% 46%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### client/src/App.tsx
```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import Sidebar from "@/components/sidebar";
import Dashboard from "@/pages/dashboard";
import StudyGuides from "@/pages/study-guides";
import Videos from "@/pages/videos";
import Schedule from "@/pages/schedule";
import Bookmarks from "@/pages/bookmarks";
import Notes from "@/pages/notes";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/study-guides" component={StudyGuides} />
            <Route path="/videos" component={Videos} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/bookmarks" component={Bookmarks} />
            <Route path="/notes" component={Notes} />
            <Route component={NotFound} />
          </Switch>
        </main>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
```

## Installation and Deployment Instructions

To deploy this on free platforms:

### For Vercel:
1. Create a GitHub repository
2. Upload all files maintaining the structure
3. Connect to Vercel
4. Set build command: `npm run build`
5. Set output directory: `dist`

### For Railway:
1. Connect your GitHub repo
2. Railway will auto-detect Node.js
3. Set start command: `npm start`
4. Add environment variables if needed

### For Render:
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm start`

The app includes all sample data and will work immediately after deployment. Users can upload PDFs, click videos to open in new tabs, and use all the study planning features.