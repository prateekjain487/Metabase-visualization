const express = require("express");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use("/getchart", (req, res, next) => {
  const METABASE_SITE_URL = "http://localhost:3000";
  const METABASE_SECRET_KEY = process.env.METABASE_SECRET_KEY;

  const payload = [];
  const token = [];
  const iframeUrl = [];

  for (let i = 1; i < 6; i++) {
    payload[i] = {
      resource: { question: i },
      params: {},
      exp: Math.round(Date.now() / 1000) + 10 * 60, // 10 minute expiration
    };
    token[i] = jwt.sign(payload[i], METABASE_SECRET_KEY);

    iframeUrl[i] =
      METABASE_SITE_URL +
      "/embed/question/" +
      token[i] +
      "#bordered=true&titled=true";
  }

  res.send(
    `<html>
      <body>
        ${iframeUrl.map((item) => {
          return (
            `<iframe
              src='${item}'
              frameborder="0"
              width="800"
              height="600"
              allowtransparency
            ></iframe>`
          );
        })}
      </body>
    </html>`
  );
});

app.use("/", (req, res, next) => {
  res.send("<h1>Else</h1>");
});

app.listen(5000, () => {
  console.log("listening to port 5000");
});
