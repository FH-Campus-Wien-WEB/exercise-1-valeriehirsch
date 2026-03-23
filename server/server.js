const express = require('express')
const path = require('path')
const app = express()

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));



// Configure a 'get' endpoint for data..
app.get('/movies', function (req, res) {
    fetch("http://www.omdbapi.com/?apikey=a8cbe32d&s=Batman")
      .then(response => response.json())
      .then(data => {
      const threeMovies = data.Search.slice(0,3)
      
      Promise.all(
       threeMovies.map(movie => 
        fetch(`http://www.omdbapi.com/?apikey=a8cbe32d&i=${movie.imdbID}`)
        .then(response2 => response2.json())
      )
    ).then(fullMovies => {

        const structured = fullMovies.map(movie => ({
          Title: movie.Title,
          Released: new Date(movie.Released).toLocaleDateString('en-CA'),
          Runtime: parseInt(movie.Runtime),
          Genres: (movie.Genre).split(','),
          Directors: (movie.Director).split(','),
          Writers: (movie.Writer).split(','),
          Actors: (movie.Actors).split(','),
          Plot: movie.Plot,
          Poster: movie.Poster,
          Metascore: parseInt(movie.Metascore),
          imdbRating: parseFloat(movie.imdbRating)
        }))
        res.json(structured)
      })

      
    })
  
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

