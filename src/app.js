require("@babel/polyfill");
import { getTweets } from './scripts/twitter/twitter_api';
import { readTweets, prepTweetsForLang } from './scripts/twitter/tweet_data';
import { getAnalysis } from './scripts/language/language_api';
import { createChart } from './scripts/charts/chart';
import CurrentMood from './scripts/charts/moodring';

class App {
    constructor() {
        this.mood = null;
        this.modal = false;
        const title = document.getElementsByClassName("title")[0];
        title.classList.add("animate");
        title.addEventListener("animationend", () => this.titleAnimationEnd());

        document.querySelector('.refresh-mood').addEventListener('click', () => {
            event.preventDefault();
            this.getCurrentMood();
        })

        document.querySelectorAll('.color-picker-button').forEach(button => {
            button.addEventListener('click', this.changeTheme);
        })

        document.querySelector('.about-button').addEventListener('click', () => {
            this.toggleModal();
        })

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.toggleModal();
        })

        document.querySelector('.modal-child').addEventListener('click', () => {
            console.log("Stopping event bubbling");
            event.stopPropagation();
        })

        document.querySelector('.modal-background').addEventListener('click', () => {
            console.log("Toggling modal");
            this.toggleModal();
        })

        window.addEventListener('resize', () => this.updateSizes());

        this.mood = new CurrentMood();
        // createChart();
    }

    toggleModal() {
        let modalEle = document.querySelector('.modal-background');
        if (this.modal) {
            this.modal = false;
            modalEle.classList.add("hidden");
        } else {
            this.modal = true;
            modalEle.classList.remove("hidden");
        }
    }

    async getCurrentMood() {
        this.animateLoading();
        this.updateMoodMessage("grabbing latest tweets...");
        const tweets = await getTweets();
        const preppedTweets = prepTweetsForLang(tweets);
        this.updateMoodMessage("analyzing tweets...");
        const {score, magnitude} = await getAnalysis(preppedTweets);
        this.mood.updateScore(score);
        // this.mood.updateMessage(`mood rating:\n${score.toFixed(2)}`);
        this.mood.updateMessage(this.convertScoreToText(score));
        this.stopAnimateLoading();
    }

    convertScoreToText(score) {
        let string = "feeling ";
        if (score > 0.8) {
            string += "great!";
        } else if (score > 0.4) {
            string += "pretty good";
        } else if (score > 0.1) {
            string += "not bad";
        } else if (score > -0.1) {
            string += "nothing at all";
        } else if (score > -0.4) {
            string += "not great";
        } else if (score > -0.8) {
            string += "pretty bad";
        } else {
            string += "terrible!";
        }

        return string;
    }

    animateLoading() {
        let refreshIcon = document.querySelector('.refresh-icon');
        let hand = document.querySelector('.refresh-hand');
        if (hand) {
            hand.remove();
            refreshIcon.classList.remove('animate');
        }
        refreshIcon.classList.add('animate-loading');
    }

    stopAnimateLoading() {
        let refreshIcon = document.querySelector('.refresh-icon');
        refreshIcon.classList.remove('animate-loading');
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