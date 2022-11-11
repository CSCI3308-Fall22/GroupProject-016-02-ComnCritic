const noButton = document.querySelector('.sko');
const noButton1 = document.querySelector('.no'); //grabs certain button, grabs skono class
noButton.addEventListener('click', sko); //if nobutton is clicked then run test
noButton1.addEventListener('click', no);

function sko(){
    alert("hi "); // change function to when pressed takes you to all the skod(liked movies)
}
function no()
{
    alert("this one works as well"); // Change function to when pressed take you to No'd (disliked movies)
}