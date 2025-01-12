const express = require('express');
const urlRouter = express.Router();
const userAuth = require('../middlewares/auth');
const { handleGenerateNewShortURL, getCompleteURL, fetchAllShortenedURLS, totalURLSCreatedPerDay, totalURLSCreatedPerMonth, totalClicksAllUrls, totalUrls } = require('../controllers/urlController');


//Route to generate url
urlRouter.post("/generate-url", userAuth, handleGenerateNewShortURL);

//Route to actual url
urlRouter.get("/fetchURL/:shortID", getCompleteURL);

//Route to get URLs
urlRouter.get("/fetchShortenURLs", userAuth, fetchAllShortenedURLS);


//Route to get total URLs Created Per Day:
urlRouter.get("/analytics/urls-per-day", userAuth, totalURLSCreatedPerDay)

//Route to get total URLs Created Per month:
urlRouter.get("/analytics/urls-per-month", userAuth, totalURLSCreatedPerMonth)


//Route to get total Clicks for All URLs:
urlRouter.get("/analytics/total-clicks", userAuth, totalClicksAllUrls);



//Route to get total urls:
urlRouter.get("/analytics/totalUrls", userAuth, totalUrls);
module.exports = urlRouter;