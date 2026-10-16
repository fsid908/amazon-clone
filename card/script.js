
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
// Back to Top Button
let topBtn = document.createElement("button");

topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
topBtn.id = "back-to-top";
topBtn.title = "Back to Top";

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
// Clear Search Button
let searchBox = document.querySelector("#search-box");
let clearBtn = document.createElement("button");

clearBtn.textContent = "✕";
clearBtn.title = "Clear Search";
clearBtn.style.cssText =
  "display:none; cursor:pointer; padding:8px; border:0;";

searchBox.insertAdjacentElement("afterend", clearBtn);

searchBox.addEventListener("input", () => {
  clearBtn.style.display = searchBox.value ? "block" : "none";
});

clearBtn.addEventListener("click", () => {
  searchBox.value = "";
  searchBox.dispatchEvent(new Event("input"));
  clearBtn.style.display = "none";
  searchBox.focus();
});
