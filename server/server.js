const express = require('express');
const cors = require('cors');

const { getMovies } = require("./controllers/movieController.js");
const { deleteAllUsers, deleteParticularUser, handleUserAddsMovieToWatchList, userSignOut, userSignUp, userSignIn } = require("./controllers/userController.js");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`App started at PORT: ${PORT}!`);
})
//movies
app.get('/movies', getMovies);
//user
app.post('/user/signup', userSignUp);
app.post('/user/signin', userSignIn);
app.post('/user/signout', userSignOut);
app.post('/user/addmovietowatchlist', handleUserAddsMovieToWatchList);

app.delete('/user/deleteallusers', deleteAllUsers);
app.delete('/user/deleteparticularuser', deleteParticularUser);