const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);

const express = require("express");
const app = express();

const cors = require("cors")({ origin: true });
app.use(cors);

const anonymusUser = {
  id: "anon",
  name: "Anonymus",
  avatar: ""
};

const checkUser = (req, res, next) => {
  req.user = anonymusUser;
  if (req.query.auth_token != undefined) {
    let idToken = req.query.auth_tkoen;
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodeIdToken => {
        let authUser = {
          id: decodeIdToken.user_id,
          name: decodeIdToken.name,
          avatar: decodeIdToken.picture
        };
        req.user = authUser;
        next();
      })
      .catch(err => {
        next();
      });
  } else {
    next();
  }
};

app.use(checkUser);

function createChannel(cname) {
  let channelsRef = admin.database().ref("channels");
  let date1 = new Date();
  let date2 = new Date();
  date2.setSeconds(date2.getSeconds() + 1);
  const defaultData = `{
    "messages": {
      "1": {
        "body": "Welcome to #${cname} channel",
        "data": "${date1.toJSON()}",
        "user": {
          "avatar": "",
          "id": "robot",
          "name": "Robot"
        }
      },
      "2": {
        "body": "はじめてのメッセージを投稿してみましょう",
        "data": "${date2.toJSON()}",
        "user": {
          "avatar": "",
          "id": "robot",
          "name": "Robot"
        }
      }
    }
  }`;
  channelsRef.child(cname).set(JSON.parse(defaultData));
}

app.post("/channels", (req, res) => {
  let cname = req.body.cname;
  createChannel(cname);
  res.header("content-type", "application/json; charset=utf-8");
  res.status(200).json({ result: "ok" });
});

app.get("/channels", (req, res) => {
  let channelsRef = admin.database().ref("channels");
  channelsRef.once("value", snapShot => {
    let items = [];
    snapShot.forEach(childSnapShot => {
      let cname = childSnapShot.key;
      items.push(cname);
    });
    res.header("content-type", "application/json; charset=utf-8");
    res.send({ channels: items });
  });
});

app.post("/reset", (req, res) => {
  createChannel("general");
  createChannel("random");
  res.header("content-type", "application/json; charset=utf-8");
  res.status(201).json({ result: "ok" });
});

app.post("/channels/:cname/messages", (req, res) => {
  let cname = req.params.cname;
  let message = {
    date: new Date.toJSON(),
    body: req.body.body,
    user: req.user
  };
  let messageRef = admin.database().ref(`channels/${cname}/messages`);
  messageRef.push(message);
  res.status(201).send({ result: "ok" });
});

app.get("/channels/:cname/messages", (req, res) => {
  let cname = req.params.cname;
  let messageRef = admin
    .database()
    .ref(`channels/${cname}/messages`)
    .orderByChild("date")
    .limitToLast(20);
  messageRef.once("value", snapshot => {
    let items = [];
    snapshot.forEach(data => {
      let message = data.val();
      message.id = data.id;
      items.push(message);
    });
    items.reverse();
    res.header("content-type", "application/json; charset=utf-8");
    res.send({ messages: items });
  });
});

exports.v1 = functions.https.onRequest(app);
