const { conn } = require('../db_config/dbConfig.js');
class Movie {
  constructor() {
    this.title = null;
    this.id = null;
    this.rating = null;
    this.isReleased = null;
    this.releaseDate = null;
  }
  getValues() {
    return [
      this.movieId,
      this.movieTitle,
      this.movieRating,
      this.movieIsReleased,
      this.movieReleaseDate,
    ];
  }
  setValues(id, title, rating, isReleased, releaseDate) {
    this.movieId = id;
    this.title = title;
    this.rating = rating;
    this.isReleased = isReleased;
    this.releaseDate = releaseDate;
  }
  isValidMovie(returnStatus){
    conn.query("select * from movies where movieId = ?;", (err, res) => {
      if(err){
        console.log("error fetching particular movie using movie", err);
        returnStatus(-1);
      }else{
        console.log("successfully fetched result from movies table", res);
        if(res.length === 0){
          console.log("no such movie with the given movieId");
          returnStatus(0);
        }else{
          returnStatus(1);
        }
      }
    })
  }
  static getMovies(returnStatus) {
    console.log("inside getMovies: ");
    conn.query("SELECT * FROM movies;", (err, res) => {
      if (err) {
        console.log("inside if-err", err);
        returnStatus(0, err);
      } else {
        console.log("inside if-success", res);
          returnStatus(1, res);
      }
    });
  }
}

module.exports = { Movie };