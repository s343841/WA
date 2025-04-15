"use strict"
const dayjs = require('dayjs');
let now=dayjs();

function Film(id,title,favourite=false,date=undefined,rating="not assigned"){
    this.id=id;
    this.title=title;
    this.favourite=favourite;
    if(date != undefined){this.date=dayjs(date);}
        else this.date=date;
    this.rating=rating;
}

function FilmLibrary(){
    this.list=[];
    this.addNewFilm=(film)=>this.list.push(film);

    this.print= function(){
        for(let i of this.list){
            let tmp = "";
            tmp+= "ID: "+i.id+"\tTitle: "+i.title+"    \tFavourite "+i.favourite;
            if(i.date!=undefined){ tmp+="  \tDate: "+i.toString()}
            else tmp+="  \tDate: undefined"
            tmp+="  \tRating: "+i.rating;
            console.log(tmp);
        }   
    }
    this.delete= function(Id){
        this.list=this.list.filter((v)=>v.id != Id);
    }


    this.sortByDate = function(){
        let res=[...this.list].filter((v)=>v.date!=undefined)
            .sort( (a,b) => a.date.diff(b.date) )
        
        res.push(this.list.filter((v)=>v.date==undefined))
        return res;
    }

    this.resetWatchedFilms=()=>
        this.list.forEach(element => {
            element.date=undefined
        });
    


    this.getRated=function(){
        
        for(let i of this.list.filter((v)=>v.rating != "not assigned")){
            let tmp = "";
            tmp+= "ID: "+i.id+"\tTitle: "+i.title+"    \tFavourite "+i.favourite;
            if(i.date!=undefined){ tmp+="  \tDate: "+i.date.toString();}
            else tmp+="  \tDate: undefined"
            tmp+="  \tRating: "+i.rating;
            console.log(tmp);
        }  
    }
    }
let f1=new Film(0,"Interstellar");
//console.log(f1);
let library= new FilmLibrary;
library.addNewFilm(f1);
//library.print();
library.addNewFilm(new Film(1,"Pulp Fiction",true,dayjs("20230310"),5));
library.addNewFilm(new Film(2,"21 Grams",true,undefined,4));
library.addNewFilm(new Film(3,"Star Wars",false,undefined));
library.addNewFilm(new Film(4,"Matrix",false,undefined));
library.addNewFilm(new Film(5,"Shrek",false,undefined,3));
library.print();
console.log("**************");
let temp=library.sortByDate()
console.log(temp);
console.log("**************");
library.delete(2);
library.print();
console.log("**************");
library.getRated();
console.log("**************");
library.resetWatchedFilms();
library.print();