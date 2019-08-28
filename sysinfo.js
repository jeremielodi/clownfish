const process = require('process');
const os = require('os');

function getSystemInfo() {
  const info = {};
  info.hostname = os.hostname();
  info.os = `${os.type()} - ${os.arch()}`;
  info.ram = (os.totalmem() / (1024 ** 3));
  info.cpus = os.cpus().length;
  info.uptime = process.uptime();
  info.sysuptime = os.uptime();
  info.loadavg = os.loadavg();
  info.nodeversion = process.versions.node;
  return info;
}

module.exports = getSystemInfo;
