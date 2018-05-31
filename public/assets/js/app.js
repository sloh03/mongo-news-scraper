// Grab the unsaved articles as a json, display on home page load
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < 20; i++) {
    // Display the apropos information on the page
    $("#articles").append(
      "<p data-id='" + data[i]._id + "'>" +
      "<div class='card'>" +
          "<h5 class='card-header'>" + data[i].title + "</h5>" +
          "<div class='card-body'>" + 
            "<a href='" + data[i].link + "' target='blank'>" + "<p class='card-text'>" + data[i].link + "</p></a> <br>" +
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
        // Show the success modal
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
              '<button type="button" id="view-notes-btn" class="btn btn-primary" data-id="' + data[i]._id + '"' + 'data-toggle="modal" data-target="#exampleModal">' +
                'VIEW NOTES' + 
              '</button>'+
              "<a href='#' id='unsave-btn' data-id='" + data[i]._id + "'class='btn btn-danger'>DELETE FROM SAVED</a>" +
          "</div>" +
      "</div>"
    )
  }
});

// Whenever someone clicks unsave article
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

// Whenever someone clicks view notes 
$(document).on("click", "#view-notes-btn", function() {

  // Empty the article title and note body
  $("#modal-title").empty();
  $("#note-modal").empty();

  // Save the article id from the button
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      // console.log(data);

      // The title of the article
      $("#modal-title").append("<h5>" + data.title + "</h5>");

      // Display previous notes, if any
      if (data.note) {
      // if (data.notes) {

        // Add title of section: Note
        $("#note-modal").append("Note");

        // Display all notes
        // for (i=0; i<data.notes.length; i++) {
          $("#note-modal").append(
            '<div class="card">' +
              '<div class="card-body">' + 
                data.note.body + 
                // data.notes.body + 
                '<div class="float-right">' +
                  "<button type='button' class='btn btn-primary btn-sm' data-id='" + data._id + "' id='edit-note-btn'>Edit</button>" +
                  "<button type='button' class='btn btn-danger btn-sm' data-id='" + data._id + "' id='delete-note-btn'>X</button>" +
                '</div>' +
              '</div>' +
            '</div>'
          );
        // }
      }
      else {
        // Display no notes message
        $("#note-modal").append("No notes for this article yet.<br><br>");

        // Display textarea to add a new note body
        $("#note-modal").append("Add Note");
        $("#note-modal").append("<textarea id='bodyinput' name='body' class='form-control'></textarea>");

        // Display button to submit a new note, with the id of the article saved to it
        $("#note-modal").append("<button type='button' class='btn btn-primary btn-sm' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      }

    });
});

// Edit note button
$(document).on("click", "#edit-note-btn", function() {
  // Grab the id associated with the article from the edit button
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      // console.log(data);

      // A textarea to add a new note body
      $("#note-modal").append("Edit Note");
      $("#note-modal").append("<textarea id='bodyinput' name='body' class='form-control'></textarea>");

      // A button to submit a new note, with the id of the article saved to it
      $("#note-modal").append("<button type='button' class='btn btn-primary btn-sm' data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the body of the note in the body textarea
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

      // Log the response
      // console.log(data);

      // Empty the notes section
      // $("#notes").empty();

      // Empty the note body
      $("#note-modal").empty();

      // Grab the id associated with the article from the submit button
      // var thisId = $(this).attr("data-id");
      var thisId = data._id;

      // Now make an ajax call for the Article
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })
        // With that done, add the note information to the page
        .then(function(data) {

          // Add title of section: Note
          $("#note-modal").append("Note");

          // Display note in notes section
          $("#note-modal").append(
            '<div class="card">' +
              '<div class="card-body">' + 
                data.note.body + 
                '<div class="float-right">' +
                  "<button type='button' class='btn btn-primary btn-sm' data-id='" + data._id + "' id='edit-note-btn'>Edit</button>" +
                  "<button type='button' class='btn btn-danger btn-sm' data-id='" + data._id + "' id='delete-note-btn'>X</button>" +
                '</div>' +
              '</div>' +
            '</div>'
          );

        });

          // Also, remove the values entered in the textarea for note entry
          $("#bodyinput").val("");
    });

})

// Delete note button
$(document).on("click", "#delete-note-btn", function() {

  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Make an ajax call for the Article
  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {

      if (!data.note) {
        // Display no notes message
        $("#note-modal").append("No notes for this article yet.<br><br>");

        // Display textarea to add a new note body
        $("#note-modal").append("Add Note");
        $("#note-modal").append("<textarea id='bodyinput' name='body' class='form-control'></textarea>");

        // Display button to submit a new note, with the id of the article saved to it
        $("#note-modal").append("<button type='button' class='btn btn-primary btn-sm' data-id='" + data._id + "' id='savenote'>Save Note</button>");
      }
      
      // location.reload();
    })
})



  