var otherUser = localStorage.getItem("other-user");
console.log(otherUser);
localStorage.removeItem("other-user")
var currentUserName = localStorage.getItem("username");
//localStorage.removeItem("user")
var currentUserID = localStorage.getItem("user");
var otherUserName;
var userFriends = $(".user-friends");
var friendsApiArr = [];
var friendsDataArr = [];
var myFriendsApiArr = [];
var userURL = window.location.href;
if (!otherUser) {
  otherUser = userURL.slice(-1);
}

var postsContainer = $("#timeline2");
var newPostDiv = $("#newPost");
var usersContainer = $(".users-container");

console.log(userURL)
$(document).ready(function () {

  if (!currentUserID) {
    getFriends()

  }
  if (currentUserID) {
    getProfileInfo()
  }
  console.log(currentUserID)
  function getProfileInfo() {
    $.get("/api/authors/" + currentUserID, function (data) {

      $(".mini-profile-image").attr("src", data.profileImage);
      var userN = data.name;
      var userName = userN.toUpperCase();
      userName = "Hello " + userName + " !";
      $(".current-log").text(userName);
      getFriends()
    });
  }
  function getFriends() {
    myFriendsApiArr = [];

    $.get("/api/friends/", function (data) {
      console.log(data);
      for (var i = 0; i < data.length; i++) {
        if (data[i].currentUser == currentUserID && myFriendsApiArr.includes(parseInt(data[i].followedUser)) == false) {
          console.log(data[i].followedUser)
          myFriendsApiArr.push(parseInt(data[i].followedUser))
        }
      }
      console.log(myFriendsApiArr)
      getAuthors()
    });
  }
  function getAuthors() {
    $("#other-user-profile").empty();
    $.get("/api/authors/" + otherUser, function (data) {
      // attach stuff here to the divs
      // like $(".current-log").html(userName);
      console.log(data.Posts.length);
      $(".info-name").html(data.realName.toUpperCase());
      otherUserN = data.name;
      otherUserName = otherUserN.toUpperCase();
      otherUserName = otherUserName + "'s Profile";
      $("#other-user-profile").append(otherUserName);

      $(".info-birthday").html(data.birthday);
      $(".info-gender").html(data.sex.toUpperCase());
      $(".info-username").html(data.name.toUpperCase());
      $(".info-email").html(data.email);
      $(".info-posts").html(data.Posts.length);
      $(".profile-image").attr("src", data.profileImage);
      $(".profile-image").css("width", "100px");
      $(".profile-image").css("height", "100px");
      $(".profile-image").css("border-radius", "20px");
      $(".main-profile-image").attr("src", data.profileImage);
      $(".main-profile-image").css("width", "200px");
      $(".main-profile-image").css("height", "200px");
      $(".main-profile-image").css("border-radius", "20px");
      $(".follow-button").empty()
      var btnFollow = $("<button>");
      btnFollow.addClass("follow-user-button btn-primary btn-md");
      btnFollow.css("cursor", "pointer");
      btnFollow.text("Follow");
      btnFollow.css("width", "100%");
      btnFollow.css("border-radius", "10px");
      btnFollow.attr("profileID", data.id)
      var btnUnfollow = $("<button>");
      btnUnfollow.addClass("unfollow-user-button btn-primary btn-md");
      btnUnfollow.css("cursor", "pointer");
      btnUnfollow.text("Unfollow");
      btnUnfollow.css("width", "100%");
      btnUnfollow.css("border-radius", "10px");
      btnUnfollow.attr("profileID", data.id)
      if (myFriendsApiArr.includes(parseInt(data.id))) {
        $(".follow-button").append(btnUnfollow);
      }
      else {
        $(".follow-button").append(btnFollow);
      }


    }).then(function () {
      getPosts(otherUser)
    })
  }

  $(document).on("click", ".follow-user-button", function () {
    event.preventDefault();
    var followID = $(this).attr("profileID");
    var newFollow = {
      currentUser: currentUserID,
      followedUser: followID,
    };
    // console.log("you clicked it")
    console.log(newFollow)
    followUser(newFollow);
  });


  $(document).on("click", ".unfollow-user-button", function () {
    event.preventDefault();
    console.log("delete-test")
    var deleteID = $(this).attr("profileID");
    console.log(deleteID)
    $.ajax({
      method: "DELETE",
      url: "/api/friends/" + currentUserID + "/" + deleteID
    })
      .then(function () {
        getFriends()
      });

  });

  function followUser(follow) {
    $.post("/api/friends", follow)
      .then(function (res) {
        getFriends()
        console.log("test2")
      });


  }

  $(document).on("click", "#submitPost", function () {
    event.preventDefault();
    var newPostText = {
      postedBy: currentUserName,
      body: newPostDiv.val().trim(),
      AuthorId: otherUser
    };
    console.log("you clicked it")
    console.log(newPostText)
    submitPost(newPostText);
    newPostDiv.val("")
  })

  function submitPost(post) {
    console.log("Test1")
    $.post("/api/posts", post, function () {
      getPosts(otherUser)
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
    newPostCardHeading.append(newPostBody);
    newPostCardHeading.append(newPostAuthor);
    newPostCardHeading.append(newPostDate);
    newPostCardHeading.append("<br>")
    if (post.postedBy == currentUserName && currentUserID) {
      newPostCardHeading.append(editBtn);
      newPostCardHeading.append(deleteBtn);
    }
    newPostCard.append(newPostCardHeading);
    var brkline = $("<br>");
    newPostCard.append(brkline);

    newPostCard.data("post", post);
    return newPostCard;
  }

  function displayEmpty() {
    postsContainer.empty();
    postsContainer.append("<h3>Post on Your Friend's Book!!</h3>")
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
        getPosts(otherUser);
      });

  });


  $(document).on("click", ".edit-post", function () {
    event.preventDefault();
    var editID = $(this).attr("clicker");
    var postToEdit = $("#" + editID);
    postToEdit.empty();
    console.log(editID)
    var editText;
    for (var i = 0; i < posts.length; i++) {
      console.log(posts[i])
      if (posts[i].id == editID) {
        editText = posts[i].body
      }
    }
    console.log(editText)
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
    newPostUpdate.val(editText)
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
      postedBy: currentUserName,
      body: updatedPostText.val().trim(),
      AuthorId: otherUser
    };
    console.log(newPostText)
    updatePost(newPostText)
  });

  $(document).on("click", ".cancel-update", function () {
    console.log("cancel-test")
    getPosts(otherUser)
  });

  function updatePost(post) {
    $.ajax({
      method: "PUT",
      url: "/api/posts",
      data: post
    })
      .then(function () {
        //location.reload();
        getPosts(otherUser);
      });
  }


  $.get("/api/friends/", function (data) {
    console.log(data);
    for (var i = 0; i < data.length; i++) {
      if (data[i].currentUser == otherUser && friendsApiArr.includes(data[i].followedUser) == false) {
        console.log(data[i].followedUser)
        friendsApiArr.push(data[i].followedUser)
      }
    }
    console.log(friendsApiArr)
    getAllAuthors()
  });

  function getAllAuthors() {
    $.get("/api/authors/", function (data) {
      console.log(data + "author data");
      //array.includes didnt work for comparing data types so i used two for loops
      for (var i = 0; i < data.length; i++) {
        console.log(data[i].id)
        console.log(friendsApiArr)
        for (var x = 0; x < friendsApiArr.length; x++) {
          if (friendsApiArr[x] == data[i].id) {
            friendsDataArr.push(data[i])
          }


        }
      }
      console.log(friendsDataArr);
      $("#num-of-friends").html(friendsApiArr.length);
      displayFriends()
    });



  }
  function displayFriends() {

    for (var i = 0; i < friendsDataArr.length; i++) {

      userFriends.show();
      console.log(friendsDataArr[i]);
      var friendDiv = $("<li>");
      friendDiv.css("background", "#e6f3f7");
      friendDiv.addClass("list-group-item");
      console.log("1");
      var friendN = friendsDataArr[i].name;
      var friendNCap = friendN.toUpperCase();
      var userName = "<b>" + "&nbsp" + friendNCap + "</b>";
      var userImg = $("<img>");
      userImg.css("height", "40px");
      userImg.css("width", "40px");
      userImg.css("border-radius", "15px");
      userImg.attr("src", friendsDataArr[i].profileImage);
      userImg.attr("profileID", friendsDataArr[i].id)
      var btnFollow = $("<button>");
      btnFollow.addClass("follow-button btn-primary btn-xs");
      btnFollow.css("cursor", "pointer");
      btnFollow.text("Follow");
      btnFollow.css("width", "100%");
      btnFollow.css("border-radius", "15px");
      btnFollow.attr("profileID", friendsDataArr[i].id)
      var btnProfile = $("<button>");
      // console.log("2.5")
      btnProfile.addClass("profile-button btn-primary btn-xs");
      btnProfile.css("cursor", "pointer");
      btnProfile.text("Profile");
      btnProfile.css("width", "100%");
      btnProfile.css("border-radius", "15px");
      console.log("2")
      btnProfile.attr("profileID", friendsDataArr[i].id)
      friendDiv.append(userImg);
      friendDiv.append(userName + "<br>" + "<br>");
      //friendDiv.append(btnFollow);
      friendDiv.append(btnProfile);
      userFriends.append(friendDiv);
      userFriends.append("<br>")
      // console.log("3")

    }

  }
  $(document).on("click", ".profile-button", function () {
    localStorage.removeItem("other-user")
    event.preventDefault();
    var profileID = $(this).attr("profileID");
    localStorage.setItem("other-user", profileID)
    // console.log("you clicked it!!!")
    window.location = "/other-user/" + profileID;
  });

  $("#searchBarSubmit").on("click", function () {
    event.preventDefault();
    var searchInput = $("#searchBarInput").val().trim();
    localStorage.setItem("searched-user", searchInput)
    window.location = "/all-users";
  });
});