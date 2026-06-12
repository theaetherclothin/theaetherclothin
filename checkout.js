// -------------------------
// LOAD CART
// -------------------------
const cart = JSON.parse(localStorage.getItem("aether_cart")) || [];
let cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

// DISCOUNT SYSTEM
let discountValue = 0;
let discountApplied = false;

const discountCodes = {
  "AETHER10": { type: "percent", amount: 10 },
  "AETHER20": { type: "percent", amount: 20 },
  "WELCOME5": { type: "fixed", amount: 5 },
  "FREESHIP": { type: "fixed", amount: 10 }
};

// -------------------------
// RENDER SUMMARY
// -------------------------
function renderCheckoutSummary() {
  const summaryContainer = document.getElementById("checkout-summary");

  if (cart.length === 0) {
    summaryContainer.innerHTML = "<p>Your cart is empty.</p>";
    return;
  }

  summaryContainer.innerHTML = `
    ${cart
      .map(
        item => `
        <div class="summary-item">
          <strong>${item.name}</strong><br>
          Size: ${item.size}<br>
          Qty: ${item.quantity}<br>
          $${(item.price * item.quantity).toFixed(2)}
        </div>
      `
      )
      .join("")}
    <p class="summary-total">Total: $${cartTotal.toFixed(2)}</p>
  `;
}

// -------------------------
// APPLY DISCOUNT
// -------------------------
function applyDiscount() {
  const code = document.getElementById("discount-code").value.trim().toUpperCase();
  const message = document.getElementById("discount-message");

  if (discountApplied) {
    message.textContent = "A discount has already been applied.";
    return;
  }

  if (!discountCodes[code]) {
    message.textContent = "Invalid discount code.";
    return;
  }

  const discount = discountCodes[code];

  if (discount.type === "percent") {
    discountValue = cartTotal * (discount.amount / 100);
  } else {
    discountValue = discount.amount;
  }

  discountApplied = true;
  cartTotal = Math.max(0, cartTotal - discountValue);

  message.textContent = `Discount applied: -$${discountValue.toFixed(2)}`;

  renderCheckoutSummary();
}

// -------------------------
// VALIDATION
// -------------------------
function validateFields() {
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const address = document.querySelector("#address").value.trim();
  const payment = document.querySelector("input[name='payment']:checked");

  if (!/^[A-Za-z\s]{2,40}$/.test(name)) return alert("Please enter a valid name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return alert("Please enter a valid email.");
  if (address.length < 5) return alert("Please enter a valid address.");
  if (!payment) return alert("Please select a payment method.");

  return true;
}

// -------------------------
// SUBMIT ORDER
// -------------------------
async function submitOrder() {
  if (!validateFields()) return;

  document.getElementById("loading-overlay").style.display = "flex";

  const paymentMethod = document.querySelector("input[name='payment']:checked").value;

  const orderData = {
    name: document.querySelector("#name").value.trim(),
    email: document.querySelector("#email").value.trim(),
    address: document.querySelector("#address").value.trim(),
    items: cart,
    total: cartTotal,
    discount: discountValue,
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
      window.location.href = `success.html?orderId=${result.orderId}&payment=${paymentMethod}`;
    } else {
      alert("Error: " + result.error);
      document.getElementById("loading-overlay").style.display = "none";
    }
  } catch (err) {
    alert("Network error — please try again.");
    document.getElementById("loading-overlay").style.display = "none";
  }
}

// -------------------------
// INIT
// -------------------------
document.addEventListener("DOMContentLoaded", renderCheckoutSummary);
document.getElementById("apply-discount-btn").addEventListener("click", applyDiscount);
document.getElementById("place-order-btn").addEventListener("click", submitOrder);
