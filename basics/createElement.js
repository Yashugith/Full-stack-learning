const li = document.createElement("li");

//add class
li.className = "list-group-item";

//add id
li.id = "new-item";

//add attribute
li.setAttribute("title", "New Item");

//create text node and append
const text =document.querySelector("ul.list-group");
li.appendChild(document.createTextNode("Hello world"));
text.appendChild(li);

console.log(li);
