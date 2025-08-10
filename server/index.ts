import express, { Request, Response, NextFunction } from "express";
import { connectToDatabase } from "./database";
import { MongoStorage } from "./storage";
import { registerRoutes, registerMulterErrorHandling } from "./routes";
import { setupVite } from "./vite";
import { serveStatic } from "./vite";
import "dotenv/config";

const app = express();
const storage = new MongoStorage();

// CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:5173' || origin === 'http://localhost:5000') {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// IMPORTANT: Register routes FIRST, before any body parsing middleware
// This allows multer in your routes to handle file uploads before JSON parsing kicks in
(async () => {
  try {
    // Connect to MongoDB first
    await connectToDatabase();
    
    // IMPORTANT: Register body parsing middleware BEFORE routes
    // This ensures req.body is available when routes execute
    
    // Only apply JSON parsing to requests that aren't multipart uploads
    app.use((req, res, next) => {
      const contentType = req.headers['content-type'] || '';
      
      // Skip JSON parsing for multipart form data (file uploads)
      if (contentType.startsWith('multipart/form-data')) {
        return next();
      }
      
      // Only apply JSON parsing for JSON content type (including with charset)
      if (contentType.includes('application/json')) {
        return express.json({ limit: '50mb' })(req, res, next);
      }
      
      next();
    });

    // URL-encoded parsing (but not for multipart)
    app.use((req, res, next) => {
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('application/x-www-form-urlencoded')) {
        return express.urlencoded({ extended: false, limit: '50mb' })(req, res, next);
      }
      
      next();
    });
    
    // NOW register routes AFTER body parsing middleware
    await registerRoutes(app);
    await registerMulterErrorHandling(app);
    
    // Logging middleware
    app.use((req, res, next) => {
      const start = Date.now();
      const path = req.path;
      let capturedJsonResponse: Record<string, any> | undefined = undefined;

      const originalResJson = res.json;
      res.json = function (bodyJson, ...args) {
        capturedJsonResponse = bodyJson;
        return originalResJson.apply(res, [bodyJson, ...args]);
      };

      res.on("finish", () => {
        const duration = Date.now() - start;
        if (path.startsWith("/api")) {
          let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
          if (capturedJsonResponse) {
            logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
          }

          if (logLine.length > 80) {
            logLine = logLine.slice(0, 79) + "…";
          }

          console.log(logLine);
        }
      });

      next();
    });
    
    // Get port from environment or default to 5000
    const port = parseInt(process.env.PORT || '5000', 10);
    
    const server = app.listen(port, 'localhost', () => {
      console.log(`🚀 NeuroGuide app running at: http://localhost:${port}`);
    });

    // Handle server errors
    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Try a different port.`);
        process.exit(1);
      } else if (error.code === 'ENOTSUP') {
        console.error(`❌ Port binding not supported. Trying localhost instead.`);
        server.listen(port, 'localhost', () => {
          console.log(`🚀 NeuroGuide app running at: http://localhost:${port}`);
        });
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Error handling middleware (should be AFTER route registration)
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Server error:', {
        message: err.message,
        stack: err.stack,
        url: req.url,
        method: req.method,
        contentType: req.headers['content-type']
      });
      
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      // Don't send response if headers already sent
      if (!res.headersSent) {
        res.status(status).json({ 
          error: message,
          ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
      }
    });

    // Setup Vite in development
    if (app.get("env") === "development") {
      await setupVite(app, server);
    } else {
      serveStatic(app);
    }

  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();