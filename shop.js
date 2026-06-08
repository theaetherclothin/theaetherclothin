const CART_KEY = "aether_cart";

function getCart() {
  return JSON.parse(localStorage.getItem(CART_KEY)) || [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

document.querySelectorAll(".add-to-cart").forEach(button => {
  button.addEventListener("click", () => {
    const product = button.closest(".product");

    const item = {
      id: product.dataset.id,
      name: product.dataset.name,
      price: Number(product.dataset.price),
      size: product.querySelector(".size-select").value,
      quantity: 1
    };

    const cart = getCart();

    const existing = cart.find(i => i.id === item.id && i.size === item.size);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push(item);
    }

    saveCart(cart);

    document.getElementById("cart-count").textContent =
      cart.reduce((sum, i) => sum + i.quantity, 0);

    alert("Added to cart!");
  });
});