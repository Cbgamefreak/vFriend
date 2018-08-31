"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
// var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json");
var db = {};

if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;


/*
THIS IS FOR INDEX

"use strict";

var fs = require("fs");
var path = require("path");
var Sequelize = require("sequelize");
var basename = path.basename(module.filename);
// var env = process.env.NODE_ENV || "development";
var config = require(__dirname + "/../config/config.json");
var db = {};
console.log(config);
if (config.use_env_variable) {
  var sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  var sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(function(file) {
    return (file.indexOf(".") !== 0) && (file !== basename) && (file.slice(-3) === ".js");
  })
  .forEach(function(file) {
    var model = sequelize["import"](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(function(modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

---------------------------------------------------
THIS IS FOR CONFIG:
testing
{
    "development": {
      "username": "root",
      "password": "root",
      "database": "blogger",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "test": {
      "username": "root",
      "password": "12345",
      "database": "database_test",
      "host": "127.0.0.1",
      "dialect": "mysql"
    },
    "production": {
      "username": "h0rerm6mlk7mfq1e",
      "password": "gpql11c7v0woog5m",
      "database": "vin6z80dledhd1s2",
      "host": "l9dwvv6j64hlhpul.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
      "use_env_variable":"JawsDB_URL", 
      "dialect": "mysql"
    }
  }

  deployed
{

    "username": "tqvud77m8229y8by",
    "password": "vambuiv0s35fktt6",
    "database": "ydp332tghpvffx6l",
    "host": "etdq12exrvdjisg6.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
    "dialect": "mysql",
    "use_env_variableDONOUSE":"JAWSDB_URL" 
  
}

*/