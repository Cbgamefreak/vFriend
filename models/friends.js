module.exports = function (sequelize, DataTypes) {
    var Friends = sequelize.define("Friends", {
        currentUser: DataTypes.STRING,
        followedUser: DataTypes.STRING
    });
    return Friends;
};