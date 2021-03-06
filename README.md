# liri-node-app

Usage: node liri.js [command][query]

Commands: 
    1) concert-this
        This command will look up concert venues of a specified band.
    2) movie-this
        This command will search a movie title.
    3) spotify-this-song
        This command will search a song.
    4) do-what-it-says
        Runs the command in random.txt.
    5) help
        shows the users how to use liri.js.

When using commands 1-3, the query must be given. In addition, if the query is multiple words long, you must enclose them in either single or double quotes.

Basic usage examples:

   concert-this usage
        ![concert-this example](https://raw.githubusercontent.com/giboc/liri-node-app/master/screenshot/concert-this.png)
    
   movie-this usage:
        ![movie-this example](https://raw.githubusercontent.com/giboc/liri-node-app/master/screenshot/movie-this.png)
    
   spotify-this-song usage:
    ![spotify example](https://raw.githubusercontent.com/giboc/liri-node-app/master/screenshot/spotify.png)
    
   Various examples of input handling:
    ![error example](https://raw.githubusercontent.com/giboc/liri-node-app/master/screenshot/error.png)


When using command 4, the command in the text file "random.txt" will be run.  Users may change the command in here but it must follow this format:
    [command],"[query]"
Example:
    spotify-this-song,"I Want it That Way"

If the user enters an incorrect command or incorrect number of inputs, the script will suggest the user to run help.

Finally, all non-error messages (including artist/movie not found) will be logged in log.txt.
