const fs = require('fs');
const net = require('net');
const path = require('path');
const { spawn } = require('child_process');

const pidFile = path.join(__dirname, '.server.pid');
const port = Number(process.env.PORT || 4000);

const waitForPort = (host, targetPort, timeoutMs = 30000) =>
  new Promise((resolve, reject) => {
    const startedAt = Date.now();

    const check = () => {
      const socket = net.createConnection({ host, port: targetPort });

      socket.on('connect', () => {
        socket.end();
        resolve();
      });

      socket.on('error', () => {
        socket.destroy();
        if (Date.now() - startedAt >= timeoutMs) {
          reject(new Error(`Timed out waiting for ${host}:${targetPort}`));
          return;
        }
        setTimeout(check, 250);
      });
    };

    check();
  });

module.exports = async () => {
  const nodeBinary = process.execPath;
  const child = spawn(
    nodeBinary,
    ['-r', 'ts-node/register', '-r', 'tsconfig-paths/register', 'src/main.ts'],
    {
      cwd: path.join(__dirname, '..'),
      env: {
        ...process.env,
        PORT: String(port),
      },
      detached: true,
      stdio: 'ignore',
    },
  );

  fs.writeFileSync(pidFile, String(child.pid), 'utf8');
  child.unref();

  await waitForPort('127.0.0.1', port);
};
