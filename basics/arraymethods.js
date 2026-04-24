const numbers=[43 , 45 , 41 , 46 , 44 , 42];
const number = new Array(22 , 24, 33,47,50);
const fruits2=["apple", "banana","magngo"];
const mixed = [22, "hello", true , undefined , null];
let val7;
console.log(fruits2);

//get the length of array
val7 =numbers.length;

//check is it array
val7 = Array.isArray(numbers);

//to get single value
val7 = numbers[3];

//insert r replace
numbers[2] = 100;

//finding the index value
val7 = numbers.indexOf(36);

//mutating the array
//add a number to the end of an array
val7 = numbers.push(3);


//add to the front of array
numbers.unshift(120);

//remove last value of array
numbers.pop();

//remove the first number of array
numbers.shift();

//splicing , it delete from back
numbers.splice(1,3);

//reverse the array
numbers.reverse();

//concat the array
val7 = numbers.concat(number);

//sort
val7= fruits.sort();

//numbers sorting
val7 = number.sort();
val =numbers.sort(function (x, y){
    return x-y;
});

val =numbers.sort(function (x, y){
    return y-x;
});
console.log(numbers);
console.log(val7);
