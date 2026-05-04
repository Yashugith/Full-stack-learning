//string methods
const firstofname = "Vinoda";
const lastofname = "B";
const ages = 22;
const str3 = "hello there my name is vinoda";
const tags = "web design , web development , programming";

let val3 ;
val3 = firstofname + lastofname ;
console.log (val3);

// // concatination
val4 = firstofname + " "+ lastofname;
console.log(val4);

//append method
val4 = "yashu";
val4 += "hamsa";
console.log(val4);

//append
val5 = "hello my name is " + firstofname + " " + lastofname +" "+ "my age is:"+ ages + " " + "tages :"+ tags;
console.log(val5);

//Escaping
val = "thats nice, i cannot wait";
console.log(val);

//length
val = firstofname.length;
console.log(val);

//concat()
val = firstofname.concat(" " ,lastofname);
console.log(val);

//change cases()
val = firstofname.toUpperCase();
val = lastofname.toLocaleLowerCase();
console.log(val);

//the tracking
val = firstofname[2];
console.log(val);

//indexing
val = firstofname.indexOf("a");
console.log(val);

val = lastofname.lastIndexOf("i");
console.log(val);

//charAt()
val = firstofname.charAt("5");
val = lastofname.charAt("0");
console.log(val);
console.log(val);

//substring()
val=firstofname.substring(0,4);
console.log(val);

//slicing
val=firstofname.slice(0,4);
console.log(val);

//split
val = str3.split(" ");
console.log(val);
val = tags.split(" , ");
console.log(val);

//include
val = str3.includes("name");
//console.log(val);

//val - str3.includes("z");
console.log(val);

