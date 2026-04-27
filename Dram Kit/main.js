const drumlength=document.querySelectorAll(".drum").length;
console.log(drumlength);

for (let i = 0; i < drumlength; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function (e) {
        makeNoise(this.innerHTML);
        AnimatingButton(this.innerHTML);
    });
}

function makeNoise(key){
    switch (key) {
        case "w":
            const crash = new Audio("sounds/crash.mp3");
            crash.play();
            break;
        case "a":
            const kick = new Audio("sounds/kick.mp3");
            kick.play();
            break;
        case "s":
            const snare = new Audio("sounds/snare.mp3");
            snare.play();
            break;
        case "d":
            const tom1 = new Audio("sounds/low-tom.mp3");
            tom1.play();
            break;
        case "f":
            const tom2 = new Audio("sounds/mid-tom.mp3");
            tom2.play();
            break;
        case "g":
            const tom3 = new Audio("sounds/high-tom.mp3");
            tom3.play();
            break;
        case "h":
            const tom4 = new Audio("sounds/funny-tom.mp3");
            tom4.play();
            break;
        case "j":
            const hihat = new Audio("sounds/hi-hat-amp-clap.mp3");
            hihat.play();
            break;
        default:
            console.log(key);
    }
}

function AnimatingButton(key){
    const activeButton=document.querySelector(`.${key}`);
    activeButton.classList.add("pressed");
    setTimeout(function(){
        activeButton.classList.remove("pressed");
    },100);
}
