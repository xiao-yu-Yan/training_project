// API base URL
const API_BASE_URL = 'http://localhost:3001/api';

// DOM elements
const movieForm = document.getElementById('movieForm');
const movieList = document.getElementById('movieList');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const confirmDeleteBtn = document.getElementById('confirmDelete');
const confirmModal = new bootstrap.Modal(document.getElementById('confirmModal'));

let movieToDelete = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies();
    
    // Form submission
    movieForm.addEventListener('submit', handleFormSubmit);
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Delete confirmation
    confirmDeleteBtn.addEventListener('click', deleteMovie);
});

// Fetch movies from API
function fetchMovies(searchTerm = '') {
    let url = `${API_BASE_URL}/movies`;
    if (searchTerm) {
        url += `?search=${encodeURIComponent(searchTerm)}`;
    }
    
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => renderMovies(data))
        .catch(error => {
            console.error('Error fetching movies:', error);
            movieList.innerHTML = '<div class="col-12 text-center py-4"><p>Error loading movies</p></div>';
        });
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const id = document.getElementById('movieId').value;
    const title = document.getElementById('title').value;
    const year = document.getElementById('year').value;
    const director = document.getElementById('director').value;
    const genre = document.getElementById('genre').value;
    const rating = document.getElementById('rating').value;
    
    const movieData = {
        title,
        year: parseInt(year),
        director,
        genre,
        rating: parseFloat(rating)
    };
    
    if (id) {
        // Update existing movie (PUT)
        updateMovie(id, movieData);
    } else {
        // Add new movie (POST)
        addMovie(movieData);
    }
}

// Add a new movie (POST)
function addMovie(movieData) {
    fetch(`${API_BASE_URL}/movies`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Reset form
        movieForm.reset();
        document.getElementById('movieId').value = '';
        // Refresh movie list
        fetchMovies();
    })
    .catch(error => {
        console.error('Error adding movie:', error);
        alert('Failed to add movie');
    });
}

// Update a movie (PUT)
function updateMovie(id, movieData) {
    fetch(`${API_BASE_URL}/movies/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(movieData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Reset form
        movieForm.reset();
        document.getElementById('movieId').value = '';
        // Refresh movie list
        fetchMovies();
    })
    .catch(error => {
        console.error('Error updating movie:', error);
        alert('Failed to update movie');
    });
}

// Delete a movie (DELETE)
function deleteMovie() {
    if (movieToDelete) {
        fetch(`${API_BASE_URL}/movies/${movieToDelete}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            movieToDelete = null;
            confirmModal.hide();
            // Refresh movie list
            fetchMovies();
        })
        .catch(error => {
            console.error('Error deleting movie:', error);
            alert('Failed to delete movie');
        });
    }
}

// Show confirmation modal for delete
function showDeleteConfirmation(id) {
    movieToDelete = id;
    confirmModal.show();
}

// Handle search
function handleSearch() {
    const searchTerm = searchInput.value.trim();
    fetchMovies(searchTerm);
}

// Edit movie - populate form
function editMovie(id) {
    fetch(`${API_BASE_URL}/movies`)
        .then(response => response.json())
        .then(movies => {
            const movie = movies.find(m => m.id === id);
            if (movie) {
                document.getElementById('movieId').value = movie.id;
                document.getElementById('title').value = movie.title;
                document.getElementById('year').value = movie.year;
                document.getElementById('director').value = movie.director;
                document.getElementById('genre').value = movie.genre;
                document.getElementById('rating').value = movie.rating;
                
                // Scroll to form
                document.getElementById('title').focus();
            }
        })
        .catch(error => {
            console.error('Error fetching movies for edit:', error);
        });
}

// Render movies to the DOM
function renderMovies(moviesToRender) {
    movieList.innerHTML = '';
    
    if (moviesToRender.length === 0) {
        movieList.innerHTML = '<div class="col-12 text-center py-4"><p>No movies found</p></div>';
        return;
    }
    
    moviesToRender.forEach(movie => {
        const movieCard = document.createElement('div');
        movieCard.className = 'col-md-6 col-lg-4 mb-4';
        movieCard.innerHTML = `
            <div class="card movie-card h-100">
                <div class="card-body">
                    <h5 class="card-title">${movie.title} (${movie.year})</h5>
                    <p class="card-text"><strong>Director:</strong> ${movie.director}</p>
                    <p class="card-text">
                        <span class="badge genre-badge">${movie.genre}</span>
                        <span class="badge rating-badge ms-2">⭐ ${movie.rating}</span>
                    </p>
                    <div class="btn-group mt-2">
                        <button class="btn btn-sm btn-warning" onclick="editMovie(${movie.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="showDeleteConfirmation(${movie.id})">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                    </div>
                </div>
            </div>
        `;
        movieList.appendChild(movieCard);
    });
}

// Expose functions to global scope for onclick attributes
window.editMovie = editMovie;
window.showDeleteConfirmation = showDeleteConfirmation;