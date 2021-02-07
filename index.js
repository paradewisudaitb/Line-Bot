const express = require("express");
const bodyParser = require("body-parser");
const line = require("@line/bot-sdk");
const app = express();

const config = {
    channelAccessToken: process.env.ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_TOKEN
  };
const send_to = process.env.RECEIVER_ID;
const client = new line.Client(config);
app.use(bodyParser.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req,res) => {
  res.send("GAK ADA APA2")
})
app.post("/githubCallback", (req, res) => {
  let messageText = `${req.body.pusher.name} make a push to ${req.body.repository.name} \n`
  messageText += "Commit(s) : \n";
  for (let i = 0; i < req.body.commits.length;i++) {
      let currentCommit = req.body.commits[i];
      messageText += `${i + 1}. ${currentCommit.message}\n`;
  }
  const message = {
      type : "text",
      text : messageText
  }
  client.pushMessage(send_to, message)
  .then(() => {
      res.send("Ok");

  })
  .catch((err) => {
      console.log(err);
      res.status(400).send("error");
  })
});

app.listen(PORT, () => {
  console.log(`Listening in ${PORT}`);
});
