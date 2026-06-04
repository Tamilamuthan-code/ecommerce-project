const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    category: "Electronics",
    price: 2499,
    image: "Image/Electronics/headphone.jpg"
  },

  {
    id: 2,
    name: "Formal Shoes",
    category: "Fashion",
    price: 1999,
    image: "Image/Fashion/shoe.jpg"
  },

  {
    id: 3,
    name: "Coffee Maker",
    category: "Kitchen",
    price: 3499,
    image: "Image/Kitchen/coffeemaker.jpg"
  },

  {
    id: 4,
    name: "Badminton Racket",
    category: "Sports",
    price: 799,
    image: "Image/Sports/badminton.jpg"
  },

  {
    id: 5,
    name: "Smartwatch",
    category: "Electronics",
    price: 4999,
    image: "Image/Electronics/smartwatch.jpg"
  },

  {
    id: 6,
    name: "Sunglasses",
    category: "Fashion",
    price: 1299,
    image: "Image/Fashion/sunglass.jpg"
  },

  {
    id: 7,
    name: "Blender",
    category: "Kitchen",
    price: 1799,
    image: "Image/Kitchen/blender.jpg"
  },

  {
    id: 8,
    name: "Cricket Bat",
    category: "Sports",
    price: 2199,
    image: "Image/Sports/cricketbat.jpg"
  },

  {
    id: 9,
    name: "Laptop",
    category: "Electronics",
    price: 49999,
    image: "Image/Electronics/laptop.jpg"
  },

  {
    id: 10,
    name: "Bracelet",
    category: "Fashion",
    price: 599,
    image: "Image/Fashion/bracelet.jpg"
  },

  {
    id: 11,
    name: "Air Fryer",
    category: "Kitchen",
    price: 4299,
    image: "Image/Kitchen/airfryer.jpg"
  },

  {
    id: 12,
    name: "Football",
    category: "Sports",
    price: 699,
    image: "Image/Sports/football.jpg"
  }
];

let cart = {};

function getFilteredProducts() {

  const searchInput = document.getElementById("search-input");
  const categorySelect = document.getElementById("category-select");

  if (!searchInput || !categorySelect) {
    return [];
  }

  const searchValue = searchInput.value.toLowerCase().trim();
  const categoryValue = categorySelect.value;

  return products.filter(function (product) {

    const matchesSearch =
      product.name.toLowerCase().includes(searchValue);

    const matchesCategory =
      categoryValue === "All" ||
      product.category === categoryValue;

    return matchesSearch && matchesCategory;
  });
}

function renderProducts() {

  const grid = document.getElementById("products-grid");
  const countLabel = document.getElementById("product-count");

  if (!grid || !countLabel) return;

  const filteredProducts = getFilteredProducts();

  countLabel.textContent =
    filteredProducts.length + " products found";

  if (filteredProducts.length === 0) {

    grid.innerHTML =
      `<div class="no-results">
         No products found
      </div>`;

    return;
  }

  grid.innerHTML = filteredProducts.map(function (product) {

    const inCart = cart[product.id];

    return `
      <div class="product-card">

        <img
          class="product-img"
          src="${product.image}"
          alt="${product.name}"
        />

        <div class="product-name">
          ${product.name}
        </div>

        <span class="product-cat">
          ${product.category}
        </span>

        <div class="product-price">
          ₹${product.price.toLocaleString()}
        </div>

        <button
          class="add-btn ${inCart ? "added" : ""}"
          onclick="addToCart(${product.id})"
        >
          ${
            inCart
              ? `✓ Added (${inCart.qty})`
              : "+ Add to Cart"
          }
        </button>

      </div>
    `;
  }).join("");
}

function addToCart(id) {

  const product = products.find(function (p) {
    return p.id === id;
  });

  if (!product) return;

  if (cart[id]) {

    cart[id].qty++;

  } else {

    cart[id] = {
      ...product,
      qty: 1
    };
  }

  renderProducts();
  renderCart();
}

