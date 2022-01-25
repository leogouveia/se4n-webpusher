const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const webpush = require("web-push");
const Parse = require("parse/node");
const cors = require("cors");

require("dotenv").config();

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "frontend")));

if (process.env.NODE_ENV === "development") {
  app.use(
    cors({
      origin: "*",
    })
  );
}
Parse.serverURL = "https://parseapi.back4app.com/";

Parse.initialize(
  process.env.PARSE_APP_ID,
  process.env.PARSE_JS_KEY,
  process.env.PARSE_MASTER_KEY
);

app.get("/api/push/vapid-keys", (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  return res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post("/api/push/subscribe", (req, res) => {
  console.log(req.body);
  const { subscription: userBrowserSubscription } = req.body;

  const {
    endpoint,
    expirationTime,
    keys: { auth, p256dh },
  } = userBrowserSubscription;

  const subscription = new Parse.Object("PushSubscription");

  return subscription
    .save({
      endpoint,
      expirationTime,
      auth,
      p256dh,
    })
    .then((subs) => {
      console.log(subs);
      return res.status(201).json({
        message: "Subscription saved successfully",
        subscription_id: subs.id,
      });
    })
    .catch((err) => {
      return res.status(500).json(err);
    });
});

app.post("/api/push/unsubscribe", async (req, res) => {
  console.log("body", req.body);
  const {
    subscription: {
      endpoint,
      keys: { auth, p256dh },
    },
  } = req.body;

  const query = new Parse.Query("PushSubscription");
  query.equalTo("endpoint", endpoint);
  query.equalTo("auth", auth);
  query.equalTo("p256dh", p256dh);

  try {
    const subs = await query.first();

    if (!subs) {
      return res.status(404).send();
    }

    await subs.destroy();

    return res.status(200).send();
  } catch (error) {
    return res.status(500).json(error);
  }
});

app.post("/api/push/send", async (req, res) => {
  try {
    const { pushId, message } = req.body;
    const query = new Parse.Query("PushSubscription");
    const subs = await query.get(pushId);

    webpush.setVapidDetails(
      "mailto:" + process.env.CONTACT_MAIL,
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );

    const pushSubscription = {
      endpoint: subs.get("endpoint"),
      keys: { auth: subs.get("auth"), p256dh: subs.get("p256dh") },
    };

    webpush.sendNotification(
      pushSubscription,
      JSON.stringify({
        title: "New message",
        body: message,
      })
    );

    return res.status(200).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json(error);
  }
});
const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
