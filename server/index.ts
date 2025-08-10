import express, { Request, Response, NextFunction } from "express";
import { connectToDatabase } from "./database";
import { MongoStorage } from "./storage";
import { registerRoutes, registerMulterErrorHandling } from "./routes";
// Only import Vite in development
// import { setupVite } from "./vite";
// import { serveStatic } from "./vite";
import "dotenv/config";

const app = express();
const storage = new MongoStorage();

// CORS configuration
app.use((req, res, next) => {
  const origin = req.headers.origin;
                const allowedOrigins = [
                'http://localhost:5173',
                'http://localhost:5000',
                'https://cns-urpo.vercel.app', // Your actual Vercel frontend domain
                'https://cns-e9ar.onrender.com' // Your Render server domain
              ];
  
  if (origin && allowedOrigins.includes(origin)) {
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

    const port = parseInt(process.env.PORT || '5000', 10);

    // Always bind to 0.0.0.0 for production deployment
    const bindAddress = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

    const server = app.listen(port, bindAddress, () => {
      if (bindAddress === '0.0.0.0') {
        console.log(`🚀 NeuroGuide app running on port ${port}`);
      } else {
        console.log(`🚀 NeuroGuide app running at: http://localhost:${port}`);
      }
    });

    server.on('error', (error: any) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${port} is already in use. Try a different port.`);
        process.exit(1);
      } else if (error.code === 'ENOTSUP') {
        console.error(`❌ Port binding not supported. Trying 0.0.0.0 instead.`);
        server.listen(port, '0.0.0.0', () => {
          console.log(`🚀 NeuroGuide app running on port ${port}`);
        });
      } else {
        console.error('❌ Server error:', error);
        process.exit(1);
      }
    });

    // Global error handler
    app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      console.error('Server error:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        contentType: req.headers['content-type']
      });

      const status = error.status || error.statusCode || 500;
      const message = error.message || 'Internal Server Error';

      if (!res.headersSent) {
        res.status(status).json({ error: message });
      }
    });

    // Serve static files or Vite dev server based on environment
    if (process.env.NODE_ENV === 'development') {
      // Set up Vite dev server
      const { setupVite } = await import('./vite');
      await setupVite(app, server);
    } else {
      // Serve static files in production
      const { serveStatic } = await import('./vite');
      serveStatic(app);
    }

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();