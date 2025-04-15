'use strict';

const DB = [
    // id, title, favourite, date, rating
    [1, 'Pulp Fiction', 1, '2024-03-10', 5],
    [2, '21 Grams', 1, '2025-03-17', 4],
    [3, 'Star wars', 0, '', 0],
    [4, 'Matrix', 0, '', 0],
    [5, 'Shrek', 0, '2025-03-21', 2]
];

function Film(id, title, favourite = false, date = undefined, rating = "not assigned") {
    this.id = id;
    this.title = title;
    this.favourite = favourite;
    if (date && date !== '') {
        this.date = dayjs(date);
    } else {
        this.date = null;
    }
    this.rating = rating;


    this.str = function () {
        const formattedDate = this.date ? this.date.format('YYYY-MM-DD') : '';
        return `${this.id}: ${this.title} ${this.favourite} ${formattedDate} ${this.rating}`
    }
}

function clearTable() {
    const tableBody = document.querySelector('tbody');
    tableBody.innerHTML = "";  // Be careful using innerHTML for XSS, however with constant strings this is safe
}

function createFilmNode(ans) {
    //data
    const newTd1 = document.createElement("td");
    const newContentDate = document.createTextNode(ans.date ? ans.date.format('YYYY-MM-DD') : '');
    newTd1.appendChild(newContentDate);

    //title
    const newTd2 = document.createElement("td");
    const newContentTitle = document.createTextNode(ans.title);
    newTd2.appendChild(newContentTitle);

    //favourite
    const newTd3 = document.createElement("td");
    const favIcon = document.createElement("i");
    if (ans.favourite === 1) {
        favIcon.classList.add("bi", "bi-check-square-fill"); // Add Bootstrap icon classes
    } else {
        favIcon.classList.add("bi", "bi-square");
    }
    newTd3.appendChild(favIcon);

    //rating
    const newTd4 = document.createElement("td");
    for (let i = 0; i < ans.rating; i++) {
        const rate = document.createElement("i");
        rate.classList.add("bi", "bi-star-fill")
        newTd4.appendChild(rate);
    }
    for (let i = 0; i < 5 - ans.rating; i++) {
        const rate = document.createElement("i");
        rate.classList.add("bi", "bi-star")
        newTd4.appendChild(rate);
    }

    //delete
    const newTd5 = document.createElement("td");
    const newButton = document.createElement("button");
    newButton.className = "btn btn-danger";
    newButton.id = ans.id;
    const trashIcon = document.createElement("i");
    trashIcon.classList.add("bi", "bi-trash");
    newButton.appendChild(trashIcon);
    newTd5.appendChild(newButton);

    // Add click event to delete the film when the button is clicked
    newButton.addEventListener('click', event => {
        const filmId = event.target.closest('button').id; 
        console.log('delete film, title ' + ans.title + " event target " + event.target);

        deleteFilm(filmId);
    });



    const newTr = document.createElement("tr");
    newTr.appendChild(newTd2);
    newTr.appendChild(newTd3);
    newTr.appendChild(newTd1);
    newTr.appendChild(newTd4);
    newTr.appendChild(newTd5);


    return newTr;

}


function filterFilms(films, filter) {
    if (filter === 'All') {
        return films; // Show all films
    }
    if (filter === 'Favourite') {
        return films.filter(film => film.favourite === 1); // Show only favourite films
    }
    if (filter === 'Best Rated') {
        return films.filter(film => film.rating >= 5); // Show best rated films
    }
    if (filter === 'Seen last month') {
        const lastMonth = dayjs().subtract(1, 'month');
        return films.filter(film => film.date && film.date.isAfter(lastMonth)); // Show films seen in the last month
    }
    if (filter === 'Unseen') {
        return films.filter(film => !film.date); // Show films that have not been seen
    }
}
function createFilmList(films) {
    const tableBody = document.getElementById('films');
    for (let f of films) {
        const newRow = createFilmNode(f);
        tableBody.appendChild(newRow);
    }

}

function deleteFilm(filmId) {

    // Also remove the film from the films array
    films = films.filter(film => film.id != filmId);

    // Re-render the film list after deletion, keeping the active filter
    const activeFilter = document.querySelector(".list-group-item.active");
    const filter = activeFilter ? activeFilter.textContent : 'All';

    console.log(filmId);
    console.log(films);
    const filteredFilms = filterFilms(films, filter);
    clearTable();
    createFilmList(filteredFilms);
}

// --- Main --- //

// Create data structure
let films = DB.map(e => new Film(...e));

films.forEach(e => console.log(e.str()));

// Populate the list in the HTML ...
createFilmList(films);

//All filter by default green
const allFilter = document.getElementById('all');
allFilter.style.backgroundColor = 'green';
allFilter.style.color = 'white';

// Get all the list items in the list group
const listItems = document.querySelectorAll('.list-group-item');

// Loop through each item and add a click event listener
listItems.forEach(item => {
    item.addEventListener('click', event => {
        console.log(`${item.textContent} clicked`);
        // Reset the background color for all items
        listItems.forEach(otherItem => {
            otherItem.style.backgroundColor = '';  // Clear any previously set background color
            otherItem.style.color = '';           // Reset text color
            otherItem.classList.remove('active');
        });

        // Set the background color to green and text color to white for the clicked item
        item.style.backgroundColor = 'green';
        item.style.color = 'white';
        item.classList.add('active');

        clearTable(); // Clear the table before updating
        const filteredFilms = filterFilms(films, item.textContent);
        createFilmList(filteredFilms);

    });
});
