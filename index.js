const express = require("express");
const line = require("@line/bot-sdk");
const app = express();

const config = {
  channelAccessToken: process.env.ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_TOKEN,
};
const send_to = process.env.RECEIVER_ID;
const client = new line.Client(config);
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("GAK ADA APA2");
});
app.post("/githubCallback", (req, res) => {
  if (req.body.commits.length > 0) {
    let messageText = `${req.body.pusher.name} -> ${req.body.repository.name} \n`;
    let modified = new Set();
    let removed = new Set();
    let added = new Set();
    messageText += "Commit(s) : \n";
    for (let i = 0; i < req.body.commits.length; i++) {
      let currentCommit = req.body.commits[i];
      messageText += `${i + 1}. ${currentCommit.message}\n`;
      added.add(currentCommit.added);
      removed.add(currentCommit.removed);
      modified.add(currentCommit.modified);
    }
    console.log(added);
    if (added.size > 0 || modified.size > 0 || removed.size > 0) {
      messageText += "\n";
      if (added.size > 0) {
        messageText += "Added: ";
        let isFirst = true;
        added.forEach((x) => {
          if (!isFirst) {
            messageText += ", ";
          }
          messageText += x;
          isFirst = false;
        });
        messageText += "\n";
      }
    }
    if (modified.size > 0) {
      messageText += "Modified: ";
      let isFirst = true;
      modified.forEach((x) => {
        if (!isFirst) {
          messageText += ", ";
        }
        messageText += x;
        isFirst = false;
      });
      messageText += "\n";
    }
    if (removed.size > 0) {
      messageText += "Removed: ";
      let isFirst = true;
      removed.forEach((x) => {
        if (!isFirst) {
          messageText += ", ";
        }
        messageText += x;
        isFirst = false;
      });
      messageText += "\n";
    }
    const message = {
      type: "text",
      text: messageText,
    };
    client
      .pushMessage(send_to, message)
      .then(() => {
        res.send("Ok");
      })
      .catch((err) => {
        res.status(400).send("error");
      });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening in ${PORT}`);
});
