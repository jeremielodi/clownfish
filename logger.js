const debug = require('debug')('sqlite');
const sqlite3 = require('sqlite3').verbose();
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/relativeTime'));

/**
 * open database mode :
 * sqlite3.OPEN_CREATE | sqlite3.OPEN_READONLY | sqlite3.OPEN_READWRITE
 */
const OPEN_MODE = 'sqlite3.OPEN_READWRITE';

class Logger {
  constructor(name) {
    this.db = new sqlite3.Database(name || './database.db', OPEN_MODE, (err) => {
      if (err) { throw err; }
      debug('Connected to the disk file database.');
    });
  }

  write(params) {
    const start = dayjs(params.start).format('YYYY-MM-DD HH:mm:ss');
    const end = dayjs(params.end).format('YYYY-MM-DD HH:mm:ss');
    const elapsed = dayjs(end).from(start, true);
    const parameters = {
      $googleDriveParentFolderId: params.googleDriveParentFolderId,
      $normalizedStructure: params.normalizedStructure,
      $normalizedReportName: params.normalizedReportName,
      $attachments: params.attachments,
      $start: start,
      $sender: params.sender,
      $end: end,
      $elapsed: elapsed,
    };
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS logger (
          googleDriveParentFolderId INTEGER,
          normalizedStructure TEXT,
          normalizedReportName TEXT,
          attachments TEXT,
          start TEXT,
          sender TEXT,
          end TEXT,
          elapsed TEXT
        )`);

      this.db.run(`
        INSERT INTO logger (googleDriveParentFolderId, normalizedStructure, normalizedReportName, attachments, start, sender, end, elapsed)
        VALUES ($googleDriveParentFolderId, $normalizedStructure, $normalizedReportName, $attachments, $start, $sender, $end, $elapsed)
      `, parameters);
    });
  }

  read(n) {
    return new Promise((resolve, reject) => {
      const limit = n ? ` LIMIT ${n}` : '';
      const query = `
        SELECT
          googleDriveParentFolderId, normalizedStructure, normalizedReportName, attachments, start, sender, end, elapsed
        FROM logger ORDER BY start DESC ${limit}
        `;

      this.db.all(query, (err, rows) => {
        if (err) { return reject(err); }
        return resolve(rows);
      });
    });
  }

  size() {
    return new Promise((resolve, reject) => {
      this.db.get('SELECT COUNT(*) size FROM logger', (err, row) => {
        if (err) { return reject(err); }
        return resolve(row);
      });
    });
  }

  close() {
    this.db.close((err) => {
      if (err) { throw err; }
      debug('Close the database connection.');
    });
  }
}

module.exports = (name) => new Logger(name);
