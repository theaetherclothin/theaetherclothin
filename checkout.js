// AETHER CHECKOUT SYSTEM

// -------------------------
// LOAD REAL CART
// -------------------------
const cart = JSON.parse(localStorage.getItem("aether_cart")) || [];

// Calculate total
let cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// -------------------------
// DISPLAY SUMMARY
// -------------------------
function renderCheckoutSummary() {
  const summaryContainer = document.getElementById("checkout-summary");
  if (!summaryContainer) return;

  if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  summaryContainer.innerHTML = `
    ${cart
      .map(
        item => `
        <div class="summary-item">
          <strong>${item.name}</strong>
          <span>Size: ${item.size}</span>
          <span>Qty: ${item.quantity}</span>
          <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      `
      )
      .join("")}
    <p class="summary-total">Total: $${cartTotal.toFixed(2)}</p>
  `;
}

// -------------------------
// VALIDATION RULES
// -------------------------
function validateFields() {
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const address = document.querySelector("#address").value.trim();
  const payment = document.querySelector("input[name='payment']:checked");

  // NAME — letters + spaces only
  const nameValid = /^[A-Za-z\s]{2,40}$/.test(name);

  // EMAIL — must be real format
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  // ADDRESS — must be at least 5 characters
  const addressValid = address.length >= 5;

  if (!nameValid) {
    alert("Please enter a valid name.");
    return false;
  }

  if (!emailValid) {
    alert("Please enter a valid email address.");
    return false;
  }

  if (!addressValid) {
    alert("Please enter a valid address.");
    return false;
  }

  if (!payment) {
    alert("Please select a payment method.");
    return false;
  }

  return true;
}

// -------------------------
// SUBMIT ORDER TO BACKEND
// -------------------------
async function submitOrder() {
  if (!validateFields()) return;

  const paymentMethod = document.querySelector("input[name='payment']:checked").value;

  const orderData = {
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    address: document.querySelector("#address").value.trim(),
    items: cart,
    total: cartTotal,
    payment_method: paymentMethod
  };

  try {
    const response = await fetch("https://aether-backend-jcfm.onrender.com/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });

    const result = await response.json();

    if (result.success) {
      localStorage.removeItem("aether_cart");
      window.location.href = `success.html?orderId=${result.orderId}`;
    } else {
      alert("Error: " + result.error);
    }
  } catch (err) {
    alert("Network error — please try again.");
    console.error(err);
  }
}

// -------------------------
// INIT
// -------------------------
document.addEventListener("DOMContentLoaded", renderCheckoutSummary);

