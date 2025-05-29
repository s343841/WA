/**
 * All the API calls
 */

import dayjs from "dayjs";
import {Film} from "../app.js"

const URL = 'http://localhost:3000/api';

async function getAllFilm(){
    const response = await fetch(URL+`/films`, {
  credentials: 'include'
});
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
    const response = await fetch(URL+`/films?filter=favorite`, {
  credentials: 'include'
});
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
    const response = await fetch(URL+`/films?filter=best`, {
  credentials: 'include'
});
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
    const response = await fetch(URL+`/films?filter=lastmonth`, {
  credentials: 'include'
});
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
    const response = await fetch(URL+`/films?filter=unseen`, {
  credentials: 'include'
});
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

function addFilm(film) {
    // call  POST /api/answers
    return new Promise((resolve, reject) => {
      fetch(URL+`/films`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(Object.assign({}, film, {watchDate: film.date.format("YYYY-MM-DD")})),
      }).then((response) => {
        if (response.ok) {
          response.json()
            .then((film) => resolve(film))
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  
  function deleteFilm(id) {
    // call  DELETE /api/films/<id>
    return new Promise((resolve, reject) => {
      fetch(URL+`/films/${id}`, {
        method: 'DELETE',
        credentials:'include'
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }
  
  function updateFilm(film) {
    // call  PUT /api/films/<id>
    return new Promise((resolve, reject) => {
      fetch(URL+`/films/${film.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials:'include',
        body: JSON.stringify(Object.assign({}, film, {favorite: film.favourite,watchDate: film.date.format("YYYY-MM-DD")})),
      }).then((response) => {
        if (response.ok) {
          resolve(null);
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
  }

async function logIn(credentials) {
  let response = await fetch(URL + '/sessions', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (response.ok) {
    const user = await response.json();
    return user;
  } else {
    const errDetail = await response.json();
    throw errDetail.message;
  }
}

async function logOut() {
  await fetch(URL+'/sessions/current', {
    method: 'DELETE', 
    credentials: 'include' 
  });
}

async function getUserInfo() {
  const response = await fetch(URL+'/sessions/current', {
    credentials: 'include'
  });
  const userInfo = await response.json();
  if (response.ok) {
    return userInfo;
  } else {
    throw userInfo;  // an object with the error coming from the server
  }
}

function totpVerify(totpCode) {
    // call  POST /api/login-totp
    return new Promise((resolve, reject) => {
      fetch(URL+`/login-totp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({code: totpCode}),
      }).then((response) => {
        if (response.ok) {
          response.json()
            .then(() => resolve())
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        } else {
          // analyze the cause of error
          response.json()
            .then((message) => { reject(message); }) // error message in the response body
            .catch(() => { reject({ error: "Cannot parse server response." }) }); // something else
        }
      }).catch(() => { reject({ error: "Cannot communicate with the server." }) }); // connection errors
    });
}



const API = {getAllFilm, getFavoriteFilm,getBestFilm,getLastMonthFilm,
    getUnseenFilm,addFilm,deleteFilm,updateFilm,logIn,logOut,getUserInfo};

export default API;