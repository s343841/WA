"use strict"

const userNames= "Luigi De Russis, Luca Mannella, Fulvio Corno, Juan Pablo Saenz Moreno, Enrico Masala, Antonio Servetti";
const names=userNames.split(",");
for(let i=0;i<names.length;i++){
    names[i]=names[i].trim();
}
console.log(userNames);
console.log(names);

const acronym = [];

for(const name of names){
    let str=name[0].toUpperCase();
    for(let i = 1; i < name.length; i++){
        if(name[i-1] === ' '){
            str = str + name[i].toUpperCase();
        }
    }
    acronym.push(str);
    console.log(str);
}
console.log(acronym.sort());
