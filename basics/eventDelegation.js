//Event bubbling

const child = document.querySelector(".card-title");

child.addEventListener("click",
    function(e){
        console.log("child clicked");
        e.preventDefault();
    });

const parent = document.querySelector(".card-content");

parent.addEventListener("click",
    function(e){
        console.log("parent clicked");
        e.preventDefault();
    });

      document.querySelector(".card").addEventListener("click",
        function(e){
            console.log("card clicked");
        });


//Event delegation
document.body.addEventListener("click",removeEvent);

function removeEvent(e){
    console.log("Item removed");
    console.log(e);
    console.log(e.target);
    if(e.target.parentElement.classList.contains("delete-item")){
        e.target.parentElement.parentElement.remove();
    }
}
