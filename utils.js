const debug = require('debug')('clownfish');
const drive = require('./drive');
const email = require('./email');

function detectSeparator(subject) {
  if (subject.includes('--')) {
    return '--';
  }

  if (subject.includes('-')) {
    return '-';
  }


  if (subject.includes('–')) {
    return '–';
  }

  return '';
}

const reply = new RegExp('re:', 'g');
const fwd = new RegExp('fwd:', 'g');
function stripForwardAndReply(subject) {
  return subject.toLowerCase()
    .replace(reply, '')
    .replace(fwd, '')
    .trim();
}

/**
 * @function parseSubjectLine
 *
 * @description
 * Parses the subject line of the email to bring out the
 */
function parseSubjectLine(subject) {
  // support multiple kinds of separators.
  const separator = detectSeparator(subject);
  const parsed = stripForwardAndReply(subject);

  const [structure, reportName] = parsed.split(separator);

  // normalize reporting structure names
  const normalizedStructure = structure.toLowerCase().trim();
  const normalizedReportName = reportName.toLowerCase().trim();

  return { normalizedStructure, normalizedReportName };
}

/**
 *
 *
 */
async function uploadAttachmentsToGoogleDrive(attachments, normalizedReportName, parentFolderId) {
  // eslint-disable-next-line
  for (const attachment of attachments) {
    // eslint-disable-next-line
    const bulk = await email.downloadAttachment(attachment);

    const fname = `${normalizedReportName}.${bulk.ext}`;
    debug(`Uploading: ${fname}`);

    // eslint-disable-next-line
    await drive.files.create({
      resource: { name: fname, parents: [parentFolderId] },
      media: { mimeType: bulk.mimeType, body: bulk.data },
      fields: 'id',
    });
  }
}

exports.parseSubjectLine = parseSubjectLine;
exports.uploadAttachmentsToGoogleDrive = uploadAttachmentsToGoogleDrive;
