<script>
async function submitOrder() {
  const orderData = {
    name: document.querySelector("#name").value,
    email: document.querySelector("#email").value,
    address: document.querySelector("#address").value,
    items: cartItems, // your cart array
    total: cartTotal, // your total price
    payment_method: "card"
  };

  const response = await fetch("http://localhost:3000/order", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();
  console.log(result);

  if (result.success) {
    alert("Order placed! Your order ID is: " + result.orderId);
  } else {
    alert("Error: " + result.error);
  }
}
</script>
// JavaScript Document