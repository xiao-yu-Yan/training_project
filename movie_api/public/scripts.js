// movie_api/public/scripts.js
// JavaScript to handle fetching and displaying movies
function loadMovies() {
    fetch('/api/movies')
        .then(response => response.json())
        .then(movies => {
            const tbody = document.querySelector('#movies-table tbody');
            tbody.innerHTML = '';
            
            movies.forEach(movie => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${movie.id}</td>
                    <td>${movie.name}</td>
                    <td>${movie.year}</td>
                `;
                tbody.appendChild(row);
            });
        })
        .catch(error => console.error('load movie error', error));
}

// Function to handle form submission for adding a new movie
// Assumes there is a form with id 'movie-form' and input fields with ids '
function setupForm() {
    const form = document.getElementById('movie-form');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const movieData = {
            name: document.getElementById('name').value,
            year: parseInt(document.getElementById('year').value)
        };
        
        fetch('/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(movieData)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('message').textContent = 
                `movie"${data.name}" add success! jump coming...`;
            setTimeout(() => {
                window.location.href = '/';
            }, 1500);
        })
        .catch(error => {
            console.error('add movie faiiled:', error);
            document.getElementById('message').textContent = 'add movie failed, please try again.';
        });
    });
}

// Initialize the script when the DOM is fully loaded
// This ensures that the script runs after the HTML elements are available
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('movies-table')) {
        loadMovies();
    }
    
    setupForm();
});