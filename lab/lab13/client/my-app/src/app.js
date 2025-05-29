'use strict';
import API from './components/API.js'
import dayjs from "dayjs";
// const DB = [
//     // id, title, favourite, date, rating
//     [1, 'Pulp Fiction', 1, '2024-03-10', 5],
//     [2, '21 Grams', 1, '2025-03-17', 4],
//     [3, 'Star wars', 0, '', 0],
//     [4, 'Matrix', 0, '', 0],
//     [5, 'Shrek', 0, '2025-03-21', 2]
// ];

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
    
    this.films = [];


    this.str = function () {
        const formattedDate = this.date ? this.date.format('YYYY-MM-DD') : '';
        return `${this.id}: ${this.title} ${this.favourite} ${formattedDate} ${this.rating}`
    }

}

async function filterFilms(films, filter) {
    if (filter === 'All') {
        return await API.getAllFilm();
    }
    if (filter === 'Favourite') {
        
        return await API.getFavoriteFilm();
    }
    if (filter === 'Best Rated') {
        return await API.getBestFilm();
    }
    if (filter === 'Seen last month') {
        const lastMonth = dayjs().subtract(1, 'month');
        return await API.getLastMonthFilm();
    }
    if (filter === 'Unseen') {
        return await API.getUnseenFilm();
    }
}


export {Film,filterFilms}



