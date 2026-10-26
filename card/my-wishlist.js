const WISHLIST_KEY = "amazonCloneWishlist";
const CART_KEY = "amazonCloneCart";

const wishlistProducts = document.querySelector("#wishlist-products");
const wishlistEmpty = document.querySelector("#wishlist-empty");

// Load wishlist from Local Storage
function loadWishlist() {
  try {
    const saved = localStorage.getItem(WISHLIST_KEY);
    const items = saved ? JSON.parse(saved) : [];

    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Could not load wishlist:", error);
    return [];
  }
}

// Save wishlist to Local Storage
function saveWishlist(items) {
  try {
    localStorage.setItem(
      WISHLIST_KEY,
      JSON.stringify(items)
    );
    return true;
  } catch (error) {
    console.error("Could not save wishlist:", error);
    alert("Unable to save wishlist. Please try again.");
    return false;
  }
}

// Display wishlist products
function renderWishlist() {
  const items = loadWishlist();

  wishlistProducts.replaceChildren();

  items.forEach((item) => {
    if (
      !item ||
      typeof item.id !== "string" ||
      typeof item.title !== "string" ||
      typeof item.price !== "number"
    ) {
      return;
    }

    const card = document.createElement("article");
    card.className = "wishlist-card";

    // Product image
    if (item.image) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.title;
      image.loading = "lazy";

      image.onerror = () => image.remove();

      card.appendChild(image);
    }

    // Product title
    const title = document.createElement("h3");
    title.textContent = item.title;

    // Product price
    const price = document.createElement("p");
    price.className = "wishlist-price";
    price.textContent =
      `₹${item.price.toLocaleString("en-IN")}`;

    // Add to Cart button
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "wishlist-add-cart";
    addButton.dataset.id = item.id;
    addButton.textContent = "Add to Cart";

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "remove-wishlist-btn";
    removeButton.dataset.id = item.id;
    removeButton.textContent = "Remove";

    card.append(
      title,
      price,
      addButton,
      removeButton
    );

    wishlistProducts.appendChild(card);
  });

  // Show empty message when there are no products
  wishlistEmpty.hidden =
    wishlistProducts.children.length > 0;
}

// Handle Add to Cart and Remove clicks
wishlistProducts.addEventListener("click", (event) => {
  const addButton = event.target.closest(
    ".wishlist-add-cart"
  );

  const removeButton = event.target.closest(
    ".remove-wishlist-btn"
  );

  if (!addButton && !removeButton) return;

  const productId = (addButton || removeButton).dataset.id;
  const wishlist = loadWishlist();

  const item = wishlist.find(
    (product) => product.id === productId
  );

  if (!item) return;

  // Add product to Cart
  if (addButton) {
    try {
      const savedCart = localStorage.getItem(CART_KEY);
      const cart = savedCart ? JSON.parse(savedCart) : [];

      if (!Array.isArray(cart)) {
        alert("Cart data is invalid.");
        return;
      }

      const existing = cart.find(
        (product) => product.id === item.id
      );

      if (existing) {
        existing.quantity =
          (Number(existing.quantity) || 0) + 1;
      } else {
        cart.push({
          ...item,
          quantity: 1
        });
      }

      localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
      );

      alert("Product added to cart!");
    } catch (error) {
      console.error("Could not update cart:", error);
      alert("Unable to update cart. Please try again.");
    }
  }

  // Remove product from Wishlist
  if (removeButton) {
    const updatedWishlist = wishlist.filter(
      (product) => product.id !== productId
    );

    if (saveWishlist(updatedWishlist)) {
      renderWishlist();
    }
  }
});

// Initialize wishlist page
renderWishlist();