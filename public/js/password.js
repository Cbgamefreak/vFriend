var passName;
var passEmail;

var currentUserID = localStorage.getItem("user");

console.log(currentUserID);

$("#get-pass").on("click", function (event) {

    event.preventDefault();
    passName = $("#pass-name").val().trim();
    passEmail = $("#pass-email").val().trim();

    //    console.log(passEmail + " " + passName)

    $.get("/api/authors/password/" + passName + "/" + passEmail, function (data) {
       
        if (!data) {
            $("#password-text").html("Wrong Information Provided! Try Again!");
            $("#pass-modal").modal("toggle");
        } else {
            $("#password-text").html("Your Password is: " + data.password);
            $("#pass-modal").modal("toggle");
        }

        // console.log(data);

    });
});