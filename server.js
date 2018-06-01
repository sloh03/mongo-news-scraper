// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var request = require("request");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

// Initialize Express
var app = express();
var PORT = 3000;

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/h");

// Routes

// A GET route for scraping the NPR website
app.get("/scrape", function(req, res) {

    // Grab the body of the html with request
    axios.get("https://www.npr.org/sections/news/").then(function(response) {

        // Load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);
    
        // Grab every h2 within an article tag, and do the following:
        $("article h2").each(function(i, element) {

            // Save an empty result object
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");
    
            // Create a new Article using the `result` object built from scraping
            db.Article.create(result)
            .then(function(dbArticle) {

                // View the added result in the console
                console.log(dbArticle);
            })
            .catch(function(err) {
                return res.json(err);
            });
        });
        // If we were able to successfully scrape and save an Article, send a message to the client
        res.send("Scrape Complete");
    });
});
  
// Route to get all unsaved articles from db
app.get("/articles", function(req, res) {
db.Article.find({ saved_status: false })
    .then(function(dbArticle) {

        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route to update article status to saved
app.put("/saved/:id", function(req, res) {
db.Article.update({ _id: req.params.id }, { saved_status: true })
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// Route to get all saved articles from db
app.get("/saved", function(req, res) {
db.Article.find({ saved_status: true })
    .then(function(dbArticle) {

        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route to update article status back to unsaved
app.put("/unsaved/:id", function(req, res) {
db.Article.update({ _id: req.params.id }, { saved_status: false })
    .then(function(result) {
        res.json(result);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// Route for grabbing a saved article by id, populate it with it's note
app.get("/articles/:id", function(req, res) {

// Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
db.Article.findOne({ _id: req.params.id })

    // ..and populate all of the notes associated with it
    .populate("note")
    .then(function(dbArticle) {

        // If we were able to successfully find an Article with the given id, send it back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route for saving/updating a saved article's associated note
app.post("/articles/:id", function(req, res) {

// Create a new note and pass the req.body to the entry
db.Note.create(req.body)
    .then(function(dbNote) {

        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`
        // Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate(
            { _id: req.params.id }, 
            { note: dbNote._id }, 
            { new: true });
    })
    .then(function(dbArticle) {

        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
    })
    .catch(function(err) {
        res.json(err);
    });
});

// Route for deleting a saved article's associated note
app.delete("/note/:id", function(req, res) {
db.Note.findOneAndRemove( {_id: req.params.id} )
    .then(function(dbNote) {
        res.json(dbNote);
    })
    .catch(function(error) {
        res.json(error);
    });
});

// Start the server
app.listen(PORT, function() {
console.log("App running on port " + PORT + "!");
});

