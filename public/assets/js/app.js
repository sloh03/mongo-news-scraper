// Display articles on 'Home' page load
$.getJSON("/articles", function(data) {
    let page = 1;
    // Display 20 scraped articles in cards
    for (var i = 20*(page-1); i < 20*page; i++) {
    $("#articles").append(
      "<p data-id='" + data[i]._id + "'>" +
      "<div class='card'>" +
          "<h5 class='card-header'>" + data[i].title + "</h5>" +
          "<div class='card-body'>" + 
            "<a href='" + data[i].link + "' target='blank'>" + "<p class='card-text'>" + data[i].link + "</p></a> <br>" +
              "<a href='#' id='save-btn' data-id='" + data[i]._id + "'class='btn btn-danger'>SAVE ARTICLE</a>" +
          "</div>" +
      "</div>"
    )
  }
});

// Scrape button
$(document).on("click", "#scrape", function() {

  // Make an ajax call to Scrape
  $.ajax({
    method: "GET",
    url: "/scrape",
    success: function () {

      // Show the success modal
      $('#results-modal').modal('show'); // *** Modal not showing ***
    }
  })
    // Then, display articles on page
    .then(function(data) {

      $(document).on("click", ".exit", function() {
        window.location.reload()
      })
    });
})

// Save article button
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

// Display saved articles on 'Saved' page load
$.getJSON("/saved", function(data) {

  // Display all saved articles in cards
  for (var i = 0; i < data.length; i++) {
    $("#saved-articles").append(
      "<p data-id='" + data[i]._id + "'>" +
      "<div class='card'>" +
          "<h5 class='card-header'>" + data[i].title + "</h5>" +
          "<div class='card-body'>" + 
              "<a href='" + data[i].link + "'>" + "<p class='card-text'>" + data[i].link + "</p></a> <br>" +
              '<button type="button" id="view-notes-btn" class="btn btn-danger" data-id="' + data[i]._id + '"' + 'data-toggle="modal" data-target="#exampleModal">' +
                'VIEW NOTES' + 
              '</button>'+
              "<a href='#' id='unsave-btn' data-id='" + data[i]._id + "'class='btn btn-dark'>DELETE FROM SAVED</a>" +
          "</div>" +
      "</div>"
    )
  }
});

// Unsave article button
$(document).on("click", "#unsave-btn", function() {
  event.preventDefault();

  // Grab the article's id
  var thisId = $(this).attr("data-id");

  // Make an ajax call to unsave the article
  $.ajax({
    method: "PUT",
    url: "/unsaved/" + thisId
  })
    .then(function() {
      console.log("Article has been unsaved");
      location.reload();
    })
})

var articleId;

// View notes button
$(document).on("click", "#view-notes-btn", function() {
  // Save the article id from the button
  var articleId = $(this).attr("data-id");
  modalContent(articleId);
});

function modalContent(articleId) {

  // Empty the modal -- article title and note body
  $("#modal-title").empty();
  $("#note-modal").empty();

  // // Save the article id from the button
  // var thisId = $(this).attr("data-id");

  // Ajax call for the article
  $.ajax({
    method: "GET",
    url: "/articles/" + articleId
  })
  // Then, add the note information to the page
  .then(function(data) {

    // The title of the article
    $("#modal-title").append("<h5>" + data.title + "</h5>");

    // Display note, if any
    if (data.note) {

      // Add title of section: Note
      $("#note-modal").append("Note");

      // Display note body
        $("#note-modal").append(
          '<div class="card">' +
            '<div class="card-body">' + 
              data.note.body + 
              '<div class="float-right">' +
                "<button type='button' class='btn btn-danger btn-sm' data-id='" + data._id + "' id='edit-note-btn'>Edit</button>" +
                "<button type='button' class='btn btn-dark btn-sm' data-id-note='" + data.note._id + "' id='delete-note-btn'>X</button>" +
              '</div>' +
            '</div>' +
          '</div>'
        );
    }
    else {

      // Display no notes message
      $("#note-modal").append("No notes for this article yet.<br><br>");

      // Display textarea to add a new note body
      $("#note-modal").append("Add Note");
      $("#note-modal").append("<textarea id='bodyinput' name='body' class='form-control'></textarea>");

      // Display button to submit a new note, with the id of the article saved to it
      $("#note-modal").append("<button type='button' class='btn btn-danger btn-sm' data-id='" + data._id + "' id='savenote'>Save Note</button>");
    }
  });
}

// Edit note button
$(document).on("click", "#edit-note-btn", function() {

  // Grab the article id from the edit button
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // Add the note information to the modal
    .then(function(data) {

      // Add title and textarea to add a new note body
      $("#note-modal").append("Edit Note");
      $("#note-modal").append("<textarea id='bodyinput' name='body' class='form-control'></textarea>");

      // A button to submit a new note, with the id of the article saved to it
      $("#note-modal").append("<button type='button' class='btn btn-danger btn-sm' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // Place the body of the note in the body textarea
      if (data.note) {
        $("#bodyinput").val(data.note.body);
      }
    })

})

// Savenote button
$(document).on("click", "#savenote", function() {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {

      // Empty the note body
      $("#note-modal").empty();

      // Grab the id associated with the article from the submit button
      var thisId = data._id;

      // Make an ajax call for the article
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        // Then, add the note information to the modal
        .then(function(data) {

          // Add title of section: Note
          $("#note-modal").append("Note");

          // Display note body
          $("#note-modal").append(
            '<div class="card">' +
              '<div class="card-body">' + 
                data.note.body + 
                '<div class="float-right">' +
                  "<button type='button' class='btn btn-danger btn-sm' data-id='" + data._id + "' id='edit-note-btn'>Edit</button>" +
                  "<button type='button' class='btn btn-dark btn-sm' data-id-note='" + data.note._id + "' data-id='" + data._id + "' id='delete-note-btn'>X</button>" +
                '</div>' +
              '</div>' +
            '</div>'
          );
        });
        
        // Remove the values entered in the textarea for note entry
        $("#bodyinput").val("");
    });

})

// Delete note button
$(document).on("click", "#delete-note-btn", function() {

  // Grab the id associated with the note from the X button
  var thisId = $(this).attr("data-id-note");

  // Make an ajax call for the note
  $.ajax({
    method: "DELETE",
    url: "/note/" + thisId
  })

  // Save the article id from the button
  var articleId = $(this).attr("data-id");

  // Empty the modal
  modalContent(articleId);
})



  