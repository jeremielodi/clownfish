const drive = require('./drive');

const parentReportId = process.env.GDRIVE_REPORT_DIR_ID;

/**
 * @function findFolderIdByName
 *
 * @param {String} name - the name of the folder to locate in Google Drive.
 *
 */
async function findFolderIdByName(name) {
  const { data } = await drive.files.list({
    q: `name="${name}"`,
    spaces: 'drive',
    fields: 'files(id, name)',
    parents: [parentReportId],
  });

  if (data.files && data.files.length) {
    return data.files[0];
  }

  return null;
}

/**
 * @function createFolder
 *
 * @param {String} name - the name of the folder to create in Google Drive
 *
 * @description
 * Creates a new folder in Google Drive underneath the top level directory.
 */
async function createFolder(name) {
  const mimeType = 'application/vnd.google-apps.folder';
  const resource = { name, mimeType, parents: [parentReportId] };
  const { data } = await drive.files.create({
    resource,
    fields: 'id',
  });

  return data;
}

exports.findFolderIdByName = findFolderIdByName;
exports.createFolder = createFolder;
