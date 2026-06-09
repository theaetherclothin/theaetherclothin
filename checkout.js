// AETHER CHECKOUT SYSTEM

// -------------------------
// LOAD REAL CART
// -------------------------
const cart = JSON.parse(localStorage.getItem("aether_cart")) || [];

// Calculate total
let cartTotal = 0;
cart.forEach(item => {
  cartTotal += item.price * item.quantity;
});

// -------------------------
// OPTIONAL: DISPLAY SUMMARY
// -------------------------
function renderCheckoutSummary() {
  const summaryContainer = document.getElementById("checkout-summary");
  if (!summaryContainer) return;

  if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  let html = "";
  cart.forEach(item => {
    html += `
      <div class="summary-item">
        <strong>${item.name}</strong>
        <span>Size: ${item.size}</span>
        <span>Qty: ${item.quantity}</span>
        <span>$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `;
  });

  html += `<p class="summary-total">Total: $${cartTotal.toFixed(2)}</p>`;
  summaryContainer.innerHTML = html;
}

// -------------------------
// SUBMIT ORDER TO BACKEND
// -------------------------
async function submitOrder() {
  const orderData = {
    name: document.querySelector("#name").value,
    email: document.querySelector("#email").value,
    address: document.querySelector("#address").value,
    items: cart,
    total: cartTotal,
    payment_method: "card"
  };

  const response = await fetch("http://localhost:3000/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();

  if (result.success) {
    alert("Order placed! Order ID: " + result.orderId);

    // Clear cart after successful order
    localStorage.removeItem("aether_cart");

    // Redirect to success page (optional)
    // window.location.href = "success.html?orderId=" + result.orderId;

  } else {
    alert("Error: " + result.error);
  }
}

// -------------------------
// INIT
// -------------------------
document.addEventListener("DOMContentLoaded", () => {
  renderCheckoutSummary();
});
