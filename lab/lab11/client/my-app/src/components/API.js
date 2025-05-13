/**
 * All the API calls
 */

import dayjs from "dayjs";
import {Film} from "../app.js"

const URL = 'http://localhost:3000/api';

async function getAllFilm(){
    const response = await fetch(URL+`/films`);
    const films = await response.json();
    console.log(films);
    if (response.ok) {
        const e = films.map(film => new Film(
            film.id,
            film.title,
            film.favourite,  
            film.date?dayjs(film.date):'',       
            film.rating     
        ));
        return e;
    } else {
        throw films;  // expected to be a json object (coming from the server) with info about the error
    }
}


async function getFavoriteFilm(){
    const response = await fetch(URL+`/films?filter=favorite`);
    const films = await response.json();
    console.log("favourite:"+films);
    if (response.ok) {
        const e = films.films.map(film => new Film(
            film.id,
            film.title,
            film.favourite,  
            film.date?dayjs(film.date):'',       
            film.rating     
        ));
        return e;
    } else {
        throw films;  // expected to be a json object (coming from the server) with info about the error
    }
}
async function getBestFilm(){
    const response = await fetch(URL+`/films?filter=best`);
    const films = await response.json();
    console.log("best:"+films);
    if (response.ok) {
        const e = films.films.map(film => new Film(
            film.id,
            film.title,
            film.favourite,  
            film.date?dayjs(film.date):'',       
            film.rating     
        ));
        return e;
    } else {
        throw films;  // expected to be a json object (coming from the server) with info about the error
    }
}
async function getLastMonthFilm(){
    const response = await fetch(URL+`/films?filter=lastmonth`);
    const films = await response.json();
    console.log("last month:"+films);
    if (response.ok) {
        const filmsArray = Array.isArray(films.films) ? films.films : (Array.isArray(films) ? films : []);
        const e = filmsArray.map(film => new Film(
            film.id,
            film.title,
            film.favourite,  
            film.date?dayjs(film.date):'',       
            film.rating     
        ));
        return e;
    } else {
        throw films;  // expected to be a json object (coming from the server) with info about the error
    }
}
async function getUnseenFilm(){
    const response = await fetch(URL+`/films?filter=unseen`);
    const films = await response.json();
    
    if (response.ok) {
        const e = films.films.map(film => new Film(
            film.id,
            film.title,
            film.favourite,  
            film.date?dayjs(film.date):'',       
            film.rating     
        ));
        console.log("unseen:"+e);
        return e;
    } else {
        throw films;  // expected to be a json object (coming from the server) with info about the error
    }
}

const API = {getAllFilm, getFavoriteFilm,getBestFilm,getLastMonthFilm,getUnseenFilm};

export default API;