function changeQty(id, delta) {

  if (!cart[id]) return;

  cart[id].qty += delta;

  if (cart[id].qty <= 0) {
    delete cart[id];
  }

  renderProducts();
  renderCart();
}

function removeFromCart(id) {

  if (!cart[id]) return;

  delete cart[id];

  renderProducts();
  renderCart();
}

function renderCart() {

  const cartItems = Object.values(cart);

  const cartCount =
    document.getElementById("cart-count");

  const cartItemsEl =
    document.getElementById("cart-items");

  const cartSummaryEl =
    document.getElementById("cart-summary");

  if (!cartCount || !cartItemsEl || !cartSummaryEl) {
    return;
  }

  const totalCount = cartItems.reduce(function (sum, item) {
    return sum + item.qty;
  }, 0);

  cartCount.textContent = totalCount;

  if (cartItems.length === 0) {

    cartItemsEl.innerHTML = `
      <p class="cart-empty">
        Your cart is empty.
        <br>
        Start adding products!
      </p>
    `;

    cartSummaryEl.innerHTML = "";

    return;
  }

  cartItemsEl.innerHTML = cartItems.map(function (item) {

    return `
      <div class="cart-item">

        <img
          class="cart-img"
          src="${item.image}"
          alt="${item.name}"
        />

        <div class="cart-info">

          <div class="cart-name">
            ${item.name}
          </div>

          <div class="cart-price">
            ₹${(item.price * item.qty).toLocaleString()}
          </div>

        </div>

        <div class="qty-wrap">

          <button
            class="qty-btn"
            onclick="changeQty(${item.id}, -1)"
          >
            -
          </button>

          <span class="qty-num">
            ${item.qty}
          </span>

          <button
            class="qty-btn"
            onclick="changeQty(${item.id}, 1)"
          >
            +
          </button>

        </div>

        <button
          class="remove-btn"
          onclick="removeFromCart(${item.id})"
        >
          ✕
        </button>

      </div>
    `;
  }).join("");

  const subtotal = cartItems.reduce(function (sum, item) {
    return sum + item.price * item.qty;
  }, 0);

  const shipping = subtotal > 5000 ? 0 : 99;

  const total = subtotal + shipping;

  cartSummaryEl.innerHTML = `

    <div class="cart-summary">

      <div class="summary-row">
        <span>Subtotal</span>
        <span>₹${subtotal.toLocaleString()}</span>
      </div>

      <div class="summary-row">
        <span>Shipping</span>
        <span>
          ${shipping === 0 ? "FREE" : `₹${shipping}`}
        </span>
      </div>

      <div class="summary-total">
        <span>Total</span>
        <span>₹${total.toLocaleString()}</span>
      </div>

    </div>

    <button
      class="checkout-btn"
      onclick="checkout()"
    >
      Proceed to Checkout →
    </button>
  `;
}

