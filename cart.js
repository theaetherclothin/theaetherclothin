// AETHER CART SYSTEM (LOCALSTORAGE + STRIPE CHECKOUT)

const CART_KEY = "aether_cart";

// -------------------------
// CART STORAGE
// -------------------------
function getCart() {
  const stored = localStorage.getItem(CART_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

// -------------------------
// ADD TO CART
// -------------------------
function addToCart(item) {
  const cart = getCart();

  const existing = cart.find(
    (i) => i.id === item.id && i.size === item.size
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
}

// -------------------------
// REMOVE ITEM
// -------------------------
function removeFromCart(index) {
  const cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

// -------------------------
// CART COUNT (HEADER)
// -------------------------
function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

// -------------------------
// SHOP PAGE — ADD TO CART BUTTONS
// -------------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const productEl = e.target.closest(".product");

    const id = productEl.dataset.id;
    const name = productEl.dataset.name;
    const price = parseFloat(productEl.dataset.price);

    const sizeSelect = productEl.querySelector(".size-select");
    const size = sizeSelect ? sizeSelect.value : "M";

    addToCart({ id, name, price, size });
  }
});

// -------------------------
// CART PAGE — RENDER ITEMS
// -------------------------
function renderCart() {
  const container = document.getElementById("cart-items");
  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById("cart-total").textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div class="cart-item-info">
        <strong>${item.name}</strong>
        <span>Size: ${item.size}</span>
        <span>Qty: ${item.quantity}</span>
      </div>

      <div>
        <span>$${lineTotal.toFixed(2)}</span>
        <button data-index="${index}" class="remove-item">Remove</button>
      </div>
    `;

    container.appendChild(div);
  });

  document.getElementById("cart-total").textContent = total.toFixed(2);
}

// -------------------------
// REMOVE BUTTONS
// -------------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-item")) {
    const index = parseInt(e.target.dataset.index, 10);
    removeFromCart(index);
  }
});

// -------------------------
// CHECKOUT (STRIPE)
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  updateCartCount();
  renderCart();

  const checkoutBtn = document.getElementById("checkout-button");

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", async () => {
      const cart = getCart();
      if (cart.length === 0) return;

      const response = await fetch("http://localhost:4242/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cart }),
      });

      const data = await response.json();

      if (data.url) {
        window.location = data.url;
      }
    });
  }
});
