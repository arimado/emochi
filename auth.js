var bcrypt = require('bcryptjs');
var db = require('./db');

exports.localReg = function (username, password, callback) {
    var hash = bcrypt.hashSync(password, 8);
    var user = {
        username: username,
        password: hash
    }
    // check if username is already in the database
    var users = db.get().collection('users');
    users.findOne({username: username},
        function(err, doc) {
        if (doc) {
            console.log('username already exists');
            callback(err, false);
            return;
        } else {
            console.log('this username is allowed');
            users.insert(user,
                function (err, res) {
                    if (err) throw new Error;
                    callback(err, res);
                    return;
                }
            );
        };
    });
};

exports.localAuth = function (username, password, callback) {
    var users = db.get().collection('users');
    users.findOne({username: username}, function (err, result) {
        if (result) {
            console.log('username match');
            console.log(result);
            var hash = result.password;
            console.log(hash);
            var isMatch = bcrypt.compareSync(password, hash);
            console.log(isMatch);
            if (isMatch) {
                callback(err, result);
            } else {
                callback(err, false);
            }
        } else {
            callback(err, err);
        }
    });
}
