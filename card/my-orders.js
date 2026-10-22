
const ORDERS_STORAGE_KEY = "amazonCloneOrders";

const ordersList = document.querySelector("#orders-list");
const ordersEmpty = document.querySelector("#orders-empty");

function formatPrice(price) {
  return `₹${Number(price || 0).toLocaleString("en-IN")}`;
}

function formatDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function createOrderItem(item) {
  const product = document.createElement("div");
  product.className = "order-item";

  if (typeof item.image === "string" && item.image.trim()) {
    const image = document.createElement("img");
    image.src = item.image;
    image.alt = item.title || "Product";
    image.loading = "lazy";

    image.onerror = () => image.remove();

    product.appendChild(image);
  }

  const details = document.createElement("div");
  details.className = "order-item-details";

  const title = document.createElement("h3");
  title.textContent = item.title || "Product";

  const quantity = document.createElement("p");
  quantity.textContent = `Quantity: ${item.quantity || 1}`;

  const price = document.createElement("p");
  price.textContent = `Price: ${formatPrice(item.price)}`;

  details.append(title, quantity, price);

  const itemTotal = document.createElement("div");
  itemTotal.className = "order-item-price";
  itemTotal.textContent = formatPrice(
    Number(item.price || 0) * Number(item.quantity || 1)
  );

  product.append(details, itemTotal);

  return product;
}

function createOrderCard(order) {
  const card = document.createElement("article");
  card.className = "order-card";

  const header = document.createElement("div");
  header.className = "order-header";

  const meta = document.createElement("div");
  meta.className = "order-meta";

  const dateInfo = document.createElement("p");
  dateInfo.textContent = "ORDER PLACED";

  const dateValue = document.createElement("strong");
  dateValue.textContent = formatDate(order.createdAt);
  dateInfo.appendChild(dateValue);

  const totalInfo = document.createElement("p");
  totalInfo.textContent = "TOTAL";

  const totalValue = document.createElement("strong");
  totalValue.textContent = formatPrice(order.total);
  totalInfo.appendChild(totalValue);

  meta.append(dateInfo, totalInfo);

  const id = document.createElement("p");
  id.className = "order-id";
  id.textContent = "ORDER ID";

  const idValue = document.createElement("strong");
  idValue.textContent = order.orderId || "Unavailable";
  id.appendChild(idValue);

  header.append(meta, id);

  const body = document.createElement("div");
  body.className = "order-body";

  const items = Array.isArray(order.items) ? order.items : [];

  items.forEach((item) => {
    if (item && typeof item === "object") {
      body.appendChild(createOrderItem(item));
    }
  });

  const total = document.createElement("div");
  total.className = "order-total";
  total.textContent = `Order total: ${formatPrice(order.total)}`;

  body.appendChild(total);
  card.append(header, body);

  return card;
}

function renderOrders() {
  let orders = [];

  try {
    const savedOrders = localStorage.getItem(ORDERS_STORAGE_KEY);
    const parsedOrders = savedOrders ? JSON.parse(savedOrders) : [];

    orders = Array.isArray(parsedOrders) ? parsedOrders : [];
  } catch (error) {
    console.error("Could not load order history:", error);
  }

  ordersList.replaceChildren();

  if (orders.length === 0) {
    ordersEmpty.hidden = false;
    return;
  }

  ordersEmpty.hidden = true;

  orders.forEach((order) => {
    if (order && typeof order === "object") {
      ordersList.appendChild(createOrderCard(order));
    }
  });
}

renderOrders();
