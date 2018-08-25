var currentUserID = localStorage.getItem("user");
var currentUsername;
if (!currentUserID) {
  //window.location.href = "/"
}

$(document).ready(function () {


  // Get the modal
  // Getting references to the name input and author container, as well as the table body
  var nameInput = $("#author-name");
  var authorList = $("tbody");
  var authorContainer = $(".author-container");
  var newPostDiv = $("#newPost")
  var authorId;
  var postsContainer = $("#timeline")
  // Adding event listeners to the form to create a new object, and the button to delete
  // an Author
  $(document).on("submit", "#author-form", handleAuthorFormSubmit);
  $(document).on("click", ".delete-author", handleDeleteButtonPress);

  $(document).on("click", "#submitPost", function () {
    event.preventDefault();
    var newPostText = {
      postedBy: currentUsername,
      body: newPostDiv.val().trim(),
      AuthorId: currentUserID
    };
    console.log("you clicked it")
    console.log(newPostText)
    submitPost(newPostText);
  })

  function submitPost(post) {
    console.log("Test1")
    $.post("/api/posts", post, function () {
      getPosts(currentUserID)
      console.log("test2")
    });
  }

  function getPosts(author) {
    console.log("test3")
    authorId = author || "";
    if (authorId) {
      authorId = "/?author_id=" + authorId;
    }
    $.get("/api/posts" + authorId, function (data) {
      console.log("Posts", data);
      posts = data.reverse();
      if (!posts || !posts.length) {

        displayEmpty();
      }
      else {
        initializeRows();
      }
    });
  }
  getPosts(currentUserID)


  function initializeRows() {
    postsContainer.empty();
    var postsToAdd = [];
    for (var i = 0; i < posts.length; i++) {
      postsToAdd.push(createNewRow(posts[i]));
    }
    postsContainer.append(postsToAdd);
  }


  // This function constructs a post's HTML
  function createNewRow(post) {
    var formattedDate = new Date(post.updatedAt);
    var updateCreate;
    if (post.createdAt == post.updatedAt) { updateCreate = "Created at " } else { updateCreate = "Updated at " }
    formattedDate = moment(formattedDate).format("MMMM Do YYYY, h:mm:ss a");
    var newPostCard = $("<div>");
    newPostCard.addClass("card");
    newPostCard.attr("id", post.id);
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var deleteBtn = $("<button>");
    deleteBtn.attr("clicker", post.id);
    deleteBtn.text("Delete");
    deleteBtn.addClass("delete-post btn btn-danger");
    var editBtn = $("<button>");
    editBtn.text("EDIT");
    editBtn.attr("clicker", post.id);
    editBtn.addClass("edit-post btn btn-info");
    var newPostBody = $("<h4>");
    var newPostAuthor = $("<h5>");
    var newPostDate = $("<small>");
    newPostBody.text(post.body + " ");
    newPostDate.text(updateCreate + formattedDate);
    newPostAuthor.text("Posted By: " + post.postedBy)
    //newPostBody.append(newPostDate);
    newPostCardHeading.append(newPostBody);
    newPostCardHeading.append(newPostAuthor);
    newPostCardHeading.append(newPostDate);
    newPostCardHeading.append("<br>")
    newPostCardHeading.append(editBtn);
    newPostCardHeading.append(deleteBtn);
    newPostCard.append(newPostCardHeading);
    newPostCard.data("post", post);
    return newPostCard;
  }

  function displayEmpty() {
    postsContainer.empty();
    postsContainer.append("<h3>You have no posts yet, make your first post above!</h3>")
  }

  $(document).on("click", ".delete-post", function () {
    event.preventDefault();
    console.log("delete-test")
    var deleteID = $(this).attr("clicker");
    console.log(deleteID)
    $.ajax({
      method: "DELETE",
      url: "/api/posts/" + deleteID
    })
      .then(function () {
        getPosts(currentUserID);
      });

  });


  $(document).on("click", ".edit-post", function () {
    console.log("edit-test")
    event.preventDefault();
    var editID = $(this).attr("clicker");
    var postToEdit = $("#" + editID);
    postToEdit.empty();
    var newPostCardHeading = $("<div>");
    newPostCardHeading.addClass("card-header");
    var updateBtn = $("<button>");
    updateBtn.attr("clicker", editID);
    updateBtn.text("Update");
    updateBtn.addClass("update-post btn btn-info");
    var exitBtn = $("<button>");
    exitBtn.text("Cancel");
    exitBtn.attr("clicker", editID);
    exitBtn.addClass("cancel-update btn btn-danger");
    var newPostUpdate = $("<textarea>");
    newPostUpdate.addClass("update-textarea " + editID)
    newPostUpdate.addClass("update-textarea")
    newPostCardHeading.append(newPostUpdate);
    newPostCardHeading.append(updateBtn);
    newPostCardHeading.append(exitBtn);
    postToEdit.append(newPostCardHeading);

  })

  $(document).on("click", ".update-post", function () {
    console.log("update-test")
    var updatePostID = $(this).attr("clicker");
    var updatedPostText = $("." + updatePostID)
    var newPostText = {
      id: updatePostID,
      postedBy: currentUsername,
      body: updatedPostText.val().trim(),
      AuthorId: currentUserID
    };
    console.log(newPostText)
    updatePost(newPostText)
  });

  $(document).on("click", ".cancel-update", function () {
    console.log("cancel-test")
    getPosts(currentUserID)
  });

  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    })
      .then(function () {
        getPosts(currentUserID);
      });
  }
  // Getting the initial list of Authors
  //getAuthors();
  console.log(currentUserID);
  // A function to handle what happens when the form is submitted to create a new Author
  function handleAuthorFormSubmit(event) {
    event.preventDefault();
    // Don't do anything if the name fields hasn't been filled out
    if (!nameInput.val().trim().trim()) {
      return;
    }
    // Calling the upsertAuthor function and passing in the value of the name input
    upsertAuthor({
      name: nameInput.val().trim()

    });
  }
  $.get("/api/authors/" + currentUserID, function (data) {
    // console.log(data + "dataaaa")
    console.log(data.name)
    var userN = data.name;
    localStorage.setItem("username", data.name);
    currentUsername = localStorage.getItem("username")
    console.log(currentUsername)
    var userName = userN.toUpperCase();
    $(".current-log").html(userName);
    $(".current-log2").html("Hello " + userName + " !");
    var imgDiv = $("#user-image");
    var userImg = $("<img>");
    userImg.css("height", "100px");
    userImg.css("width", "200px");
    userImg.attr("src", data.profileImage);
    imgDiv.append(userImg);
    $(".mini-profile-image").attr("src", data.profileImage);

  });



  // A function for creating an author. Calls getAuthors upon completion
  function upsertAuthor(authorData) {
    $.post("/api/authors", authorData)
      .then(getAuthors);
  }

  // Function for creating a new list row for authors
  function createAuthorRow(authorData) {
    console.log(authorData);
    var newTr = $("<tr>");
    newTr.data("author", authorData);
    newTr.append("<td>" + authorData.name + "</td>");
    newTr.append("<td> " + authorData.Posts.length + "</td>");
    newTr.append("<td><a href='/blog?author_id=" + authorData.id + "'>Go to Posts</a></td>");
    newTr.append("<td><a href='/cms?author_id=" + authorData.id + "'>Create a Post</a></td>");
    newTr.append("<td><a style='cursor:pointer;color:red' class='delete-author'>Delete Author</a></td>");
    return newTr;
  }

  // Function for retrieving authors and getting them ready to be rendered to the page
  function getAuthors() {
    $.get("/api/authors", function (data) {
      var rowsToAdd = [];
      for (var i = 0; i < data.length; i++) {
        rowsToAdd.push(createAuthorRow(data[i]));
      }
      renderAuthorList(rowsToAdd);
      nameInput.val("");
    });
  }

  // A function for rendering the list of authors to the page
  function renderAuthorList(rows) {
    authorList.children().not(":last").remove();
    authorContainer.children(".alert").remove();
    if (rows.length) {
      console.log(rows);
      authorList.prepend(rows);
    }
    else {
      renderEmpty();
    }
  }

  // Function for handling what to render when there are no authors
  function renderEmpty() {
    var alertDiv = $("<div>");
    alertDiv.addClass("alert alert-danger");
    alertDiv.text("You must create an Author before you can create a Post.");
    authorContainer.append(alertDiv);
  }

  // Function for handling what happens when the delete button is pressed
  function handleDeleteButtonPress() {
    var listItemData = $(this).parent("td").parent("tr").data("author");
    var id = listItemData.id;
    $.ajax({
      method: "DELETE",
      url: "/api/authors/" + id
    })
      .then(getAuthors);
  }
});
