# NeuroGuide Deployment Guide

This guide covers deploying the NeuroGuide application with the server on Render and the client on Vercel.

## Prerequisites

- MongoDB Atlas account (for production database)
- Render account
- Vercel account
- Git repository with your code

## 1. Server Deployment on Render

### Step 1: Prepare MongoDB Atlas
1. Create a new cluster on MongoDB Atlas
2. Create a database user with read/write permissions
3. Get your connection string (it will look like: `mongodb+srv://username:password@cluster.mongodb.net/neuroguide?retryWrites=true&w=majority`)

### Step 2: Deploy to Render
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure the service:
   - **Name**: `neuroguide-server`
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Plan**: `Starter` (or your preferred plan)

### Step 3: Set Environment Variables
Add these environment variables in Render:
- `NODE_ENV`: `production`
- `MONGODB_URI`: Your MongoDB Atlas connection string
- `JWT_SECRET`: A strong random string for JWT signing
- `PORT`: `10000` (Render will override this)

### Step 4: Deploy
Click "Create Web Service" and wait for deployment to complete.

## 2. Client Deployment on Vercel

### Step 1: Deploy to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (root of your project)
   - **Build Command**: `npm run build:client`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Step 2: Set Environment Variables
Add this environment variable in Vercel:
- `VITE_API_URL`: Your Render server URL (e.g., `https://neuroguide-server.onrender.com`)

### Step 3: Deploy
Click "Deploy" and wait for deployment to complete.

## 3. Update CORS Configuration

After getting your Vercel domain, update the CORS configuration in `server/index.ts`:

```typescript
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:5000',
  'https://your-vercel-domain.vercel.app', // Replace with your actual domain
  'https://your-vercel-preview-domain.vercel.app' // Replace with your preview domain
];
```

## 4. Test the Deployment

1. Test your server health endpoint: `https://your-render-app.onrender.com/api/health`
2. Test your client by visiting your Vercel domain
3. Try logging in and using the application features

## 5. Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs in Render/Vercel
2. **CORS Errors**: Ensure your Vercel domain is in the allowed origins
3. **Database Connection**: Verify your MongoDB Atlas connection string and network access
4. **Environment Variables**: Double-check all environment variables are set correctly

### Debug Commands:

```bash
# Test server build locally
npm run build:server

# Test client build locally
npm run build:client

# Check server locally
npm start
```

## 6. Production Considerations

- **Security**: Use strong JWT secrets and MongoDB Atlas security features
- **Performance**: Consider using MongoDB Atlas M10+ for better performance
- **Monitoring**: Set up logging and monitoring in Render
- **Backups**: Enable MongoDB Atlas backups
- **SSL**: Both Render and Vercel provide SSL certificates automatically

## 7. Environment Variables Reference

### Server (Render):
```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neuroguide
JWT_SECRET=your-strong-secret-key
PORT=10000
```

### Client (Vercel):
```
VITE_API_URL=https://your-render-app.onrender.com
```

## 8. Update Your Repository

After deployment, commit and push your changes:

```bash
git add .
git commit -m "Add deployment configuration"
git push origin main
```

Your application should now be live on both Render and Vercel!
