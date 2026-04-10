const fs = require('fs');
const path = require('path');

const pidFile = path.join(__dirname, '.server.pid');

module.exports = async () => {
  if (!fs.existsSync(pidFile)) {
    return;
  }

  const pid = Number(fs.readFileSync(pidFile, 'utf8'));
  if (!Number.isNaN(pid)) {
    try {
      if (process.platform !== 'win32') {
        process.kill(-pid);
      } else {
        process.kill(pid);
      }
    } catch (error) {
      if (error.code !== 'ESRCH') {
        throw error;
      }
    }
  }

  fs.unlinkSync(pidFile);
};
