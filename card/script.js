
/* =========================================
   AMAZON CLONE - TOAST NOTIFICATIONS
========================================= */

const toast = document.createElement("div");
toast.id = "amazon-toast";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");

toast.innerHTML = `
  <span class="toast-icon" aria-hidden="true">✓</span>
  <span class="toast-text"></span>
`;

document.body.appendChild(toast);

let toastTimer;

function showToast(message, duration = 2500) {
  const toastText = toast.querySelector(".toast-text");

  // Previous timer ko clear karo
  clearTimeout(toastTimer);

  // Message update karo
  toastText.textContent = message;

  // Notification show karo
  toast.classList.add("toast-visible");

  // Automatically hide after duration
  toastTimer = setTimeout(() => {
    toast.classList.remove("toast-visible");
  }, duration);
}


/* =========================================
   AMAZON CLONE - SEARCH FUNCTIONALITY
========================================= */

const searchInput = document.querySelector("#search-box");
const clearBtn = document.querySelector("#clear-search");

const homeSections = document.querySelectorAll(
  ".background-img, #container, #box, " +
  ".trending-section, .deals-section, .best-sellers, " +
  "#bottom-content, .back-to-top-box, .last-bottom-txt, footer"
);

// Search results area create karo
const resultsSection = document.createElement("section");
resultsSection.id = "search-results";

resultsSection.innerHTML = `
  <div class="search-results-heading">
    <h2>Search results</h2>
    <p id="results-count"></p>
  </div>

  <div id="results-grid"></div>

  <div id="no-results">
    <div class="empty-search-icon">⌕</div>
    <h2>No results found</h2>
    <p>Try checking your spelling or use different keywords.</p>
  </div>
`;

const navigation = document.querySelector(".Navigation");

if (navigation) {
  navigation.insertAdjacentElement("afterend", resultsSection);
}

const resultsGrid = resultsSection.querySelector("#results-grid");
const resultsCount = resultsSection.querySelector("#results-count");
const noResults = resultsSection.querySelector("#no-results");

resultsSection.style.display = "none";


/* =========================================
   COLLECT SEARCHABLE ITEMS
========================================= */

function getSearchItems() {
  const items = [];

  // Category cards
  document
    .querySelectorAll("#container .card-box, #container .mini")
    .forEach((card) => {
      const heading = card.querySelector("h3");
      const img = card.querySelector("img");

      if (!heading) return;

      items.push({
        title: heading.textContent.trim(),
        image: img?.getAttribute("src"),
        alt: img?.getAttribute("alt") || "",
        description: "Category",
        keywords: card.textContent
      });
    });

  // Trending, deals and best-seller cards
  document
    .querySelectorAll(
      ".trending-card, .deal-card, .best-seller-card"
    )
    .forEach((card) => {
      const heading =
        card.querySelector(".deal-name") ||
        card.querySelector("h3");

      const img = card.querySelector("img");

      if (!heading) return;

      const price =
        card.querySelector(".deal-price, .bs-price");

      items.push({
        title: heading.textContent.trim(),
        image: img?.getAttribute("src"),
        alt: img?.getAttribute("alt") || "",
        description: price?.textContent.trim() || "",
        keywords: card.textContent
      });
    });

  return items;
}

const searchItems = getSearchItems();


/* =========================================
   CREATE SEARCH RESULT CARD
========================================= */

function createResultCard(item) {
  const card = document.createElement("article");
  card.className = "search-result-card";

  if (item.image) {
    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.alt || item.title;
    img.loading = "lazy";

    card.appendChild(img);
  }

  const title = document.createElement("h3");
  title.textContent = item.title;
  card.appendChild(title);

  if (item.description) {
    const description = document.createElement("p");
    description.textContent = item.description;
    card.appendChild(description);
  }

  return card;
}


/* =========================================
   PERFORM SEARCH
========================================= */

function performSearch() {
  const query = searchInput.value.trim().toLowerCase();

  if (clearBtn) {
    clearBtn.style.display = query ? "block" : "none";
  }

  // Empty search: homepage restore
  if (!query) {
    resultsSection.style.display = "none";

    homeSections.forEach((section) => {
      section.style.display = "";
    });

    return;
  }

  // Search mode: homepage sections hide
  homeSections.forEach((section) => {
    section.style.display = "none";
  });

  resultsSection.style.display = "block";
  resultsGrid.replaceChildren();

  const matches = searchItems.filter((item) => {
    const searchableText = [
      item.title,
      item.alt,
      item.description,
      item.keywords
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  resultsCount.textContent =
    `${matches.length} result${matches.length === 1 ? "" : "s"} for "${searchInput.value.trim()}"`;

  if (matches.length === 0) {
    noResults.style.display = "block";
    resultsGrid.style.display = "none";
    return;
  }

  noResults.style.display = "none";
  resultsGrid.style.display = "grid";

  matches.forEach((item) => {
    resultsGrid.appendChild(createResultCard(item));
  });
}

if (searchInput) {
  searchInput.addEventListener("input", performSearch);
}


/* =========================================
   CLEAR SEARCH + TOAST
========================================= */

if (clearBtn && searchInput) {
  clearBtn.addEventListener("click", () => {
    // Search clear karo
    searchInput.value = "";

    // Homepage restore karo
    performSearch();

    // Toast notification dikhao
    showToast("Search cleared successfully");

    searchInput.focus();
  });
}


/* =========================================
   BACK TO TOP BUTTON
========================================= */

const topBtn = document.createElement("button");

topBtn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
topBtn.id = "back-to-top";
topBtn.title = "Back to Top";
topBtn.setAttribute("aria-label", "Back to Top");

document.body.appendChild(topBtn);

window.addEventListener("scroll", () => {
  topBtn.style.display =
    window.scrollY > 300 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});
