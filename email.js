const axios = require('axios');
const debug = require('debug')('clownfish:email');

const relay = axios.create({ auth: { username: 'api', password: process.env.MAILGUN_API_KEY } });

async function downloadAttachment(attachment) {
  debug(`Fetching: ${attachment.url}`);
  const res = await relay.get(attachment.url, { responseType: 'arraybuffer ' });

  return {
    data: res.data,
    filename: attachment.name,
    contentType: res.headers['content-type'],
    knownLength: res.headers['content-length'],
  };
}

exports.downloadAttachment = downloadAttachment;
