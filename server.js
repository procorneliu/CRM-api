//imports
import './src/utils/uncaughtException.js';
import './src/config/dotenv.js';
import app from './app.js';

// Starting server
const server = app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}...`);
});

// Handle all unhandled rejections or asynchronous errors
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
