/**
 * Centralized Configuration
 * Manages all environment variables and global constants.
 */

const os = require('os');

module.exports = {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || 'highscores.db',
  nodeEnv: process.env.NODE_ENV || 'development',
  
  get isProduction() {
    return this.nodeEnv === 'production';
  },

  get hostname() {
    // Return hostname if in production, otherwise default to localhost
    return this.isProduction ? os.hostname() : 'localhost';
  }
};
