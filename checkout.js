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
// SUBMIT ORDER TO BACKEND
// -------------------------
async function submitOrder() {
  const orderData = {
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    address: document.querySelector("#address").value.trim(),
    items: cart,
    total: cartTotal,
    payment_method: "card"
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

      // ⭐ Redirect to success page
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

