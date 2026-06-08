const CART_KEY = "aether_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const el = document.getElementById("cart-count");
  if (el) el.textContent = count;
}

function addToCart(item) {
  const cart = getCart();

  const existing = cart.find(i => i.id === item.id && i.size === item.size);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({ ...item, quantity: 1 });
  }

  saveCart(cart);
  alert(item.name + " added to cart!");
}

function renderCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");

  if (!container) return;

  const cart = getCart();
  container.innerHTML = "";

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    if (totalEl) totalEl.textContent = "0.00";
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const lineTotal = item.price * item.quantity;
    total += lineTotal;

    const div = document.createElement("div");
    div.className = "cart-item";

    div.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p>Size: ${item.size}</p>
        <p>Qty: ${item.quantity}</p>
        <p>$${lineTotal.toFixed(2)}</p>
      </div>
      <button class="remove-item" data-index="${index}">Remove</button>
    `;

    container.appendChild(div);
  });

  if (totalEl) totalEl.textContent = total.toFixed(2);
}

document.addEventListener("click", function(e) {
  if (e.target.classList.contains("add-to-cart")) {
    const product = e.target.closest(".product");

    const item = {
      id: product.dataset.id,
      name: product.dataset.name,
      price: Number(product.dataset.price),
      size: product.querySelector(".size-select").value
    };

    addToCart(item);
  }

  if (e.target.classList.contains("remove-item")) {
    const cart = getCart();
    const index = Number(e.target.dataset.index);

    cart.splice(index, 1);
    saveCart(cart);
    renderCart();
  }
});

document.addEventListener("DOMContentLoaded", function() {
  updateCartCount();
  renderCart();

  const checkoutBtn = document.getElementById("checkout-button");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", function() {
      alert("Checkout is not connected yet.");
    });
  }
});
