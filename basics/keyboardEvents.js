const form=document.querySelector("form");
const taskInput=document.querySelector("#task");
const titles = document.querySelector("h3");

//form event
form.addEventListener("submit",runEvent);
taskInput.addEventListener("keydown",runEvent);

function runEvent(e){
    console.log(`EVENT TYPE : ${e.type}`);
    console.log(e.target.value);
    taskInput.value = "";
    titles.textContent = taskInput.value;
    
    e.preventDefault();
}
