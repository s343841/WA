"use strict"

const array = ["it", "Volvo", "BMW","prova","Lorem", "", "dolor", "sit", "amet"];
for (let i of array){
    let computed = ""
    if(i.length==0) console.log("");
    else if(i.length==2) console.log(i.repeat(2));
    //else if(i.length==3)  console.log(i.slice(0,2)+i.slice(-2,));
    else console.log(i.slice(0,2)+i.slice(-2,));
}

