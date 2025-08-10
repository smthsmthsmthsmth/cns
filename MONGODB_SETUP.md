# MongoDB Setup Guide

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# MongoDB Connection String
MONGODB_URI=mongodb://localhost:27017/neuroguide

# Server Configuration
PORT=5000
NODE_ENV=development

# Session Configuration (Optional - will use default if not set)
SESSION_SECRET=your-super-secret-session-key
```

## MongoDB Connection String Examples

### Local MongoDB
```bash
MONGODB_URI=mongodb://localhost:27017/neuroguide
```

### MongoDB Atlas (Cloud)
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/neuroguide?retryWrites=true&w=majority
```

### MongoDB with Authentication
```bash
MONGODB_URI=mongodb://username:password@localhost:27017/neuroguide
```

## Installation Steps

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   - Create `.env` file with your MongoDB connection string
   - Replace `MONGODB_URI` with your actual MongoDB connection

3. **Run the Application:**
   ```bash
   npm run dev
   ```

## User Separation (No Login Required!)

The app automatically creates separate dashboards for each user using **session-based identification**:

- **Automatic User Creation**: Each browser session gets a unique user ID
- **Data Isolation**: All data (topics, notes, videos, etc.) is separated by user
- **No Registration**: Users can start using the app immediately
- **Session Persistence**: User data persists across browser sessions (30 days)

### How It Works:
1. User visits the app → Gets unique session ID
2. All API calls include the session ID
3. Database queries filter by user ID
4. Each user sees only their own data

## Database Collections

The application will automatically create the following collections:
- `topics` - Study topics and progress (per user)
- `studyguides` - PDF study materials (per user)
- `videos` - Educational videos (per user)
- `scheduleitems` - Study schedule (per user)
- `bookmarks` - Saved bookmarks (per user)
- `notes` - Study notes (per user)
- `studyprogress` - Overall progress tracking (per user)

## Default Data

The application will automatically populate the database with sample neuroscience data on first run:
- 6 neuroscience topics (Neuroanatomy, Neurophysiology, etc.)
- Sample videos, notes, bookmarks, and schedule items
- Initial progress tracking data

**Note**: Sample data is created for a demo user. Real users will start with empty dashboards.

## Troubleshooting

### Connection Issues
- Ensure MongoDB is running
- Check your connection string format
- Verify network connectivity for cloud databases

### Data Not Loading
- Check MongoDB connection in server logs
- Verify database permissions
- Ensure collections are created properly

### Session Issues
- Clear browser cookies if user separation isn't working
- Check that `SESSION_SECRET` is set (optional but recommended)
- Restart the server if session problems persist

## Security Notes

- **Session Storage**: Uses in-memory session storage (data lost on server restart)
- **User Isolation**: Each user's data is completely separated
- **No Authentication**: Anyone can access the app and create their own dashboard
- **Production**: Consider using Redis or database session storage for production 