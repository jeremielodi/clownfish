require('dotenv').config();
const fs = require('fs');

const TOKEN = JSON.parse(fs.readFileSync('./credentials/token.json'));
const { installed } = JSON.parse(fs.readFileSync('./credentials/credentials.json'));

const { google } = require('googleapis');

const auth = new google.auth.OAuth2(
  installed.client_id,
  installed.client_secret,
  installed.redirect_uris[0],
);

// set the credentials for the drive API
auth.setCredentials(TOKEN);

module.exports = google.drive({ version: 'v3', auth });
