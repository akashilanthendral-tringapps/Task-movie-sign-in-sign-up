const { Movie } = require('../models/movie.js');

const getMovies = (req, resp) => {
    Movie.getMovies((status_, result) => {
        if (status_ === 0) {
            resp.status(500).json({ "message_err": result });
        } else {
            resp.status(200).json({ "message_success": result });
        }
    })
};

module.exports = { getMovies };