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

/*
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
    */
exports.dbGetAllFilmByUser =(userId)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films WHERE user = ?',userId,
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
exports.dbGetFilm =(id,userId)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where id = ? AND user=?',id,userId,
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
exports.dbGetFavouriteFilm=async(userId)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where favorite==1 AND user=?',userId,
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
exports.dbGetBestFilm=async(userId)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where rating >= 5 and user=?',userId,
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
exports.dbGetUnseenFilm=async(userId)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where watchDate is NULL and user=?',userId,
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
exports.dbGetLastMonthFilm=async(userId)=> {
    const currentDate=now;
    return new Promise((resolve, reject) => {
        db.all('select * from films where watchDate is not  null AND watchDate >= ? AND watchDate <= ? and user=?',
            currentDate.subtract(30, 'day').format('YYYY-MM-DD'),
            currentDate.format('YYYY-MM-DD'),userId,
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
exports.dbGetWatchedEarlierThan=async (date,userId)=> {
    return new Promise((resolve, reject) => {
        db.all('select * from films where watchdate < ? and user=?', date,userId,
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
exports.insert=async (film,userId)=> {
    return new Promise((resolve, reject) => {

        db.run('insert into films (title,favorite,watchdate,rating,user) values( ?, ?, ?, ?,?)',
            film.title, film.favorite, dayjs(film.date).format('YYYY-MM-DD'), film.rating,userId,userId, (err) => {
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
exports.deleted=async(id,userId)=> {
    return new Promise((resolve, reject) => {

        db.run('delete from films where id == ? and user = ?',
            id,userId, (err) => {
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

exports.updateFavourite=async (film,userId)=> {
    return new Promise((resolve, reject) => {

        db.run('update films set favorite = ? where id = ? and user = ? ',
            film.favourite,film.id,userId, (err) => {
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

exports.updateFilm=async (film,userId)=> {
    return new Promise((resolve, reject) => {

        db.run('update films set title=?,favorite=?,watchDate=?,rating=? where id = ? and user = ?',
            film.title,film.favorite,film.watchDate,film.rating,film.id,userId,
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

exports.updateRating=async (film,userId)=> {
    return new Promise((resolve, reject) => {

        db.run('update films set rating =rating + ? where id = ? and user = ? ',
            film.deltaRating,film.id,userId, (err) => {
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
