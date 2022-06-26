const ip = require("ip");
const http = require("http");
const serveHandler = require("serve-handler");
const path = require("path");
const findFreePort = require("find-free-port");
const { writeFile } = require("fs/promises");
const { exec } = require("child_process");

async function startStaticServer(host) {
  const STATIC_SERVER_PORT = await new Promise((res, rej) =>
    findFreePort(3001, 20e3, host, (err, freePort) => {
      if (err) return rej(err);

      res(freePort);
    })
  );

  const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");

    return serveHandler(request, response, {
      public: path.resolve(__dirname, "./content"),
    });
  });

  await new Promise((res) =>
    server.listen(STATIC_SERVER_PORT, host, () => {
      console.log("Running at" + host + ":" + STATIC_SERVER_PORT);
      res();
    })
  );

  return STATIC_SERVER_PORT;
}

async function provideEnvConfig(config) {
  const rawConfig = Object.entries(config)
    .map(([name, value]) => "NEXT_PUBLIC_" + name + "=" + value)
    .join("\n");

  return writeFile(path.resolve(__dirname, "./.env"), rawConfig, "utf-8");
}

async function runCommand(command) {
  const childProcess = exec(command);
  childProcess.stdout.pipe(process.stdout);
  childProcess.stdout.pipe(process.stdout);
  childProcess.stderr.pipe(process.stderr);

  return new Promise((res) => childProcess.on("exit", res));
}

void (async function __MAIN__() {
  const getUrl = (host, port) => `http://${host}:${port}`;

  const config = {
    HOST: ip.address(),
    PORT: 3e3,
  };
  config.ORIGIN = getUrl(config.HOST, config.PORT);

  const STATIC_SERVER_PORT = await startStaticServer(config.HOST);

  config.STATIC_SERVER_PORT = STATIC_SERVER_PORT;
  config.STATIC_ORIGIN = getUrl(config.HOST, STATIC_SERVER_PORT);

  await provideEnvConfig(config);

  await runCommand("./node_modules/.bin/next build");

  await runCommand(
    `./node_modules/.bin/next start --hostname ${config.HOST} --port ${config.PORT}`
  );
})();
