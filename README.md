Clownfish
=========

This application is a relay between [mailgun](https://www.mailgun.com/) and [Google Drive](https://drive.google.com).  It receives messages via mailgun's `notify()` route, downloads them, and archives them in Google Drive.  It is used for aggregating reports from health structures throughout IMA World Health's area of work.

## How it works

Send an email to the clownfish email address with the subject line `${structure} - ${report name}`.

The application will download any attachments and upload them to the Google Drive folder with the name `${structure}`.  If this folder does not exist, it will first create it.

# LICENSE
MIT
