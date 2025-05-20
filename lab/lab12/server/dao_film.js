"use strict"
const dayjs = require('dayjs');
let now = dayjs();

const sqlite = require('sqlite3');
const db = new sqlite.Database('films.db', // DB filename
    (err) => { if (err) throw err; });



function Film(id, title, favourite = false, date = undefined, rating = "not assigned") {
    this.id = id;
    this.title = title;
    this.favourite = favourite;
    if (date != undefined) { this.date = dayjs(date); }
    else this.date = date;
    this.rating = rating;
}


exports.dbGetAllFilm =()=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films',
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    //console.log(rows);
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                    resolve(films);
                }
            });
    });
}
exports.dbGetFilm =(id)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where id = ?',id,
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    //console.log(rows);
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                    resolve(films);
                }
            });
    });
}
exports.dbGetFavouriteFilm=async()=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where favorite==1',
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    //console.log(rows);
                    //console.log(rows[0].watchdate);
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                    resolve(films);
                }
            });
    });
}
exports.dbGetBestFilm=async()=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where rating >= 5',
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                    resolve(films);
                }
            });
    });
}
exports.dbGetUnseenFilm=async()=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where watchDate is NULL',
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                    resolve(films);
                }
            });
    });
}
exports.dbGetLastMonthFilm=async()=> {
    const currentDate=now;
    return new Promise((resolve, reject) => {
        db.all('select * from films where watchDate is not  null AND watchDate >= ? AND watchDate <= ?',
            currentDate.subtract(30, 'day').format('YYYY-MM-DD'),
            currentDate.format('YYYY-MM-DD'),
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                    resolve(films);
                }
            });
    });
}
exports.dbGetWatchedEarlierThan=async (date)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where watchdate < ?', date,
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                    resolve(films);
                }
            });
    });
}
exports.insert=async (film)=> {
    return new Promise((resolve, reject) => {

        db.run('insert into films (title,favorite,watchdate,rating) values( ?, ?, ?, ?)',
            film.title, film.favorite, dayjs(film.date).format('YYYY-MM-DD'), film.rating, (err) => {
                if (err){
                    console.error('Database insertion error: ', err); // Log the error for debugging
                    reject(err);
                } 
                else{
                    resolve('Done');
                }
            });
    });
}
exports.deleted=async(id)=> {
    return new Promise((resolve, reject) => {

        db.run('delete from films where id == ?',
            id, (err) => {
                if (err) reject(err);
                else resolve('Done');
            });
    });
}
exports.printFilmdb=async(all)=>{
    for (let i of all) {
        let tmp = "";
        tmp += "ID: " + i.id + "\tTitle: " + i.title + "    \tFavourite: " + (i.favourite ? true : false);
        tmp += "  \tDate: " + (i.date ? i.date.format('MMMM D, YYYY') : undefined);
        tmp += "  \tRating: " + i.rating;
        console.log(tmp);
    }

}

exports.updateFavourite=async (film)=> {
    return new Promise((resolve, reject) => {

        db.run('update films set favorite = ? where id = ? ',
            film.favourite,film.id, (err) => {
                if (err){
                    console.error('Database insertion error: ', err); // Log the error for debugging
                    reject(err);
                } 
                else{
                    resolve('Done');
                }
            });
    });
}

exports.updateFilm=async (film)=> {
    return new Promise((resolve, reject) => {

        db.run('update films set title=?,favorite=?,watchDate=?,rating=? where id = ? ',
            film.title,film.favorite,film.watchDate,film.rating,film.id,
             (err) => {
                if (err){
                    console.error('Database insertion error: ', err); // Log the error for debugging
                    reject(err);
                } 
                else{
                    resolve('Done');
                }
            });
    });
}

exports.updateRating=async (film)=> {
    return new Promise((resolve, reject) => {

        db.run('update films set rating =rating + ? where id = ? ',
            film.deltaRating,film.id, (err) => {
                if (err){
                    console.error('Database insertion error: ', err); // Log the error for debugging
                    reject(err);
                } 
                else{
                    resolve('Done');
                }
            });
    });
}

exports.dbcheckID= async (id)=>{
    return new Promise((resolve, reject) => {
        db.all('select id from films',
            (err, rows) => {
                if (err)
                    reject(err);
                else {
                    if (rows.filter(f=>f.id == id).length>0){
                        resolve("id present")
                    }
                    else{
                        reject("not a valid id")
                        //console.log(rows.filter(f=>f.id ==id))
                    }
                }
            });
    });
}
