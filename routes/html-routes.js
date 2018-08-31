// *********************************************************************************
// html-routes.js - this file offers a set of routes for sending users to the various html pages
// *********************************************************************************

// Dependencies
// =============================================================
var path = require("path");

// Routes
// =============================================================
module.exports = function(app) {

  // Each of the below routes just handles the HTML page that the user gets sent to.

  // routes below are pretty self explanitory
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"));
  });

  app.get("/profile", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/user.html"));
  });

  app.get("/newsfeed", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/newsfeed.html"));
  });
  
  
  app.get("/survey", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/register.html"));
  });

  app.get("/password", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/password.html"));
  });

  app.get("/all-users", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/all-users.html"));
  });
  
  app.get("/other-user/:id", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/other-user.html"));
  });


  app.get("/login", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/pages/login.html"));
  });


};
