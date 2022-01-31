const { Movie } = require('../models/movie.js');
const { User } = require('../models/user.js');

const userSignUp = async (req, resp) => {
    const { userName, userEmailId, userPassword, userPhoneNumber } = req.body;
    let user = new User();
    user.setValues(userName, userEmailId, userPassword, userPhoneNumber);
    user.isRegisteredUser((isAlreadyAUser) => {
      switch(isAlreadyAUser){
        case 0:
                console.log("user not already present:  inside case 0");
                user.userSignUp((status_) => {
                  if(status_ === 0){
                    resp.send("query_error");
                    // resp.status(500).json({"error": result});
                  }else{
                    // resp.status(200).json({"success": result});
                    resp.send("success");
                  }
                });
                break;
        case 1:
                console.log("user already present:  inside case 1");
                // resp.status(500).json({"error":"userAlreadyPresent"});
                resp.send("user already present");
                break;
        default:
                console.log("user not already present:  inside default", isAlreadyAUser);
                // resp.status(500).json({"sqlError": isAlreadyAUser});
                resp.send("query_error");
                break;
      }
  
    });
}

const userSignOut = (req, resp) => {
  const {userEmailId, loggedOutUserDateAndTime} = req.body;
  let user = new User();
  user.userEmailId = userEmailId;
  user.userSignOut(loggedOutUserDateAndTime, (status_, result) => {
    if(status_ === 0 || status_ === -1){
      return resp.status(500).json({"error": result});
    }else{
      return resp.status(200).json({"success": result});
    }
  });
}

const userSignIn = (req, resp) => {
    const { userEmailId, userPassword, dateTime} = req.body;

    let user = new User();
    user.userEmailId = userEmailId;
    user.userPassword = userPassword;

    user.userSignIn(dateTime, (status_, result) => {
      if(status_ === 0 || status_ === -1){
        console.log("sign in error with status: ", status_, 'and result: ', result);
        return resp.send(result);
      }else{
        return resp.send(result);
      }
    })
}

const deleteAllUsers = (req, resp) => {
  User.deleteAllUsers((staus_) => {
    resp.send(staus_);
  });
}

const deleteParticularUser = (req, resp) => {
  const user = new User();
  user.userEmailId = req.body.userEmailId;
  user.deleteParticularUser((status_) => {
    resp.send(status_);
  })
}

const handleUserAddsMovieToWatchList = (req, resp) => {
  const {userEmailId, movieId} = req.body;
  let user = new User();

  user.userEmailId = userEmailId;
  user.handleUserAddsMovieToWatchList(movieId, (status_, result) => {
    if(status_ === 0 || status_ === -1){
      return resp.status(500).json({"error": result});
    }else{
      return resp.status(200).json({"success": result});
    }
  });
}

module.exports = { userSignUp, userSignIn, userSignOut, handleUserAddsMovieToWatchList, deleteAllUsers, deleteParticularUser};