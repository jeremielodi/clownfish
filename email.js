const axios = require('axios');
const debug = require('debug')('clownfish:email');
const fileType = require('file-type');

const { Duplex } = require('stream');

function bufferToStream(buffer) {
  const stream = new Duplex();
  stream.push(buffer);
  stream.push(null);
  return stream;
}

const relay = axios.create({ auth: { username: 'api', password: process.env.MAILGUN_API_KEY } });

async function downloadAttachment(attachment) {
  debug(`Fetching: ${attachment.url}`);

  const res = await relay.get(attachment.url, { responseType: 'arraybuffer' });
  const type = fileType(res.data);

  debug(`Detected filetype: ${type.mime}`);

  return {
    data: bufferToStream(res.data),
    filename: attachment.name,
    mimeType: type.mime,
  };
}

exports.downloadAttachment = downloadAttachment;
