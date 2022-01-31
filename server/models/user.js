// const mysql2 = require('mysql2');
// const conn = mysql2.createConnection({
//     user: 'root',
//     host: "localhost",
//     database: "task_movie_signup_db",
//     password: "Mysql.pw.5.@"
// });
const { conn } = require("../db_config/dbConfig.js");
class User {
  constructor() {
    this.userId = null;
    this.userName = null;
    this.userEmailId = null;
    this.userPassword = null;
    this.userPhoneNumber = null;
  }
  getValues() {
    return [
      this.userId,
      this.userName,
      this.userEmailId,
      this.userPassword,
      this.userPhoneNumber,
    ];
  }

  setId(id) {
    this.userId = id;
  }
  setValues(name, emailId, password, phoneNumber) {
    this.userName = name;
    this.userEmailId = emailId;
    this.userPassword = password;
    this.userPhoneNumber = phoneNumber;
  }

  static deleteAllUsers(returnStatus){
    conn.query("delete from user;", (err, res) => {
      if(err){
        console.log("Could not delete the users: error ", err);
        returnStatus("Could not delete the users");
      }else{
        console.log("Successfully deleted all users in user: ", res);
        conn.query("delete  from logged_in_user;", (err, res) => {
          if(err){
            console.log("Could not delete logged_in_user", err);
            returnStatus("Could not delete logged_in_user");
          }else{
            console.log("Successfully deleted all users in logged_in_user", res);
            returnStatus("Successfully deleted all users in logged_in_user");
          }
        })
        
      }
    })
  }

  deleteParticularUser(returnStatus){
    if(this.userEmailId === null){
      console.log("Cannot delete a user with null as userEmailId");
      returnStatus("Cannot delete a user with null as userEmailId");
    }else{
      conn.query("select * from user where userEmailId = ?", this.userEmailId, (err, res) => {
        if(err){
          console.log(err);
          returnStatus("could not delete the user, query error");
        }else{
          console.log("res: ", res);
          if(res.length === 0){
            console.log("there is no such user");
            returnStatus("there is no such user");
          }else{
            conn.query("delete from user where userEmailId = ?", this.userEmailId, (err, res) => {
              if(err){
                console.log("could not delete the user, query error");
                returnStatus("could not delete the user, query error");
              }else{
                console.log("successfully deletd the user with emailid: ", this.userEmailId);
                returnStatus(`successfully deletd the user with emailid: ${this.userEmailId}`);
;              }
            })
          }
        }
      })
    }
  }

  isUserSignedInAlready(returnStatus) {
    conn.query(
      "select * from logged_in_user where loggedInUserEmailId = ? and isLoggedInCurrently = 1;",
      this.userEmailId,
      (err, res) => {
        if (err) {
          console.log("error querying", err);
          returnStatus(-1);
        } else {
          console.log("query success", res);
          if (res.length === 0) {
            returnStatus(0);
          } else {
            returnStatus(1);
          }
        }
      }
    );
  }
  isRegisteredUser(returnStatus) {
    conn.query(
      "SELECT * FROM user WHERE userEmailId = ?",
      this.userEmailId,
      (err, res) => {
        if (err) {
          console.log(err);
          returnStatus("query error");
        } else {
          //if there is no user with such email id, then the result will be empty array ...return 0, else then 1
          // console.log("res", res);
          // console.log("res.length", res.length);
          returnStatus(res.length === 0 ? 0 : 1);
        }
      }
    );
  }
  userSignOut(loggedOutUserDateAndTime, returnStatus) {
    this.isUserSignedInAlready((status_) => {
      if (status_ === 1) {
        conn.query(
          "update logged_in_user set isLoggedInCurrently = 0, loggedOutUserDateAndTime = ? where loggedInUserEmailId = ? and isLoggedInCurrently = 1;",
          [loggedOutUserDateAndTime, this.userEmailId],
          (err, res) => {
            if (err) {
              console.log("error updating the logged in user!", err);
              returnStatus(-1, "query error");
            } else {
              console.log("successfully updated!", res);
              returnStatus(1, "success");
            }
          }
        );
      } else {
        returnStatus(0, "user not signed in");
      }
    });
  }
  userSignIn(dateTime, returnStatus) {
    this.isRegisteredUser((status_) => {
      if (status_ === 0) {
        returnStatus(0, "not a registered user");
      } else {
        this.isUserSignedInAlready((status_) => {
          if (status_ === -1) {
            console.log("error in querying: inside userSignIn");
            return returnStatus(-1, "query error");
          } else if (status_ === 0) {
            //verifying the password
            conn.query("select userPassword as pw from user where userEmailId = ?", this.userEmailId, (err, res) =>{
              if(err){
                console.log("error in querying to check password: ", err);
                returnStatus(-1, "query error");
              }
              console.log(typeof res[0].pw);
              if(!(res[0].pw === this.userPassword)){
                return returnStatus(0, "password incorrect");
              }
              conn.query(
                'insert into logged_in_user(isLoggedInCurrently, loggedInUserDateAndTime, loggedInUserEmailId, loggedOutUserDateAndTime) values(1, ?, ?, "NOT YET LOGGED OUT");',
                [dateTime, this.userEmailId],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return returnStatus(-1, err);
                  } else {
                    console.log(
                      "successfully inserted the user in logged_in_user table",
                      result
                    );
                    return returnStatus(1, result);
                  }
                }
              );
            })
          } else {
            console.log("user already logged in case");
            return returnStatus(0, "user already logged in");
          }
        });
      }
    });
  }

  handleUserAddsMovieToWatchList(movieId, returnStatus) {
    this.isUserSignedInAlready((status_) => {
      if (status_ === 1) {
        //checking if the movie is there in the movie list
        conn.query(
          "select * from movies where movieId = ?;",
          movieId,
          (err, res) => {
            if (err) {
              console.log(err);
            } else {
              //if the response is not an empty array, it means the movie is there in the movie list.
              if (res.length !== 0) {
                //check if the user has already added the movie to his/ her watchlist
                conn.query(
                  "select * from user_movie where userEmailId = ? and movieId = ?;",
                  [this.userEmailId, movieId],
                  (err, res) => {
                    if (err) {
                      console.log(err);
                      returnStatus(-1, err);
                    } else {
                      console.log(res);
                      if (res.length === 0) {
                        conn.query(
                          "insert into user_movie(movieId, userEmailId) values(?, ?);",
                          [movieId, this.userEmailId],
                          (err, res) => {
                            if (err) {
                              console.log(err);
                              returnStatus(-1, err);
                            } else {
                              console.log(res);
                              returnStatus(1, res);
                            }
                          }
                        );
                      } else {
                        returnStatus(0, "movie already in watchlist");
                      }
                    }
                  }
                );
              }else{
                returnStatus(0, "movie is not in movie list");
              }
            }
          }
        );
      }else if(status_ === 0){
        returnStatus(0, "user not signed in");
      }
    });
  }

  userSignUp(returnStatus) {
    conn.query(
      "INSERT INTO user(userName, userEmailId, userPassword, userPhoneNumber) VALUES(?, ?, ?, ?);",
      [
        this.userName,
        this.userEmailId,
        this.userPassword,
        this.userPhoneNumber,
      ],
      (err, res) => {
        if (err) {
          console.log("inside if-err", err);
          returnStatus(0);
        } else {
          console.log("inside if-success", res);
          returnStatus(1, res);
        }
      }
    );
  }
}

module.exports = { User };
