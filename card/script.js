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
    "#bottom-content, .back-to-top-box, .last-bottom-txt, footer",
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
        keywords: card.textContent,
      });
    });

  // Trending, deals and best-seller cards
  document
    .querySelectorAll(".trending-card, .deal-card, .best-seller-card")
    .forEach((card) => {
      const heading =
        card.querySelector(".deal-name") || card.querySelector("h3");

      const img = card.querySelector("img");

      if (!heading) return;

      const price = card.querySelector(".deal-price, .bs-price");

      items.push({
        title: heading.textContent.trim(),
        image: img?.getAttribute("src"),
        alt: img?.getAttribute("alt") || "",
        description: price ? price.childNodes[0].textContent.trim() : "",
        keywords: card.textContent,
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
      item.keywords,
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(query);
  });

  resultsCount.textContent = `${matches.length} result${matches.length === 1 ? "" : "s"} for "${searchInput.value.trim()}"`;

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

/* =====================================
   SHOPPING CART - STAGE 1
   Drawer, overlay and cart count
===================================== */

// Existing header cart link
const cartLink = document.querySelector(
  "#amazon-logo > ul > li:last-child > a",
);

if (cartLink) {
  cartLink.classList.add("cart-icon-link");
  cartLink.setAttribute("href", "#cart-drawer");
  cartLink.setAttribute("aria-label", "Open shopping cart");
}

// Create overlay
const cartOverlay = document.createElement("div");
cartOverlay.id = "cart-overlay";
cartOverlay.setAttribute("aria-hidden", "true");

// Create drawer
const cartDrawer = document.createElement("aside");
cartDrawer.id = "cart-drawer";
cartDrawer.setAttribute("aria-label", "Shopping cart");
cartDrawer.setAttribute("aria-hidden", "true");

cartDrawer.innerHTML = `
  <div class="cart-drawer-header">
    <h2>Your Cart (<span id="cart-header-count">0</span>)</h2>
    <button id="cart-close" type="button" aria-label="Close cart">
      &times;
    </button>
  </div>

  <div id="cart-items">
    <div class="cart-empty">
      <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
      <h3>Your Amazon Clone Cart is empty</h3>
      <p>Add a product to see it here.</p>
    </div>
  </div>

  <div class="cart-drawer-footer">
    <div class="cart-subtotal">
      <span>Subtotal</span>
      <span id="cart-subtotal">₹0.00</span>
    </div>
    <button class="cart-checkout-btn" type="button" disabled>
      Proceed to Buy
    </button>
  </div>
`;

document.body.append(cartOverlay, cartDrawer);

// Cart count badge
let cartBadge = null;

if (cartLink) {
  cartBadge = document.createElement("span");
  cartBadge.className = "cart-count-badge";
  cartBadge.textContent = "0";
  cartBadge.hidden = true;
  cartLink.appendChild(cartBadge);
}

function openCartDrawer() {
  cartOverlay.classList.add("cart-open");
  cartDrawer.classList.add("cart-open");

  cartOverlay.setAttribute("aria-hidden", "false");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  document.querySelector("#cart-close").focus();
}

function closeCartDrawer() {
  cartOverlay.classList.remove("cart-open");
  cartDrawer.classList.remove("cart-open");

  cartOverlay.setAttribute("aria-hidden", "true");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (cartLink) {
    cartLink.focus();
  }
}

if (cartLink) {
  cartLink.addEventListener("click", (event) => {
    event.preventDefault();
    openCartDrawer();
  });
}

cartOverlay.addEventListener("click", closeCartDrawer);

document
  .querySelector("#cart-close")
  .addEventListener("click", closeCartDrawer);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && cartDrawer.classList.contains("cart-open")) {
    closeCartDrawer();
  }
});

/* =====================================
   SHOPPING CART - STAGE 2
   Add products and update cart count
===================================== */

let cartItems = [];

try {
  const savedCart = localStorage.getItem("amazonCloneCart");

  if (savedCart) {
    const parsedCart = JSON.parse(savedCart);

    if (Array.isArray(parsedCart)) {
      cartItems = parsedCart.filter(
        (item) =>
          item &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.price === "number" &&
          Number.isFinite(item.price) &&
          item.price >= 0 &&
          Number.isInteger(item.quantity) &&
          item.quantity > 0 &&
          typeof item.image === "string",
      );
    }
  }
} catch (error) {
  console.error("Could not load saved cart:", error);
  cartItems = [];
}

// Price text ko number mein convert karo
function getProductPrice(priceText) {
  const match = priceText.match(/[\d,]+(?:\.\d{1,2})?/);

  if (!match) return 0;

  return Number(match[0].replace(/,/g, ""));
}

// Product ko cart mein add karo
function addToCart(product) {
  const existingItem = cartItems.find((item) => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cartItems.push({
      ...product,
      quantity: 1,
    });
  }

  updateCartUI();

  showToast(`${product.title} added to cart`);
}

