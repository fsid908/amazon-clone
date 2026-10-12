let searchInput = document.querySelector("#search-box");
let cards = document.querySelectorAll(".cards");
console.log("Total cards:", cards.length);
// console.log(searchInput);
searchInput.addEventListener("input", function (e) {
  let searchText = e.target.value.toLowerCase();
  console.log(searchText);
  cards.forEach((card) => {
    let heading = card.querySelector("h3");
    let headingText = heading.textContent.toLowerCase();

    console.log(headingText);
    let headText = headingText.includes(searchText);
    console.log(headingText, headText);
    if (headText) {
      card.style.display = "";
    } else
         console.log("Hiding card:", headingText);
    card.style.display = "none";

    console.log(headText);
  });
});
