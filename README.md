# mongo-news-scraper

# [LIVE DEMO](https://mighty-gorge-87663.herokuapp.com/)

This is a web application that allows users to view and leave comments on the latest news scraped from another site using Mongoose and Cheerio.

## Function
20 articles are scraped when the "Scrape New Articles" button is clicked. Each article can be saved by clicking on the "Save Article" button and the collection can be viewed by navigating to the "Saved Articles" page. Once and article is saved, the user can click on the "View Notes" button to view, add, edit, or delete comments. To remove an article from the "Saved Articles" page, the user can click the "Delete From Saved" button.

## Design
The application is mobile responsive and simple to use. News articles are scraped from the NPR website. The final app is deployed to Heroku with mLab provision.

## Materials Sources
* [Express npm package](https://www.npmjs.com/package/express)
* [Mongoose](https://www.npmjs.com/package/mongoose)
* [Body-parser npm package](https://www.npmjs.com/package/body-parser)
* [Cheerio](https://www.npmjs.com/package/cheerio)
* [Request](https://www.npmjs.com/package/request)
* [Heroku](https://heroku.com)
