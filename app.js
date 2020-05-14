require("@babel/polyfill");
const express = require('express');
const app = express();
const path = require('path');
const https = require('https');
const bodyParser = require('body-parser');
const language = require('@google-cloud/language');

let bearer = null;
if (process.env.NODE_ENV !== 'production') {
  bearer = require('./config');
}

const port = process.env.PORT || 3000;

app.use(express.static("dist"));
app.use(bodyParser.json());
app.use(bodyParser.text({ type: 'text/html' }))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

app.get('/tweets', (req, res) => {
  fetchTweets(res);
});

app.post('/analysis', (req, res) => {
  fetchSentimentAnalysis(req, res);
});

app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

function fetchTweets(res) {
  params = "geocode=40.7128,-74.0060,2mi&count=100&tweet_mode=extended";
  console.log(process.env.BEARER);
  const options = {
      host: 'api.twitter.com',
      path: '/1.1/search/tweets.json?' + params,
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + (process.env.BEARER || bearer.bearer),
      }
  }
  let body = "";
  const req = https.request(options, tweetRes => {
      // console.log(`statusCode: ${res.statusCode}`)

      tweetRes.on('data', d => {
          // console.log(`Data chunk received from Twitter`);
          body += String(d);
      })

      tweetRes.on("end", () => {
        res.send(body);
      });
  })

  req.on('error', (e) => {
      console.error(`Error: ${e.message}`);
  });

  req.end();
}

function fetchSentimentAnalysis(req, res) {
  let body = req.body;
  console.log(`Body received: ${body}`);
  console.log("Making sentiment analysis request");
  analyzeSentiment(body).then(sentiment => {
    console.log(sentiment);
    res.json(sentiment);
  }).catch((error) => {
    console.log(error);
  });
}

async function analyzeSentiment(tweets) {
  const client = new language.LanguageServiceClient();

  const document = {
    content: tweets,
    type: 'PLAIN_TEXT',
  };

  console.log(`Fetching sentiment for ${tweets}`);
  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({ document: document });
  const sentiment = result.documentSentiment;

  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

  return sentiment;
}