require("@babel/polyfill");
import { getTweets } from './scripts/twitter/twitter_api';
import { readTweets, prepTweetsForLang } from './scripts/twitter/tweet_data';
import { getAnalysis } from './scripts/language/language_api';
import { createChart } from './scripts/charts/chart';
import CurrentMood from './scripts/charts/moodring';

class App {
    constructor() {
        this.mood = null;

        const title = document.getElementsByClassName("title")[0];
        title.classList.add("animate");
        title.addEventListener("animationend", () => this.titleAnimationEnd());

        document.addEventListener('click', (event) => {
            if (!event.target.matches('.get-tweets')) return;
            event.preventDefault();
            this.getCurrentMood();
        });

        document.querySelectorAll('.color-picker-button').forEach(button => {
            button.addEventListener('click', this.changeTheme);
        })

        window.addEventListener('resize', () => this.updateSizes());

        this.mood = new CurrentMood();
        createChart();
    }

    async getCurrentMood() {
        this.updateMoodMessage("Grabbing latest Tweets...");
        const tweets = await getTweets();
        const preppedTweets = prepTweetsForLang(tweets);
        this.updateMoodMessage("Analyzing Tweets...");
        const {score, magnitude} = await getAnalysis(preppedTweets);
        this.mood.updateScore(score);
        this.mood.updateMessage('');
    }

    updateMoodMessage(text) {
        this.mood.updateMessage(text);
    }

    updateSizes() {
        this.mood.drawAll();
    }

    titleAnimationEnd() {
        const title = document.getElementsByClassName("title")[0];
        setTimeout(() => title.innerHTML += "?", 500);
    }

    changeTheme(e) {
        e.preventDefault();
        const theme = e.currentTarget.value.slice(-1);
        const root = document.documentElement;
        root.style.setProperty('--bg-color', `var(--primary-${theme})`);
        root.style.setProperty('--border-color', `var(--border-${theme})`);
        root.style.setProperty('--secondary-color', `var(--secondary-${theme})`);
        root.style.setProperty('--header-color', `var(--header-${theme})`);
    }
}

export default App;