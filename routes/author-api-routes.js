var db = require("../models");

module.exports = function(app) {
  // Find all Authors and return them to the user with res.json
  app.get("/api/authors", function(req, res) {
    db.Author.findAll({ include: [db.Post]}).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  app.get("/api/authors/friends", function(req, res) {
    db.Author.findAll({ include: [db.Post]}).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });


  app.get("/api/authors/checkID/:name", function(req, res) {
    db.Author.findOne({
      where: {
        name: req.params.name,
       
      },
  
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });



  app.get("/api/authors/:id", function(req, res) {
    // Find one Author with the id in req.params.id and return them to the user with res.json
    db.Author.findOne({
      where: {
        id: req.params.id,
       
      },
      include: [db.Post]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

  app.get("/api/authors/:name/:password", function(req, res) {
    // Find one Author with the id in req.params.id and return them to the user with res.json

    db.Author.findOne({
      where: {
        name: req.params.name,
        password: req.params.password
      },
      include: [db.Post]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    })
  });

  app.get("/api/authors/password/:realName/:email", function(req, res) {
   
    console.log(res);
    db.Author.findOne({
      where: {
        realName: req.params.realName,
        email: req.params.email
      },
      include: [db.Post]
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    }).catch(function(err){
      if (err) throw err
    });
  });



  app.post("/api/authors", function(req, res) {
    // Create an Author with the data available to us in req.body
    console.log(req.body);
    db.Author.create(req.body).then(function(dbAuthor) {
      res.json(dbAuthor);
    }).catch(function(err){
      console.log(err)
       res.json(err)
    });
  });

  app.delete("/api/authors/:id", function(req, res) {
    // Delete the Author with the id available to us in req.params.id
    db.Author.destroy({
      where: {
        id: req.params.id
      }
    }).then(function(dbAuthor) {
      res.json(dbAuthor);
    });
  });

};
