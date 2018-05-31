// Grab the unsaved articles as a json, display on page load
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < 20; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<p data-id='" + data[i]._id + "'>" +
      "<div class='card'>" +
          "<h5 class='card-header'>" + data[i].title + "</h5>" +
          "<div class='card-body'>" + 
            "<a href='" + data[i].link + "'>" + "<p class='card-text'>" + data[i].link + "</p></a> <br>" +
              "<a href='#' id='save-btn' data-id='" + data[i]._id + "'class='btn btn-primary'>SAVE ARTICLE</a>" +
          "</div>" +
      "</div>"
    )
  }
});

// Whenever someone clicks 'Scrape' button
$(document).on("click", "#scrape", function() {
  // Make an ajax call to Scrape
  $.ajax({
    method: "GET",
    url: "/scrape",
    success: function () {
        // Show the success modal,
        $('#results-modal').modal('show'); // *** Modal not showing ***
      }
  })
    // Then display articles on page
    .then(function(data) {
      console.log(res);
      window.location.reload()
    });
})

// Whenever someone clicks save article
$(document).on("click", "#save-btn", function() {
  event.preventDefault();
  // Grab the article's id
  var thisId = $(this).attr("data-id");
  // Make an ajax call to save the Article
  $.ajax({
    method: "PUT",
    url: "/saved/" + thisId
  })
    .then(function() {
      console.log("Article has been saved");
      location.reload();
    })
})

// Grab the saved articles as a json, display on page load
$.getJSON("/saved", function(data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#saved-articles").append(
      "<p data-id='" + data[i]._id + "'>" +
      "<div class='card'>" +
          "<h5 class='card-header'>" + data[i].title + "</h5>" +
          "<div class='card-body'>" + 
              "<a href='" + data[i].link + "'>" + "<p class='card-text'>" + data[i].link + "</p></a> <br>" +
              "<a href='#' id='view-notes-btn' data-id='" + data[i]._id + "'class='btn btn-primary'>ARTICLE NOTES</a>" +
              "<a href='#' id='unsave-btn' data-id='" + data[i]._id + "'class='btn btn-danger'>DELETE FROM SAVED</a>" +
          "</div>" +
      "</div>"
    )
  }
});

// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});


  