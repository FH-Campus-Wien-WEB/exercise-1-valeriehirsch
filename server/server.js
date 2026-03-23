const express = require('express')
const path = require('path')
const app = express()

// Serve static content in directory 'files'
app.use(express.static(path.join(__dirname, 'files')));



// Configure a 'get' endpoint for data..
app.get('/movies', function (req, res) {
    fetch("http://www.omdbapi.com/?apikey=a8cbe32d&s=Bridget+Jones")
      .then(response => response.json())
      .then(data => {
      const twoMovies = data.Search.slice(0,2)

    fetch("http://www.omdbapi.com/?apikey=a8cbe32d&s=mamma+mia")
      .then(response => response.json())
      .then(data => {
      const twoMovies2 = data.Search.slice(0,2)  
      
    fetch("http://www.omdbapi.com/?apikey=a8cbe32d&s=love+actually")
      .then(response => response.json())
      .then(data => {
      const oneMovie = data.Search.slice(0,1)

      const mergedMovies = twoMovies.concat(oneMovie);
      const threeMovies = mergedMovies.concat(twoMovies2);

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
  })
})

app.listen(3000)

console.log("Server now listening on http://localhost:3000/")

