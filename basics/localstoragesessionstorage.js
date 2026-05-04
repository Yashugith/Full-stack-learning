/*localStorage.setItem("name","pankajas");
localStorage.setItem("age",24);

const candidate = localStorage.getItem("name");

console.log(candidate);*/



document.getElementById("task-form").addEventListener("submit", 
    addtolocal);

    function addtolocal(e){
        const taskInput = document.getElementById("task-input").value;
        console.log(taskInput);
        localStorage.setItem("task", taskInput);
        e.preventDefault();

    }
