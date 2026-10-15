
let searchInput = document.querySelector("#search-box");
let cards = document.querySelectorAll(".card-box, .mini");
let container = document.querySelector("#container");

// No-results message create karna
let noResults = document.createElement("p");
noResults.textContent = "No matching categories found.";
noResults.style.display = "none";
noResults.style.textAlign = "center";
noResults.style.padding = "20px";
noResults.style.fontSize = "18px";

container.insertAdjacentElement("afterend", noResults);

searchInput.addEventListener("input", function (e) {
    let searchText = e.target.value.toLowerCase().trim();
    let visibleCards = 0;

    cards.forEach((card) => {
        let heading = card.querySelector("h3");
        let headingText = heading.textContent.toLowerCase();

        let isMatch = headingText.includes(searchText);

        if (isMatch) {
            card.style.display = "";
            visibleCards++;
        } else {
            card.style.display = "none";
        }
    });

    if (visibleCards === 0) {
        noResults.style.display = "block";
    } else {
        noResults.style.display = "none";
    }
});
