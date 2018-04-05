var MongoClient = require('mongodb').MongoClient
var url = "mongodb://SaltyFish:sf12345678@ds119078.mlab.com:19078/saltyfish"

function login(input_nameID, check) {
  if (input_nameID == "") {
    var result = {
      id: null,
      name: null,
      status: 2
    }
    check(result);
    return 2;
  }

  MongoClient.connect(url, function(err, res) {
    if (err) console.log(err)
    console.log("Database connected");
    client = res;
    db = client.db("saltyfish");

    //find if a value exists

    var promise_user = Promise.resolve(db.collection("assignment").find({
      _id: input_nameID
    }).toArray());
    promise_user.then((user) => {
      if (user.length != 0) {
        console.log("user: " + user + " exits.");
        var result = {
          id: input_nameID,
          name: user[0].user,
          status: 0
        }
        client.close();
        check(result);
        return 0;
      } else {
        console.log(user);
        console.log("Does NOT exits");
        client.close();
        var result = {
          id: null,
          name: null,
          status: 1
        }
        check(result);
        return 1;
      }
    }).catch(function () {
       console.log("Promise Rejected");
     });
  });
}


function createUser(newUserID, newName, check) {
  if (newUserID == "" || newName == "") {
    var result = {
      id: null,
      name: null,
      status: 2
    }
    check(result);
    check(2);
    return 2;
  }
  MongoClient.connect(url, function(err, res) {
    if (err) console.log(err)
    console.log("Database connected");
    client = res;
    db = client.db("saltyfish");


    //find if a value exists
    var promise_cnt = Promise.resolve(db.collection("assignment").find({
      _id: newUserID
    }).count());

    promise_cnt.then((cnt) => {
      if (cnt > 0) {
        console.log(cnt);
        console.log("use ID " + newUserID +
          " already exists, please use a new one");
        client.close();
        var result = {
          id: null,
          name: null,
          status: 1
        }
        check(result);
        return 1
      } else {
        var newUser = {
          _id: newUserID,
          user: newName,
          favorite: []
        }
        db.collection("assignment").insert(newUser, function(err, res) {
          if (err) throw err;
          console.log("create new user " + newUser + " success");
          console.log(res)

          client.close();
          var result = {
            id: newUserID,
            name: newName,
            status: 0
          }
          check(result);
          return 0;
        });
      }
    }).catch(function () {
       console.log("Promise Rejected");
     });
  });
}


function addTeam(userID, team, check) {
  MongoClient.connect(url, function(err, res) {
    if (err) console.log(err)
    console.log("Database connected");
    client = res;
    db = client.db("saltyfish");


    //find if a value exists
    var promise_cnt = Promise.resolve(db.collection("assignment").find({
      _id: userID
    }).count());

    promise_cnt.then((cnt) => {
      console.log(cnt);
      if (cnt != 1) {
        console.log(cnt);
        console.log("use ID " + userID + " does NOT exists.");
        client.close();
        return 1;
      } else {
        console.log("adding...");
        var myQuery = {
          _id: userID
        };
        var newValues = {
          $addToSet: {
            favorite: team
          }
        };
        db.collection("assignment").updateOne(myQuery, newValues, (err, res) => {
          if (err) throw err;
          console.log("add new team success");
          client.close();

          check("0")
          return 0;
        });
      }
    }).catch(function () {
       console.log("Promise Rejected");
     });
  });
}


function deleteTeam(userID, team) {
  MongoClient.connect(url, function(err, res) {
    if (err) console.log(err)
    console.log("Database connected");
    client = res;
    db = client.db("saltyfish");

    //find if a value exists
    var promise_cnt = Promise.resolve(db.collection("assignment").find({
      _id: userID
    }).count());

    promise_cnt.then((cnt) => {
      console.log(cnt);
      if (cnt != 1) {
        console.log(cnt);
        console.log("use ID " + userID + " does NOT exists.");
        client.close();
        return 1;
      } else {
        console.log("delete...");
        var myQuery = {
          _id: userID
        };
        var newValues = {
          $pull: {
            favorite: team
          }
        };
        db.collection("assignment").updateOne(myQuery, newValues, (err, res) => {
          if (err) throw err;
          console.log("delete a team success");
          client.close();
          return 0;
        });
      }
    }).catch(function () {
       console.log("Promise Rejected");
     });
  });
}


function updateUser(userID, newName, check) {
  MongoClient.connect(url, function(err, res) {
    if (err) console.log(err)
    console.log("Database connected");
    client = res;
    db = client.db("saltyfish");


    //find if a value exists
    var promise_cnt = Promise.resolve(db.collection("assignment").find({
      _id: userID
    }).count());

    promise_cnt.then((cnt) => {
      console.log(cnt);
      if (cnt != 1) {
        console.log(cnt);
        console.log("userID: " + userID + " does NOT exists.");
        client.close();
        var result = {
          id: null,
          newName: null,
          status: 1
        }
        check(result);
        return 1;
      } else {
        console.log("updating...");
        var myQuery = {
          _id: userID
        };
        var newValues = {
          $set: {
            user: newName
          }
        };
        db.collection("assignment").updateOne(myQuery, newValues, (err, res) => {
          if (err) throw err;
          console.log("update user name success");
          client.close();
          var result = {
            id: userID,
            newName: newName,
            status: 0
          }
          check(result);
          return 0;
        });
      }
    }).catch(function () {
       console.log("Promise Rejected");
     });
  });
}


function showInfo(userID, callback) {
  console.log(userID)
  MongoClient.connect(url, function(err, res) {
    if (err) console.log(err)
    console.log("Database connected");
    client = res;
    db = client.db("saltyfish");


    //find if a value exists
    var promise_user = Promise.resolve(db.collection("assignment").find({
      _id: userID
    }).toArray());

    promise_user.then((user) => {
      if (user.length == 0) {
        console.log("user"+user);
        console.log("userID: " + userID + " does NOT exists.");
        client.close();
        return false;
      } else {
        console.log("showing...");
        var result = {
          id: userID,
          name: user[0].user,
          favorite: user[0].favorite
        }
        console.log(result);
        client.close();
        callback(result);
        return 0;
      }
    }).catch(function () {
       console.log("Promise Rejected");
     });
  });
}

// Note that the following tests can only run
// one by one due to synchronization issue.

// test passed:
//login("one");
//createUser(0, "one");
//addTeam("one", "LVP")
//deleteTeam("one", "LVP")
//updateUser(0, "Zelda")
//addTeam(0, "LVP")
// updateUser('53', 'tianshu-大佬-zhu', function(res) {
//   console.log(res);
//   console.log("update user test passed.");
// })


exports.login = login;
exports.createUser = createUser;
exports.addTeam = addTeam;
exports.deleteTeam = deleteTeam;
exports.updateUser = updateUser;
exports.showInfo = showInfo;
