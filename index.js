require("dotenv").config();
const express = require("express");
const fs = require("fs");
const http = require("http");
const https = require("https");
const mime = require("mime-types");
const path = require("path");
const serveStatic = require("serve-static");
const { createProxyMiddleware } = require("http-proxy-middleware");

const key = fs.readFileSync(__dirname + "/selfsigned.key");
const cert = fs.readFileSync(__dirname + "/selfsigned.crt");
const credentials = { key, cert };

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.FOLDER_PATH_TO_REACT) {
  throw new Error("missing FOLDER_PATH_TO_REACT value");
}

const publicFolder = process.env.FOLDER_PATH_TO_REACT;

// app.use(express.static(path.join(publicFolder)));

app.use(
  serveStatic(publicFolder, {
    setHeaders: function (res, path) {
      console.log("mime.lookup(path)", mime.lookup(path));
      if (mime.lookup(path) === "text/css") {
        res.setHeader("Content-Type", "text/css");
        res.setHeader(
          "Cache-Control",
          "max-age=31536000, public, must-revalidate, proxy-revalidate"
        );
      }
    },
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(publicFolder, "index.html"));
});

const routerFn = (req) => {
  return ''
};

const rewriteFn = function (path, req) {
  return '';
};

app.use(
  createProxyMiddleware({
    changeOrigin: true,
    logger: console,
    pathRewrite: rewriteFn,
    router: routerFn,
    secure: false,
  })
);

const server = https.createServer(credentials, app);

server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
