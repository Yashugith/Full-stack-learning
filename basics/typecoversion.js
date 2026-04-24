let val;
//number to string
val = 5;
console.log(val);
console.log(typeof val);
console.log(val.length);
val = String(533);
console.log(val);
console.log(typeof val);
console.log(val.length);

//boolean into string
let bool = true;
console.log(bool);
console.log(typeof bool);
bool= String(false);
console.log(bool);
console.log(typeof bool);
console.log(bool.length);

//date into string
let yestarday;
yestarday = new Date();
console.log(yestarday);
console.log(typeof yestarday);
yestarday = String(new Date());
console.log(yestarday);
console.log(typeof yestarday);
console.log(yestarday.length);

//array into string
let arr = [1,2,3,4,5];
console.log(arr);
console.log(typeof arr);
console.log(arr.length);
arr = String([1,2,3,4,5]);
console.log(arr);
console.log(typeof arr);
console.log(arr.length);

//toString() method
val = (5).toString();
console.log(val);
console.log(typeof val);
console.log(val.length);

//same in bool 
booln=(true).toString();
console.log(booln);
console.log(typeof booln);
console.log(booln.length);

//string to number
let str= "1234";
console.log(str);
console.log(typeof str);
str=Number(1234);
console.log(str);
console.log(typeof str);
console.log(str.toFixed());

let str1= Number("hello");
console.log(str1);
console.log(typeof str1);
console.log(str1.toFixed());

val = Number(true);
val - Number(false);
val = Number(null);

//parseInt()
val = parseInt("5");
console.log(val);
console.log(typeof val);

//type conversion
const val1 = "4";
const val2= 5;
const sum= val1+val2;
console.log(sum);
console.log(typeof sum);
