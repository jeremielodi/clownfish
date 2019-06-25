require('dotenv').config();

const {
  PORT,
} = process.env;

const debug = require('debug')('clownfish');
const express = require('express');

const api = require('./api');
const email = require('./email');
const drive = require('./drive');

const app = express();
app.use(require('body-parser').json());
app.use(require('body-parser').urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.status(200).send('Clownfish is working');
});

/**
 * @function receive
 *
 * @description
 * Receives post requests from mailgun and processes them to store them on Google Drive.
 */
app.post('/receive', async (req, res, next) => {
  try {
    const mail = req.body;
    const [structure, reportName] = mail.subject.split('-');

    // normalize reporting structure names
    const normalizedStructure = structure.toLowerCase().trim();
    const normalizedReportName = reportName.toLowerCase().trim();

    debug('received a message!');
    debug(`structure: ${normalizedStructure}`);
    debug(`report name: ${normalizedReportName}`);

    let folder = await api.findFolderIdByName(normalizedStructure);
    if (!folder) {
      debug(`Did not locate folder on Google Drive with name "${normalizedStructure}".  Creating a new one.`);

      folder = await api.createFolder(normalizedStructure);
      debug('Folder created!');
    }


    // id where to upload the file
    const folderId = folder.id;

    debug(`Located folder for ${normalizedStructure} with id: ${folderId}`);

    const attachments = mail.attachments && JSON.parse(mail.attachments);

    if (attachments) {
      debug(`Located ${attachments.length} attachments.`);
      // eslint-disable-next-line
      for (const attachment of attachments) {
        // eslint-disable-next-line
        const bulk = await email.downloadAttachment(attachment);

        debug(`Uploading: ${attachment.name}`);

        // eslint-disable-next-line
        await drive.files.create({
          resource: { name: bulk.filename, parents: [folderId] },
          media: { mimeType: bulk.contentType, body: bulk.data },
          fields: 'id',
        });
      }
    }

    debug(`Finished processing ${attachments.length} attachments`);

    res.sendStatus(200);
  } catch (e) {
    debug('An error occurred: %j', e);
    next(e);
  }
});

app.listen(PORT, () => debug(`listening on port: ${PORT}.`));
