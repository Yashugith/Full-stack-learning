/*let val9;

val = document;
val = document.all;
val = document.all[2];
val = document.all.length;
val = document.head;
val = document.body;
val = document.doctype;
val = document.domain;
val = document.URL;
val = document.characterSet;
val = document.contentType;

val =document;
console.log(val);*/

//single element selection
console.log(document.getElementById("task-title"));

//change style
const tile = document.getElementById("task-title");
tile.style.background = "#333";
tile.style.color = "#fff";
tile.style.padding = "10px";
tile.background = "#9d1717";

//change text content
tile.textContent = "microDegree";
tile.innerText = "microDegree";
tile.innerHTML = `<span style="color:red">task list</span>`;

//query selector

console.log(document.querySelector("#task-title"));
console.log(document.querySelector(".card-header"));
console.log(document.querySelector("h5"));
//first element color
document.querySelector("li").style.color = "red";

//color to last element(sudo class)
document.querySelector("li:last-child").style.color = "blue";
document.querySelector("li:nth-child(3)").style.color="green";

//select multiple elements
//document.getElementsByClassName

const items = document.getElementsByClassName("list-group-item");
console.log(items);

//getelementbytagname

const list = document.getElementsByTagName("li");
console.log(list);
list[1].style.color = "blue";

//queryselectorall

const listitems = document.querySelectorAll("li.list-group-item");
console.log(listitems);
list[1].style.color = "blue";

listitems.forEach(function(li){
    li.textContent = "hello";
});

const button =document.querySelector(".clear-task-btn");
///button.addEventListener("click", function(){
   // console.log("hello world");
//

//button.addEventListener("click",function(){
   // alert("clicked");


//button.addEventListener("click",onclick);

//function onclick(e){
  //  console.log(e.target);
    //console.log("hello world");
    //e.target.innerText= "clicked";

//e.preventDefault();
////
