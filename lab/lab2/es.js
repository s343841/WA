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

function FilmLibrary() {
    this.dbGetAllFilm = async function (){
        return new Promise ((resolve,reject)=>{
            db.all('select * from films',
                (err, rows) => {
                    if(err)
                         reject(err);
                    else {
                        //console.log(rows);
                        const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                        resolve(films);
                    }
                }); 
        });       
    }
    this.dbGetFavouriteFilm = async function (){
        return new Promise ((resolve,reject)=>{
            db.all('select * from films where favorite==1',
                (err, rows) => {
                    if(err)
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
    this.dbGetWatchedToday = async function (){
        return new Promise ((resolve,reject)=>{
            db.all('select * from films where watchdate==?',now.format('MMMM D, YYYY'),//"2023-03-17"
                (err, rows) => {
                    if(err)
                         reject(err);
                    else {
                        const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                        resolve(films);
                    }
                }); 
        });       
    }
    this.dbGetWatchedEarlierThan = async function (date){
        return new Promise ((resolve,reject)=>{
            db.all('select * from films where watchdate < ?',date,
                (err, rows) => {
                    if(err)
                         reject(err);
                    else {
                        const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                        resolve(films);
                    }
                }); 
        });       
    }
    this.dbGetScoreGreaterThan = async function (score){
        return new Promise ((resolve,reject)=>{
            db.all('select * from films where rating >= ?',score,
                (err, rows) => {
                    if(err)
                         reject(err);
                    else {
                        const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                        resolve(films);
                    }
                }); 
        });       
    }
    this.dbGetTitle = async function (title){
        return new Promise ((resolve,reject)=>{
            let search="%"+title+"%";
            db.all('select * from films where title like ?',search,
                (err, rows) => {
                    if(err)
                         reject(err);
                    else {
                        const films = rows.map(row => new Film(row.id, row.title, row.favorite, row.watchdate, row.rating));
                        resolve(films);
                    }
                }); 
        });       
    }
    this.dbGetID = async function (){
        return new Promise ((resolve,reject)=>{
            db.all('select id from films',
                (err, rows) => {
                    if(err)
                         reject(err);
                    else {
                        const films = rows.map(row => new Film(row.id));
                        resolve(films);
                    }
                }); 
        });       
    }
    this.insert= async function (film) {
        if(!(film instanceof Film)){
            return Promise.reject("not a Film");
    
        } 
        //check uniqueness of id
        const films = await this.dbGetID();  
        const existingFilm = films.find(f => f.id === film.id);
    
        if (existingFilm) {
            return Promise.reject("ID already present");
        }
        return new Promise( (resolve, reject) => {
            db.run('insert into films (id,title,favorite,watchdate,rating) values(?, ?, ?, ?, ?)',
                film.id,film.title,film.favourite,film.date.format('YYYY-MM-DD'),film.rating, (err) => {
                if (err) reject(err); 
                else resolve('Done');
            });
        }) ;
    }
    this.delete= async function (id) {
        if(!(Number.isInteger(id))){
            return Promise.reject("not a valid Id");
    
        } 
        //check presence of id
        const films = await this.dbGetID();
        const existingFilm = films.find(f => f.id === film.id);

        if (!existingFilm) {
            return Promise.reject("ID not present");
        }
        return new Promise( (resolve, reject) => {

            db.run('delete from films where id == ?',
                id, (err) => {
                if (err) reject(err); 
                else resolve('Done');
            });
        }) ;
    }
    this.deleteWatched= async function () {
        return new Promise( (resolve, reject) => {
        db.run('update films set watchdate = NULL',
                (err) => {
                if (err) reject(err); 
                else resolve(console.log('Done deleting dates'));
            });
        }) ;
    }
}
async function printFilmdb(all){
    for(let i of all){
            let tmp = "";
            tmp += "ID: " + i.id + "\tTitle: " + i.title + "    \tFavourite: " + (i.favourite ? true : false);
            tmp += "  \tDate: " + (i.date ? i.date.format('MMMM D, YYYY') : undefined);
            tmp += "  \tRating: " + i.rating;
            console.log(tmp);
    }
    
}





async function main(){
    let library= new FilmLibrary();
    let all = await library.dbGetAllFilm();
    await printFilmdb(all);
    console.log("****************************");
    const favourite = await library.dbGetFavouriteFilm();
//    await printFilmdb(favourite);
//    console.log("****************************");
    const today = await library.dbGetWatchedToday();
    await printFilmdb(today);
//    console.log("****************************");
    const earlier = await library.dbGetWatchedEarlierThan(dayjs("20230317").format('YYYY-MM-DD'));
//    await printFilmdb(earlier);
//    console.log("****************************");
    const great = await library.dbGetScoreGreaterThan(4);
//    await printFilmdb(great);
//    console.log("****************************");
    const title = await library.dbGetTitle("pulp");
//    await printFilmdb(title);
//    console.log("****************************");
    await library.insert(new Film(0,"Interstellar",true,now,4)).catch((error) => { 
        console.log("Error: ", error);
       });
    all = await library.dbGetAllFilm();
    await printFilmdb(all);
    console.log("****************************");
    /*await library.delete(0);
    all = await library.dbGetAllFilm();
    await printFilmdb(all);
    console.log("****************************");
    await library.deleteWatched();
    all = await library.dbGetAllFilm();
    await printFilmdb(all);
    */
    db.close();
}
main();
