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

  const nameValid = /^[A-Za-z\s]{2,40}$/.test(name);
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const addressValid = address.length >= 5;

  if (!nameValid) return alert("Please enter a valid name.");
  if (!emailValid) return alert("Please enter a valid email address.");
  if (!addressValid) return alert("Please enter a valid address.");
  if (!payment) return alert("Please select a payment method.");

  return true;
}

// -------------------------
// SUBMIT ORDER TO BACKEND
// -------------------------
async function submitOrder() {
  if (!validateFields()) return;

  // Show loading overlay instantly
  document.getElementById("loading-overlay").style.display = "flex";

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
      document.getElementById("loading-overlay").style.display = "none";
    }
  } catch (err) {
    alert("Network error — please try again.");
    console.error(err);
    document.getElementById("loading-overlay").style.display = "none";
  }
}

// -------------------------
// INIT
// -------------------------
document.addEventListener("DOMContentLoaded", renderCheckoutSummary);

// Attach event listener properly
document.getElementById("place-order-btn").addEventListener("click", submitOrder);

