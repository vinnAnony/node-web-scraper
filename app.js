const browserObject = require('./browser');
const scraperController = require('./pageController');

const express = require("express");
const app = express();

let browserInstance = browserObject.startBrowser();

scraperController(browserInstance)


app.listen(5000, () => {
    console.log(`Server is up and running on 5000 ...`);
});

