//For hiding my keys from everyone else.
require("dotenv").config();
const keys = require("./keys");

//Other necessary libraries.
var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

//The following functions will be called for its respective command.
//concert-this will call concert()
//movie-this will call movie()
//spotify-this-song will call song()
//These functions can be called with an optional parameter.
//When no parameter is passed, the script assumes the parameter is in the command line.
//When a parameter is passed, it is passed from the data in random.txt.
function concert(band) {
    if (band === undefined)
        band = process.argv[3]; //If the parameter doesn't exist, use the one given in the command line.
    band = band.trim();
    axios({
        method: 'get',
        url: '/artists/' + (band === undefined ? 'Iron Maiden' : band) + "/events?app_id=codingbootcamp", //Defaults to Iron Maiden if no parameter was given in the command line.
        baseURL: 'https://rest.bandsintown.com'

    })
        .then(function (response) {
            if (response.data === "{warn=Not found}\n") { //Error handling. When a band is not found, we get "{warn=Not found}" in data.
                //However, this error message isn't consistent. It appears most of the times, but every now and then
                //the following error message appears: "{ errorMessage: '[NotFound] The artist was not found' }\n").
                //I attempted to do a simple or statement to include that, but the logic would result false for some reason.
                //Perhaps a bug on their end?
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
        url: '/?apikey=' + process.env.OMDB_KEY + "&t=" + (title === undefined ? 'Mr.Nobody' : title), //Similar error handling to the concert(). The search defaults to Mr. Nobody
                                                                                                       //when no movie titles are supplied in the command line.
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

                var found = false; //Not all movies have Rotten Tomato Ratings. We check the Ratings to see if oen exists. If it doesn't, it outputs "unavailable" instead.
                response.data.Ratings.forEach(function (ratings) {
                    if (ratings.Source === "Rotten Tomatoes") {
                        console.log("Rotten Tomatoes Rating: " + ratings.Value);
                        fs.appendFileSync("log.txt", "Rotten Tomatoes Rating: " + ratings.Value);
                        found = true;
                    }
                });

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
    spotify.search({ type: 'track', query: (title === undefined ? 'The Sign Ace of Base' : title), limit: 10 }, function (err, data) {
        if (data === null) {
            console.log("Song not found");
            fs.appendFileSync("log.txt", "Song not found");
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

//Input checking. Makes sure the user supplies a command and at most one query.
if (process.argv.length < 3 || process.argv.length > 4) {
    console.log("Error: invalid usage");
    console.log('Usage: Enter "node liri.js help" for instructions.');
}
//if input is all good...
else {

    if (process.argv[2] === "concert-this")
        concert();
    else if (process.argv[2] === "movie-this")
        movie();
    else if (process.argv[2] === "spotify-this-song")
        song();
    else if (process.argv[2] === "do-what-it-says") {
        fs.readFile("random.txt", "utf8", function (err, file) {
            if (err)
                console.log(err);
            var command = file.split(','); //Split the string up, using the comma for the break.
            if (command[0] === "concert-this")
                concert(command[1]);

            if (command[0] === "movie-this")
                movie(command[1]);

            if (command[0] === "spotify-this-song")
                song(command[1]);

        });
    }
    else if (process.argv[2] === "help") {
        console.log("Usage: ");
        console.log('To search for concerts: "node liri.js concert-this <name of band>"');
        console.log('To search for movies: "node liri.js movie-this <title of movie>"');
        console.log('To search for a song: "node liri.js spotify-this-song <title of song>"');
        console.log('To follow instructions from random.txt: "node liri.js do-what-it-says"');
        console.log('If you use random.txt, you must use the following format:');
        console.log('<one of the above commands>,"<search item>"');
    }
    else {
        console.log('Unrecognized command. Use "node liri.js help" for usage notes.');
    }


}