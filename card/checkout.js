const CART_STORAGE_KEY = "amazonCloneCart";

const checkoutEmpty = document.querySelector("#checkout-empty");
const checkoutContent = document.querySelector("#checkout-content");
const checkoutProducts = document.querySelector("#checkout-products");

const subtotalElement = document.querySelector("#checkout-subtotal");
const deliveryElement = document.querySelector("#checkout-delivery");
const totalElement = document.querySelector("#checkout-total");

let checkoutCart = [];

function loadCheckoutCart() {
  try {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const parsedCart = savedCart ? JSON.parse(savedCart) : [];

    checkoutCart = Array.isArray(parsedCart)
      ? parsedCart.filter(
          (item) =>
            item &&
            typeof item.title === "string" &&
            typeof item.price === "number" &&
            Number.isFinite(item.price) &&
            item.price >= 0 &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0,
        )
      : [];
  } catch (error) {
    console.error("Could not load checkout cart:", error);
    checkoutCart = [];
  }

  renderCheckoutCart();
}

function renderCheckoutCart() {
  if (checkoutCart.length === 0) {
    checkoutEmpty.hidden = false;
    checkoutContent.hidden = true;
    return;
  }

  checkoutEmpty.hidden = true;
  checkoutContent.hidden = false;
  checkoutProducts.replaceChildren();

  let subtotal = 0;

  checkoutCart.forEach((item) => {
    subtotal += item.price * item.quantity;

    const product = document.createElement("div");
    product.className = "checkout-product";

    if (typeof item.image === "string" && item.image.trim()) {
      const image = document.createElement("img");
      image.src = item.image;
      image.alt = item.title;
      product.appendChild(image);
    }

    const details = document.createElement("div");

    const title = document.createElement("p");
    title.textContent = item.title;

    const quantity = document.createElement("p");
    quantity.textContent = `Quantity: ${item.quantity}`;

    const price = document.createElement("strong");
    price.textContent = `₹${(item.price * item.quantity).toLocaleString("en-IN")}`;

    details.append(title, quantity, price);
    product.appendChild(details);
    checkoutProducts.appendChild(product);
  });

  const delivery = 0;
  const total = subtotal + delivery;

  subtotalElement.textContent = `₹${subtotal.toLocaleString("en-IN")}`;
  deliveryElement.textContent =
    delivery === 0 ? "FREE" : `₹${delivery.toLocaleString("en-IN")}`;
  totalElement.textContent = `₹${total.toLocaleString("en-IN")}`;
}

loadCheckoutCart();

const checkoutForm = document.querySelector("#checkout-form");

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (checkoutCart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  if (!checkoutForm.reportValidity()) {
    return;
  }

  const customerName = document.querySelector("#customer-name").value.trim();

  const paymentMethod = document.querySelector("#payment-method").value;

  const subtotal = checkoutCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const orderId = "AMZ" + Date.now().toString().slice(-8);

  const order = {
    orderId,
    customerName,
    phone: document.querySelector("#customer-phone").value.trim(),
    address: [
      document.querySelector("#customer-address").value.trim(),
      document.querySelector("#customer-city").value.trim(),
      document.querySelector("#customer-pincode").value.trim(),
    ].join(", "),
    paymentMethod,
    items: checkoutCart,
    subtotal,
    total: subtotal,
    createdAt: new Date().toISOString(),
  };

  try {
    localStorage.setItem("amazonCloneLastOrder", JSON.stringify(order));
    localStorage.removeItem(CART_STORAGE_KEY);
  } catch (error) {
    console.error("Could not save order:", error);
    alert("Unable to save your demo order. Please try again.");
    return;
  }

  window.location.href = "order-confirmation.html";
});
