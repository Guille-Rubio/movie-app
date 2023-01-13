
console.log("linkado");

const form = document.getElementById("form");
form.addEventListener("submit", function (event) {
    event.preventDefault();
    const movie = event.target.elements.title.value;
    console.log(movie);
    window.location = `http://localhost:3000/search/${movie}`
})