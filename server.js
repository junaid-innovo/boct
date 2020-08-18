const express = require("express");
const next = require("next");
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const cookieParser = require("cookie-parser");
const handle = app.getRequestHandler();
var cors = require("cors");
const server = express();
app.prepare().then(() => {
  // var cors = require("cors");
  // server.use(cors());
  server.use(cookieParser());
  server.get("/service-worker.js", (req, res) => {
    app.serveStatic(req, res, "./.next/service-worker.js");
  });
  //scoping the service workers
  const serviceWorkers = [
    {
      filename: "service-worker.js",
      path: "./.next/service-worker.js",
    },
    {
      filename: "firebase-messaging-sw.js",
      path: "./public/firebase-messaging-sw.js",
    },
  ];
  serviceWorkers.forEach(({ filename, path }) => {
    server.get(`/${filename}`, (req, res) => {
      app.serveStatic(req, res, path);
    });
  });
  server.get("*", (req, res) => {
    return handle(req, res);
  });
  server.listen(port, (err) => {
    if (err) throw err;
  });
});

server.use(function (req, res, next) {
  // Allow Origins
  // res.header("Access-Control-Allow-Origin", "*");
  // Allow Methods
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  // Allow Headers
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, Accept, Content-Type, Authorization"
  );
  // Handle preflight, it must return 200
  if (req.method === "OPTIONS") {
    // Stop the middleware chain
    return res.status(200).end();
  }
  // Next middleware
  next();
});
