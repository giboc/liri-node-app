require("dotenv").config();

const keys = require("./keys");

// const SPOTIFY_KEY = require("keys.js");

var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

function concert(band) {
    if (band === undefined)
        band = process.argv[3];


    axios({
        method: 'get',
        url: '/artists/' + band + "/events?app_id=codingbootcamp",
        baseURL: 'https://rest.bandsintown.com'

    })
        .then(function (response) {
            if (response.data === "{warn=Not found}\n") {
                console.log("Artist not found.");
                fs.appendFileSync("log.txt", "Artist not found.\n\n");
            }
            else {
                response.data.forEach(function (show) {
                    console.log("Venue: " + show.venue.name);
                    fs.appendFileSync("log.txt", "Venue: " + show.venue.name + "\n");

                    console.log("Location: " + show.venue.city + ", " + show.venue.country);
                    fs.appendFileSync("log.txt", "Location: " + show.venue.city + ", " + show.venue.country + "\n");

                    console.log("Date: " + moment(show.datetime).format("MM/DD/YYYY"));
                    fs.appendFileSync("log.txt", "Date: " + moment(show.datetime).format("MM/DD/YYYY") + "\n");
                    console.log("");

                    fs.appendFileSync("log.txt", "\n");

                });
            }
        });

};

function movie(title) {
    if (title === undefined)
        title = process.argv[3];
    axios({
        method: 'get',
        url: '/?apikey=' + process.env.OMDB_KEY + "&t=" + title,
        baseURL: 'https://www.omdbapi.com'

    })
        .then(function (response) {

            if (response.data.Response === "False") {
                console.log("Movie not found.");
                fs.appendFileSync("log.txt", "Movie not found\n\n");
            }
            else {
                console.log("Title: " + response.data.Title);
                fs.appendFileSync("log.txt", "Title: " + response.data.Title + "\n");

                console.log("Year: " + response.data.Year);
                fs.appendFileSync("log.txt", "Year: " + response.data.Year + "\n");

                console.log("IMDB Rating: " + response.data.imdbRating);
                fs.appendFileSync("log.txt", "IMDB Rating: " + response.data.imdbRating + "\n");

                var found = false;
                response.data.Ratings.forEach(function (ratings) {
                    if (ratings.Source === "Rotten Tomatoes") {
                        console.log("Rotten Tomatoes Rating: " + ratings.Source.Value);
                        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + ratings.Source.Value);
                        found = true;
                    }
                });
                console.log(found);
                if (!found) {
                    console.log("Rotten Tomatoes Rating: Unavailable");
                    fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: Unavailable\n");
                }

                console.log("Countries: " + response.data.Country);
                fs.appendFileSync("log.txt", "Countries: " + response.data.Country + "\n");

                console.log("Language: " + response.data.Language);
                fs.appendFileSync("log.txt", "Language: " + response.data.Language + "\n");

                console.log("Plot: " + response.data.Plot);
                fs.appendFileSync("log.txt", "Plot: " + response.data.Plot + "\n");

                console.log("Actors: " + response.data.Actors);
                fs.appendFileSync("log.txt", "Actors: " + response.data.Actors + "\n\n");
            }

        });

};

function song(title) {
    if (title === undefined)
        title = process.argv[3];
    spotify.search({ type: 'track', query: title, limit: 10 }, function (err, data) {
        if (data === null) {
            console.log("Song not found");
            fs.appendFileSync("log.txt","Song not found");
        }
        else {

            if (data.tracks.items[0].artists.length === 1) {
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
                fs.appendFileSync("log.txt", "Artist: " + data.tracks.items[0].artists[0].name + "\n");
            }
            else {
                var temp = "";
                for (var i = 1; i < data.tracks.items[0].artists.length; i++) {
                    temp += (", " + data.tracks.items[0].artists[i].name);
                    console.log("Artists: " + data.tracks.items[0].artists[0].name + temp);
                    fs.appendFileSync("log.txt", "Artist: " + data.tracks.items[0].artists[0].name + temp + "\n");
                }
            }

            console.log("Track: " + data.tracks.items[0].name);
            fs.appendFileSync("log.txt", "Track: " + data.tracks.items[0].name + "\n");

            console.log("Link: " + data.tracks.items[0].external_urls.spotify);
            fs.appendFileSync("log.txt", "Link: " + data.tracks.items[0].external_urls.spotify + "\n\n");
        }
    });
};

if (process.argv.length < 3 || process.argv.length > 4) {
    console.log("Error: invalid usage");
    console.log('Usage: Enter "node liri.js help" for instructions.');
}

else {

    if (process.argv[2] === "concert-this") {
        concert();
    }


    if (process.argv[2] === "movie-this") {
        movie();
    }


    if (process.argv[2] === "spotify-this-song") {
        song();
    }

    if (process.argv[2] === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (err, file) {
            if (err) throw err;
            var command = file.split(',');

            if (command[0] === "concert-this")
                concert(command[1]);

            if (command[0] === "movie-this")
                movie(command[1]);

            if (command[0] === "spotify-this-song")
                song(command[1]);

        });
    }

}
// var querystring = require('querystring');
// axios.post('http://something.com/', querystring.stringify({ foo: 'bar' }));

// axios.get('/user?ID=12345')
//   .then(function (response) {
//     console.log(response);
//   })
//   .catch(function (error) {
//     console.log(error);
//   });