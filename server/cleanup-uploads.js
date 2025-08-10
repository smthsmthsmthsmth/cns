import fs from 'fs';
import path from 'path';

// Clean up old uploaded files since we're now storing in database
const uploadsDir = 'uploads/';

if (fs.existsSync(uploadsDir)) {
  console.log('🧹 Cleaning up old uploaded files...');
  
  const files = fs.readdirSync(uploadsDir);
  let removedCount = 0;
  
  files.forEach(file => {
    const filePath = path.join(uploadsDir, file);
    try {
      fs.unlinkSync(filePath);
      removedCount++;
    } catch (error) {
      console.error(`Failed to remove ${file}:`, error.message);
    }
  });
  
  console.log(`✅ Removed ${removedCount} old uploaded files`);
  
  // Remove the uploads directory itself
  try {
    fs.rmdirSync(uploadsDir);
    console.log('✅ Removed uploads directory');
  } catch (error) {
    console.error('Failed to remove uploads directory:', error.message);
  }
} else {
  console.log('ℹ️  No uploads directory found to clean up');
}