function checkout() {
  // Cart empty check
  const cartItems = Object.values(cart);
  if (cartItems.length === 0) {
    alert('Cart is empty! Please add products first.');
    return;
  }

  // Address form HTML
  const formHTML = `
    <div id="checkout-overlay" style="
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.5); z-index: 999;
      display: flex; align-items: center; justify-content: center;
    ">
      <div style="
        background: #fff; border-radius: 16px; padding: 32px;
        width: 460px; max-width: 95%; box-shadow: 0 20px 60px rgba(0,0,0,0.3);
      ">
        <h2 style="color: #1a1a2e; margin-bottom: 20px; font-size: 20px;"> Delivery Address</h2>

        <div style="display: flex; flex-direction: column; gap: 14px;">

          <div style="display: flex; gap: 12px;">
            <div style="flex: 1;">
              <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">First Name *</label>
              <input id="fname" type="text" placeholder="Eg: Tamil"
                style="width:100%; padding: 10px 12px; border: 1.5px solid #dce1ee;
                border-radius: 8px; font-size: 14px; outline: none;" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">Last Name *</label>
              <input id="lname" type="text" placeholder="Eg: Amuthan"
                style="width:100%; padding: 10px 12px; border: 1.5px solid #dce1ee;
                border-radius: 8px; font-size: 14px; outline: none;" />
            </div>
          </div>

          <div>
            <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">Phone Number *</label>
            <input id="phone" type="tel" placeholder="Eg: 9876543210"
              style="width:100%; padding: 10px 12px; border: 1.5px solid #dce1ee;
              border-radius: 8px; font-size: 14px; outline: none;" />
          </div>

          <div>
            <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">Address *</label>
            <input id="address" type="text" placeholder="Door No, Street Name"
              style="width:100%; padding: 10px 12px; border: 1.5px solid #dce1ee;
              border-radius: 8px; font-size: 14px; outline: none;" />
          </div>

          <div style="display: flex; gap: 12px;">
            <div style="flex: 1;">
              <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">City *</label>
              <input id="city" type="text" placeholder="Eg: Chennai"
                style="width:100%; padding: 10px 12px; border: 1.5px solid #dce1ee;
                border-radius: 8px; font-size: 14px; outline: none;" />
            </div>
            <div style="flex: 1;">
              <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">Pincode *</label>
              <input id="pincode" type="text" placeholder="Eg: 600001"
                style="width:100%; padding: 10px 12px; border: 1.5px solid #dce1ee;
                border-radius: 8px; font-size: 14px; outline: none;" />
            </div>
          </div>

          <div>
            <label style="font-size: 13px; color: #666; display: block; margin-bottom: 5px;">State *</label>
            <select id="state"
              style="width:100%; padding: 10px 12px; border: 1.5px solid #dce1ee;
              border-radius: 8px; font-size: 14px; outline: none; background: #fff;">
              <option value="">-- Select State --</option>
              <option>Tamil Nadu</option>
              <option>Kerala</option>
              <option>Karnataka</option>
              <option>Andhra Pradesh</option>
              <option>Telangana</option>
              <option>Maharashtra</option>
              <option>Delhi</option>
              <option>Gujarat</option>
              <option>Rajasthan</option>
              <option>West Bengal</option>
            </select>
          </div>

        </div>

        <div style="display: flex; gap: 12px; margin-top: 24px;">
          <button onclick="closeCheckout()" style="
            flex: 1; padding: 12px; border: 1.5px solid #dce1ee;
            border-radius: 10px; background: #fff; cursor: pointer;
            font-size: 15px; font-weight: 600; color: #666;
          ">Cancel</button>
          <button onclick="placeOrder()" style="
            flex: 2; padding: 12px; border: none;
            border-radius: 10px; background: #e94560; color: #fff;
            cursor: pointer; font-size: 15px; font-weight: 700;
          ">Place Order →</button>
        </div>

      </div>
    </div>
  `;

 
  document.body.insertAdjacentHTML('beforeend', formHTML);
}


function closeCheckout() {
  const overlay = document.getElementById('checkout-overlay');
  if (overlay) overlay.remove();
}


function placeOrder() {
 
  const fname   = document.getElementById('fname').value.trim();
  const lname   = document.getElementById('lname').value.trim();
  const phone   = document.getElementById('phone').value.trim();
  const address = document.getElementById('address').value.trim();
  const city    = document.getElementById('city').value.trim();
  const pincode = document.getElementById('pincode').value.trim();
  const state   = document.getElementById('state').value;

  // Validation
  if (!fname || !lname || !phone || !address || !city || !pincode || !state) {
    alert('Please fill all the fields!');
    return;
  }

  if (phone.length !== 10 || isNaN(phone)) {
    alert('Please enter a valid 10-digit phone number!');
    return;
  }

  if (pincode.length !== 6 || isNaN(pincode)) {
    alert('Please enter a valid 6-digit pincode!');
    return;
  }

  // Success
  closeCheckout();
  alert(`Order Placed Successfully!\n\n Delivering to:\n${fname} ${lname}\n${address}, ${city} - ${pincode}\n${state}\n ${phone}\n\nThank you for shopping at ShopJS!`);

  // Cart clear
  cart = {};
  renderProducts();
  renderCart();
}
