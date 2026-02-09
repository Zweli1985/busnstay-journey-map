// scripts.js
// Search Filtering (Client-side example, replace with backend API)
function filterResults() {
    const category = document.getElementById('categoryFilter')?.value;
    const location = document.getElementById('locationFilter')?.value;
    const sort = document.getElementById('sortFilter')?.value;
    // Example: Fetch filtered results from backend
    fetch(`/api/search?category=${category}&location=${location}&sort=${sort}`)
        .then(response => response.json())
        .then(data => {
            // Update DOM with results (example)
            const resultsContainer = document.querySelector('.row-cols-md-2');
            resultsContainer.innerHTML = ''; // Clear existing
            data.forEach(business => {
                resultsContainer.innerHTML += `
                    <div class="col">
                        <div class="business-card">
                            <img src="${business.logo}" class="card-img-top" alt="${business.name} Logo">
                            <div class="card-body">
                                <h5 class="card-title">${business.name}</h5>
                                <p class="card-text">${business.description}</p>
                                <p class="card-text"><i class="fas fa-star text-warning"></i> ${business.rating} (${business.reviews} reviews)</p>
                                <a href="/profile/${business.slug}" class="btn btn-primary">View Profile</a>
                            </div>
                        </div>
                    </div>`;
            });
        })
        .catch(error => console.error('Error fetching results:', error));
}

// Attach filter event listeners (for search.html)
document.getElementById('categoryFilter')?.addEventListener('change', filterResults);
document.getElementById('locationFilter')?.addEventListener('change', filterResults);
document.getElementById('sortFilter')?.addEventListener('change', filterResults);

// Carousel Auto-Advance (for index.html)
document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('#businessCarousel');
    if (carousel) {
        new bootstrap.Carousel(carousel, {
            interval: 5000, // Auto-advance every 5 seconds
            wrap: true
        });
    }
});