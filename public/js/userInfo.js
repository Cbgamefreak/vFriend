
var currentUserID = localStorage.getItem("user");
if (!currentUserID){
    //window.location.href = "/"
   } 
   console.log(currentUserID)
   $(document).ready(function () {
   
      
   
       $.get("/api/authors/" + currentUserID, function (data) {
           // attach stuff here to the divs
           // like $(".current-log").html(userName);
           console.log(data.Posts.length);
           $(".info-name").html(data.realName);
           $(".info-birthday").html(data.birthday);
           $(".info-gender").html(data.sex);
           $(".info-username").html(data.name);
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
           
   
         });
   
   });
   
   
   
