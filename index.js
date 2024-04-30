require("dotenv").config();
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 3000;

if (!process.env.FOLDER_PATH_TO_REACT) {
  throw new Error("missing FOLDER_PATH_TO_REACT value");
}

app.use(express.static(process.env.FOLDER_PATH_TO_REACT));

app.use(
  "/proxy",
  createProxyMiddleware({
    target: "(URL)",
    changeOrigin: true,
  })
);

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