// Cart count aur subtotal update karo
function updateCartUI() {
  const totalQuantity = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  // Header cart count
  const headerCartCount = document.querySelector(".cart-count");

  if (headerCartCount) {
    headerCartCount.textContent = totalQuantity;
  }

  if (cartBadge) {
    cartBadge.textContent = totalQuantity;
    cartBadge.hidden = true;
  }

  // Drawer heading count
  document.querySelector("#cart-header-count").textContent = totalQuantity;

  // Subtotal
  document.querySelector("#cart-subtotal").textContent =
    subtotal.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  // Empty cart state
  const cartItemsContainer = document.querySelector("#cart-items");

  if (cartItems.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="cart-empty">
        <i class="fa-solid fa-cart-shopping" aria-hidden="true"></i>
        <h3>Your Amazon Clone Cart is empty</h3>
        <p>Add a product to see it here.</p>
      </div>
    `;
  } else {
    cartItemsContainer.innerHTML = cartItems
      .map(
        (item) => `
  <article class="cart-stage2-item">
    <img src="${item.image}" alt="${item.title}">

    <div class="cart-item-details">
      <h3>${item.title}</h3>

      <p class="cart-item-price">
        ₹${item.price.toLocaleString("en-IN")}
      </p>

      <div class="cart-quantity-controls">
        <button
          type="button"
          class="quantity-btn"
          data-action="decrease"
          data-id="${item.id}"
          aria-label="Decrease quantity"
        >−</button>

        <span>${item.quantity}</span>

        <button
          type="button"
          class="quantity-btn"
          data-action="increase"
          data-id="${item.id}"
          aria-label="Increase quantity"
        >+</button>
      </div>

      <button
        type="button"
        class="remove-cart-item"
        data-id="${item.id}"
      >Remove</button>
    </div>
    
<button
  type="button"
  class="cart-buy-now-btn"
  data-id="${item.id}"
>
  Buy Now
</button>

  </article>
`,
      )
      .join("");
  }

  // Checkout button only enabled when cart has items
  document.querySelector(".cart-checkout-btn").disabled =
    cartItems.length === 0;

  try {
    localStorage.setItem("amazonCloneCart", JSON.stringify(cartItems));
  } catch (error) {
    console.error("Could not save cart:", error);
    showToast("Cart could not be saved in this browser");
  }
}

const cartItemsContainer = document.querySelector("#cart-items");

cartItemsContainer.addEventListener("click", (event) => {
  const quantityButton = event.target.closest(".quantity-btn");
  const removeButton = event.target.closest(".remove-cart-item");

  if (quantityButton) {
    const productId = quantityButton.dataset.id;
    const action = quantityButton.dataset.action;

    const item = cartItems.find((product) => String(product.id) === productId);

    if (!item) return;

    if (action === "increase") {
      item.quantity += 1;
    } else if (action === "decrease") {
      item.quantity -= 1;

      if (item.quantity <= 0) {
        const index = cartItems.indexOf(item);
        cartItems.splice(index, 1);
      }
    }

    updateCartUI();
  }

  if (removeButton) {
    const productId = removeButton.dataset.id;

    const index = cartItems.findIndex((item) => String(item.id) === productId);

    if (index !== -1) {
      cartItems.splice(index, 1);
      updateCartUI();
      showToast("Product removed from cart");
    }
  }
});

const checkoutButton = document.querySelector(".cart-checkout-btn");
const checkoutSection = document.querySelector("#checkout-section");
const checkoutForm = document.querySelector("#checkout-form");
const backToCartButton = document.querySelector("#back-to-cart");


checkoutButton.addEventListener("click", () => {
  if (cartItems.length === 0) {
    showToast("Your cart is empty!");
    return;
  }

  window.location.href = "checkout.html";
});


backToCartButton.addEventListener("click", () => {
  checkoutSection.hidden = true;
});

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!checkoutForm.reportValidity()) return;

  showToast("Delivery details submitted successfully!");
});

// Add buttons to Deals and Best Sellers

function addCartButtons() {
  const productCards = document.querySelectorAll(
    ".deal-card, .best-seller-card"
  );

  productCards.forEach((card, index) => {
    // Prevent duplicate buttons
    if (card.querySelector(".add-to-cart-btn")) return;

    const titleElement =
      card.querySelector(".deal-name") || card.querySelector("h3");

    const priceElement =
      card.querySelector(".deal-price") || card.querySelector(".bs-price");

    const imageElement = card.querySelector("img");

    if (!titleElement || !priceElement) return;

    const title = titleElement.textContent.trim();
    const price = getProductPrice(priceElement.textContent);

    if (!price) return;

    const product = {
      id: `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
      title,
      price,
      image: imageElement?.getAttribute("src") || "",
    };

    // Add to Cart button
    const button = document.createElement("button");
    button.type = "button";
    button.className = "add-to-cart-btn";
    button.textContent = "Add to Cart";

    button.addEventListener("click", () => {
      addToCart(product);
    });

    card.appendChild(button);

    // Buy Now button
    const buyNowButton = document.createElement("button");
    buyNowButton.type = "button";
    buyNowButton.className = "buy-now-btn";
    buyNowButton.textContent = "Buy Now";

    buyNowButton.addEventListener("click", () => {
      try {
        localStorage.setItem(
          "amazonCloneBuyNow",
          JSON.stringify({
            ...product,
            quantity: 1,
          })
        );

        localStorage.setItem("amazonCloneCheckoutMode", "buyNow");

        window.location.href = "checkout.html";
      } catch (error) {
        console.error("Could not start Buy Now checkout:", error);
        showToast("Unable to start checkout. Please try again.");
      }
    });

    card.appendChild(buyNowButton);
  });
}

addCartButtons();
updateCartUI();

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
  topBtn.style.display = window.scrollY > 300 ? "block" : "none";
});

topBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});
