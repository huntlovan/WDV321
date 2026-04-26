import { useState } from 'react'
import './App.css'
import { MovieCard } from './components'

function App() {
  const randomNumber = () => {
    return Math.floor(Math.random() * 1000000)
  }

  const [movies, setMovies] = useState([
    {
      id: randomNumber(),
      name: 'Inception',
    },
    {
      id: randomNumber(),
      name: 'The Matrix',
    },
  ])

  const [newName, setNewName] = useState('')
  const [error, setError] = useState('')

  const addMovie = () => {
    if (newName.trim() === '') {
      setError('Movie name cannot be blank.')
      return
    }
    setMovies((prev) => [...prev, { id: randomNumber(), name: newName.trim() }])
    setNewName('')
    setError('')
  }

  return(
    <>
      <h1>Movie Rating</h1>

      <div className="add-movie-form">
        <label htmlFor="movie-name">Name:</label>
        <input
          id="movie-name"
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addMovie()}
        />
        <button onClick={addMovie}>Add</button>
        {error && <p className="error-msg">{error}</p>}
      </div>

      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </>
  )
}

export default App
