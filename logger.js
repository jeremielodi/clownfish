const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const dayjs = require('dayjs');
dayjs.extend(require('dayjs/plugin/relativeTime'));

const adapter = new FileSync('events.log');
const db = low(adapter);


// defaults
db.defaults({ events: [], start: new Date() })
  .write();

/**
 * @function write
 *
 * @description
 * Writes the log to a JSON file.
 *
 */
function write(opts) {
  const mixin = {
    elapsed: dayjs(opts.end).from(opts.start, true),
    start: dayjs(opts.start).format('YYYY-MM-DD HH:mm:ss'),
    end: dayjs(opts.end).format('YYYY-MM-DD HH:mm:ss'),
  };

  Object.assign(opts, mixin);

  db.get('events')
    .push(opts)
    .write();
}

function read(n) {
  return db.get('events')
    .takeRight(n)
    .value();
}

function size() {
  return db.get('events')
    .size()
    .value();
}

exports.write = write;
exports.read = read;
exports.size = size;
