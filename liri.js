require("dotenv").config();

// variables
var command = process.argv[2];
var argument = process.argv[3];

// my list of require access
var request = require('request')
var keys = require('./keys.js');
var bandsintown = require('bandsintown')("codingbootcamp");
var moment = require('moment');
var fs = require("fs");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);


// command functions
function spotifyThis(){
    if (argument === undefined) {
        argument = `"The Sign" Ace of Base`
    }
    console.log('spotify this song: ' + argument);
    spotify.search({
            type: 'track',
            query: argument,
            limit: 1,
        }, function (err, data) {
            if (err) {
                console.log('Error occured: ' + err);
            }
            music = data.tracks.items[0];
            console.log(`
        ${music.name}
        ${'Album: ' + music.album.name}
        ${'Artist: ' + music.album.artists[0].name} 
        ${'Song Sample: ' + music.preview_url}
                    `, fs.appendFile('log.txt', `
${music.name}
Album: ${music.album.name}
Artist: ${music.album.artists[0].name}
Song Sample: ${music.preview_url}
                            `, function (err) {
                                if (err) throw err
                                console.log('saved to log.txt!');
                                },

                        )
                    )
                }
        )
};

function movieThis(){
    if (argument === undefined) {
        argument = `Mr.Nobody`
    }
    console.log('movie this: ' + argument);
    
    // this should be a API key with argument
    request(``, function (error, response, body) {

        if (!error && response.statusCode === 200) {
            console.log(`${JSON.parse(body).Title}
       ${'Release Year'}: ${JSON.parse(body).Year}
       ${'IMDB Rating'}: ${JSON.parse(body).imdbRating}
       ${'Rotten Tomatoes Rating'}: ${JSON.parse(body).Ratings[1].Value}
       ${'Origin Country'}: ${JSON.parse(body).Country}
       ${'Available Languages'}: ${JSON.parse(body).Language}
       ${'Plot'}: ${JSON.parse(body).Plot}
        ${'Actors'}: ${JSON.parse(body).Actors}`);
        }
        fs.appendFile('log.txt', `
${JSON.parse(body).Title}
Release Year: ${JSON.parse(body).Year}
IMDB Rating: ${JSON.parse(body).imdbRating}
Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}
Origin Country: ${JSON.parse(body).Country}
Available Languages: ${JSON.parse(body).Language}
Plot: ${JSON.parse(body).Plot}
Actors: ${JSON.parse(body).Actors}
                `, function (err) {
            if (err) throw err;
            console.log('Saved to log.txt!');
        });
    });
};

function concertThis(){
    bandsintown.getArtistEventList(argument).then(function (events) {

    console.log(`
    ${'Band: ' + argument}
    ${'Venue Name: ' + events[0].venue.name}
    ${'Location: ' + events[1].formatted_location}
    ${'Date: ' + moment(events[0].datetime).format('L')}`);
    fs.appendFile('log.txt', `
${argument}
Venue Name: ${events[0].venue.name}
Location: ${events[1].formatted_location}
Date: ${moment(events[0].datetime).format('L')}
`,

        function (err) {
            if (err) throw err;
            console.log('Saved to log.txt!');
        });
});
};

function doWhatItSays(){
if (action === "spotify-this-song"){
    console.log("spotifying: " + whatItSaysArgument);
    argument = whatItSaysArgument;
    spotifyThis(argument);
    }       
};


// if/then logic tree

if (command === "spotify-this-song") {
    if (process.argv[3] === undefined) {
        argument = `"The Sign" Ace of Base`
    }
    spotifyThis();} 
    else if (command === "movie-this"){
        movieThis();
    }
    else if (command === "concert-this"){
        concertThis();
    }
    else if (command === "do-what-it-says") {
    console.log('do what it says is activated')

	fs.readFile("random.txt", "utf8", function(err, data) {
		if (err) {
			logOutput.error(err);
		} else {
            var randomArray = data.split(",");
            
			action = randomArray[0];
			whatItSaysArgument = randomArray[1];

            console.log("randomArray: " + randomArray);
            console.log("action: " + action)
            console.log("argument" + whatItSaysArgument);

            doWhatItSays(action, whatItSaysArgument)
		}
	});          

    }
