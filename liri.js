require("dotenv").config();

const keys = require("./keys");

// const SPOTIFY_KEY = require("keys.js");

var Spotify = require('node-spotify-api');
var axios = require('axios');
var moment = require('moment');
var spotify = new Spotify(keys.spotify);
var fs = require("fs");

// if (process.argv.length<3 || process.argv.length>4){
//     console.log("Error: invalid usage");
// }

function concert(band){
    if(band === undefined)
        band = process.argv[3]; 

    
    axios({
        method: 'get',
        url: '/artists/' + band + "/events?app_id=codingbootcamp",
        baseURL: 'https://rest.bandsintown.com'

    })
        .then(function (response) {
            response.data.forEach(function(show){
                console.log("Venue: " + show.venue.name) ;
                console.log("Location: " + show.venue.city + ", " + show.venue.country);
                console.log("Date: " + moment(show.datetime).format("MM/DD/YYYY"));
                console.log("");
            });
        });

};

function movie(title){
    if(title === undefined)
        title = process.argv[3];
    axios({
        method: 'get',
        url: '/?apikey=' + process.env.OMDB_KEY + "&t=" + title,
        baseURL: 'https://www.omdbapi.com'

    })
        .then(function (response) {
            console.log("Title: " + response.data.Title);
            console.log("Year: " + response.data.Year);
            console.log("IMDB Rating: " + response.data.imdbRating);
            console.log("Rotten Tomatoes Rating: " + response.data.Ratings[1].Value);
            console.log("Countries: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);

        });

};

function song(title){
    if (title === undefined)
        title = process.argv[3];
    spotify.search({ type: 'track', query: title, limit: 10 }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        else {

            if (data.tracks.items[0].artists.length === 1) {
                console.log("Artist: " + data.tracks.items[0].artists[0].name);
            }
            else {
                var temp = "";
                for (var i = 1; i < data.tracks.items[0].artists.length; i++) {
                    temp += (", " + data.tracks.items[0].artists[i].name);
                    console.log("Artists: " + data.tracks.items[0].artists[0].name + temp);
                }
            }

            console.log("Track: " + data.tracks.items[0].name);
            console.log("Link: " + data.tracks.items[0].external_urls.spotify);
        }
    });
};

if (process.argv[2] === "concert-this"){
    concert();
}


if (process.argv[2] === "movie-this") {
    movie();
}


if (process.argv[2] === "spotify-this-song") {
    song();
}

if (process.argv[2] === "do-what-it-says"){
    fs.readFile("random.txt", "utf8", function(err, file){
        if (err) throw err;
            var command = file.split(',');
        
        if (command[0] === "concert-this"){
            concert(command[1]);
        }
        
        
        if (command[0] === "movie-this") {
            movie(command[1]);
        }
        
        
        if (command[0] === "spotify-this-song") {
            song(command[1]);
        }
        
        
    });
    
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