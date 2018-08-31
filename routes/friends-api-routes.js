var db = require("../models");

// Routes
// =============================================================
module.exports = function (app) {

  // GET route for getting all of the friends
  app.get("/api/friends", function (req, res) {
    db.Friends.findAll().then(function(dbFriends) {
        res.json(dbFriends);
      });
    });

  // Get route for retrieving all friends for a single user
  app.get("/api/friends/:currentUser", function (req, res) {
    db.Friends.findOne({
      where: {
        currentUser: req.params.currentUser
      },
    }).then(function (dbFriends) {
      res.json(dbFriends);
    });
  });

  // Friends route for saving a new Friends
  app.post("/api/friends", function (req, res) {
    db.Friends.create(req.body).then(function (dbFriends) {
      res.json(dbFriends);
    });
  });

  // DELETE route for deleting friends
  app.delete("/api/friends/:currentUser/:followedUser", function (req, res) {
    console.log("---------------------------------------")
    db.Friends.destroy({
      where: {
        currentUser: req.params.currentUser,
        followedUser:req.params.followedUser
      }
    }).then(function (dbFriends) {
      res.json(dbFriends);
    });
  });

  // PUT route for updating friends but this isnt used
  app.put("/api/friends", function (req, res) {
    db.Friends.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function (dbFriends) {
        res.json(dbFriends);
      });
  });
};
