# in a mood
A simple app that answers one question: what's the current mood in New York City?

![Getting the current mood](https://user-images.githubusercontent.com/11576738/81991809-0f62d580-9610-11ea-9b81-adf7357ebf8a.gif "In a Mood in action")

## How It Works
The “mood” is calculated by fetching the latest Tweets from the NYC area then passing them to the Google Cloud Natural Language API.

The Language API analyzes the emotional sentiment of the text then returns a number from -1 (negative sentiment) to 1 (positive sentiment).

This number is then converted to a color based on a gradient scale and shown in the center of the mood ring. The outer mood ring color is random – to capture the true spirit of mood rings, of course.


## Technologies
JavaScript | Express | D3.js | Twitter API | Google Cloud Natural Language API | SVG

In a Mood was largely an exercise in using "vanilla" Javascript for a frontend-focused app. 
* CSS variables for dynamic site-wide theme options
* Javascript and CSS animations 

The color scale and mood ring image use D3.js and a custom SVG graphic. While this does not make heavy use of D3.js in its current state (see Plans below), this was also a good exercise in learning the core functionality of D3.js and how it can map sets of data to something more visually interesting and then dynamically manipulate the DOM. 

Because using both the Twitter API and the Google Natural Language API requires authorized credentials, I set up a simple Express server to handle these API requests.
* Custom async requests between frontend and backend
* Regex stripping of mentions and URLs from Tweets


## Limitations
TL;DR This is less an accurate gauge of mood than it is a technical demonstration of how it could be done.

Due to limitations in free usage of the Language API, each Tweet sample size is small. Also, rather than analyzing the sentiment of each Tweet individually, the text is analyzed as an aggregate.

Analyzing the Tweets individually would be more accurate and would allow better usage of another value returned by the Language API, the magnitude, which measures the overall emotion present in the text. Using this value with individual analyses would allow ruling out Tweets with no clear emotion (e.g. spam).


## Plans
Original plans included persisting the received data to a lightweight database to have a record of the mood over time. This would make heavier (and more typical) use of D3.js by plotting the data for the last x days in a line chart. Hopefully this can be added soon! 
