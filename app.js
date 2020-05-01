const http = require('http');
const https = require('https');
const url = require('url');
const { bearer } = require('./config');
const language = require('@google-cloud/language');
require("@babel/polyfill");

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  let path = url.parse(req.url).pathname;
  if (path === '/tweets') {
    fetchTweets(res);
  } else if (path = 'analysis') {
    fetchSentimentAnalysis(req, res);
  }
});

function fetchTweets(res) {
  params = "geocode=40.7128,-74.0060,2mi&count=15&tweet_mode=extended";
  const options = {
      host: 'api.twitter.com',
      path: '/1.1/search/tweets.json?' + params,
      method: 'GET',
      headers: {
          'Authorization': 'Bearer ' + (process.env.BEARER || bearer),
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
        // console.log("Sending data to client");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type', 'application/json');
        res.write(body);
        res.end();
      });
  })

  req.on('error', (e) => {
      console.error(`Error: ${e.message}`);
  });

  req.end();
}

function fetchSentimentAnalysis(req, res) {
  let body = '';
  req.on('data', (chunk) => {
    body += chunk;
  }).on('end', () => {
    // console.log(`Body sent: ${body}`);
    // console.log("Making sentiment analysis request");
    analyzeSentiment(body).then( sentiment => {
      // console.log(sentiment);
      respondAnalysis(res, sentiment);
    }).catch((error) => {
      // console.log(error);
    });
  });

  req.on('error', (e) => {
    // console.error(`Error: ${e.message}`);
  });
}

function respondAnalysis(res, sentiment) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');  
  const sentimentResponse = JSON.stringify(sentiment);
  res.write(sentimentResponse);
  res.end();
}

async function analyzeSentiment(tweets) {
  const client = new language.LanguageServiceClient();

  const document = {
    content: tweets,
    type: 'PLAIN_TEXT',
  };

  // console.log(`Fetching sentiment for ${tweets}`);
  // Detects the sentiment of the text
  const [result] = await client.analyzeSentiment({ document: document });
  const sentiment = result.documentSentiment;

  // console.log(`Sentiment score: ${sentiment.score}`);
  // console.log(`Sentiment magnitude: ${sentiment.magnitude}`);

  return sentiment;
}


server.listen(port, () => {
  // console.log(`Listening on ${port}`);
});