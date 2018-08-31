var currentUserID = localStorage.getItem("user");
var usersContainer = $(".users-container");
localStorage.removeItem("searched-user")
var friendsApiArr = [];
var friendsDataArr = [];
usersContainer.hide();
var userFriends = $(".user-friends");
var newPostDiv = $("#newPost")
var postsContainer = $("#timeline")
var currentUsername;
if (!currentUserID) {
    //window.location.href = "/"
}
console.log(currentUserID)
$(document).ready(function () {
    $.get("/api/authors/" + currentUserID, function (data) {
        // attach stuff here to the divs
        // like $(".current-log").html(userName);
        console.log(data.Posts.length);
        $(".info-name").html(data.realName.toUpperCase());
        $(".info-birthday").html(data.birthday);
        $(".info-gender").html(data.sex.toUpperCase());
        $(".info-username").html(data.name.toUpperCase());
        currentUsername = data.name;
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
        $(".mini-profile-image").attr("src", data.profileImage);
        getFriends()
        getPosts(currentUserID);
    });

    function getFriends() {
        friendsApiArr = [];
        friendsDataArr = [];
        $.get("/api/friends/", function (data) {
            console.log(data);
            for (var i = 0; i < data.length; i++) {
                if (data[i].currentUser == currentUserID && friendsApiArr.includes(parseInt(data[i].followedUser)) == false) {
                    console.log(data[i].followedUser)
                    friendsApiArr.push(parseInt(data[i].followedUser))
                }
            }
            console.log(friendsApiArr);
            $("#num-of-friends").html(friendsApiArr.length);

            getAllAuthors()
        });
    }
    function getAllAuthors() {
        $.get("/api/authors/", function (data) {
            console.log(data + "author data");
            for (var i = 0; i < data.length; i++) {
                console.log(data[i].id)
                console.log(friendsApiArr)
                if (friendsApiArr.includes(parseInt(data[i].id))) {
                    friendsDataArr.push(data[i])
                }



            }
            console.log(friendsDataArr)
            displayFriends()
        });



    }
    function displayFriends() {
        usersContainer.empty();
        for (var i = 0; i < friendsDataArr.length; i++) {

            usersContainer.show();
            console.log(friendsDataArr[i]);
            var friendDiv = $("<li>");
            friendDiv.css("background", "#e6f3f7");
            friendDiv.addClass("list-group-item");
            console.log("1")
            var friendN = friendsDataArr[i].name;
            var friendNCap = friendN.toUpperCase();
            var userName = "<b>" + "&nbsp" + friendNCap + "</b>";
            var userImg = $("<img>");
            userImg.css("height", "40px");
            userImg.css("width", "40px");
            userImg.css("border-radius", "15px");
            userImg.attr("src", friendsDataArr[i].profileImage);
            userImg.attr("profileID", friendsDataArr[i].id)
            var btnUnfollow = $("<button>");
            btnUnfollow.addClass("unfollow-button btn-primary btn-xs");
            btnUnfollow.css("cursor", "pointer");
            btnUnfollow.text("Unfollow");
            btnUnfollow.css("width", "100%");
            btnUnfollow.css("border-radius", "15px");
            btnUnfollow.attr("profileID", friendsDataArr[i].id)
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
            friendDiv.append(btnUnfollow);
            friendDiv.append(btnProfile);
            userFriends.append(friendDiv);
            userFriends.append("<br>")
            // console.log("3")

        }

    }

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
        newPostDiv.val("")
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
        editBtn.addClass("edit-post btn btn-secondary");
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
        if (post.postedBy == currentUsername) { newPostCardHeading.append(editBtn); };
        newPostCardHeading.append(deleteBtn);
        newPostCard.append(newPostCardHeading);
        var brkline = $("<br>");
        newPostCard.append(brkline);

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

    $(document).on("click", ".unfollow-button", function () {
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
                location.reload()
            });

    });

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
        $("#searchBarInput").val("");
    });
});