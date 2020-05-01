export const readTweets = (tweets) => {
    // debugger
    let tweetCount = 0;
    const tweetText = [];

    JSON.parse(tweets).statuses.forEach(tweet => {
        tweetCount++;
        if (tweet.retweeted_status) {
            tweetText.push(tweet.retweeted_status.full_text);
        } else {
            tweetText.push(tweet.full_text);
        }
    });
    // console.log(`Tweet count: ${tweetCount}`);
    tweetText.forEach(tweet => {
        writeTweet(cleanTweet(tweet));
    });
}

export const prepTweetsForLang = (tweets) => {
    let tweetCount = 0;
    const allTweets = JSON.parse(tweets).statuses.map(tweet => {
        tweetCount++;
        if (tweet.retweeted_status) {
            return cleanTweet(tweet.retweeted_status.full_text);
        } else {
            return cleanTweet(tweet.full_text);
        }
    });
    // console.log(`Tweet count: ${tweetCount}`);

    return allTweets.join("\r\n");
}

function cleanTweet(tweet) {
    let regexLink = /https?:\/\/.*[\r\n]*/g;
    let regexMention = /@\S*\s/g;
    return tweet.replace(regexLink, "").replace(regexMention, "");
}

function writeTweets(tweets) {
    const root = document.getElementById("root");
    root.appendChild(document.createTextNode(tweets));
}

function writeTweet(tweet) {
    const listNode = document.createElement("LI");
    const tweetText = document.createTextNode(tweet);
    listNode.appendChild(tweetText);
    const tweetList = document.getElementById("tweet-list");
    tweetList.appendChild(listNode);
}