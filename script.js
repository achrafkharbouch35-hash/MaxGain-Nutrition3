
/* =====================================
   FORGE NUTRITION — CONFIGURATION
===================================== */

const WHATSAPP_NUMBER = "212600000000";

const INSTAGRAM_URL =
  "https://www.instagram.com/forge.nutrition.ma/";


/* =====================================
   PRODUCT DATA
   Replace demo products with your own
===================================== */

const products = [

  {
    id: 1,
    name: "Whey Protein",
    category: "protein",
    categoryName: "NUTRITION",
    description: "Exemple de référence pour le catalogue.",
    price: 450,
    badge: "POPULAR",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 2,
    name: "Training Essentials",
    category: "accessory",
    categoryName: "ACCESSORIES",
    description: "Accessoires pour accompagner l'entraînement.",
    price: 120,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 3,
    name: "Sports Bottle",
    category: "accessory",
    categoryName: "ACCESSORIES",
    description: "Accessoire pratique pour le sport.",
    price: 90,
    badge: "",
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 4,
    name: "Gym Collection",
    category: "accessory",
    categoryName: "ACCESSORIES",
    description: "Équipement et accessoires sportifs.",
    price: 180,
    badge: "FEATURED",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 5,
    name: "Wellness Essentials",
    category: "wellness",
    categoryName: "WELLNESS",
    description: "Exemple de produit à personnaliser.",
    price: 150,
    badge: "",
    image: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=700&q=85"
  },

  {
    id: 6,
    name: "Sports Collection",
    category: "protein",
    categoryName: "NUTRITION",
    description: "Référence de démonstration du catalogue.",
    price: 320,
    badge: "NEW",
    image: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&w=700&q=85"
  }

];


/* =====================================
   STATE
===================================== */

let cart = [];

try {
  cart = JSON.parse(localStorage.getItem("forge_cart") || "[]");

  if (!Array.isArray(cart)) cart = [];
} catch {
  cart = [];
}

let activeFilter = "all";
let sortMode = "default";


/* =====================================
   ELEMENTS
===================================== */

const productGrid =
  document.getElementById("product-grid");

const cartDrawer =
  document.getElementById("cart-drawer");

const cartBackdrop =
  document.getElementById("cart-backdrop");

const cartItems =
  document.getElementById("cart-items");

const cartEmpty =
  document.getElementById("cart-empty");

const cartFooter =
  document.getElementById("cart-footer");

const cartSubtotal =
  document.getElementById("cart-subtotal");

const cartTitleCount =
  document.getElementById("cart-title-count");

const toast =
  document.getElementById("toast");


/* =====================================
   HELPERS
===================================== */

function formatPrice(price) {
  return new Intl.NumberFormat("fr-FR").format(price) + " DH";
}

function saveCart() {
  localStorage.setItem("forge_cart", JSON.stringify(cart));
}

function getProduct(id) {
  return products.find(product => product.id === id);
}

function cartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function cartTotal() {
  return cart.reduce((total, item) => {
    const product = getProduct(item.id);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);
}

function refreshIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  }
}


/* =====================================
   PRODUCT DISPLAY
===================================== */

function renderProducts() {

  let filtered = [...products];

  if (activeFilter !== "all") {
    filtered = filtered.filter(product =>
      product.category === activeFilter
    );
  }

  if (sortMode === "low") {
    filtered.sort((a, b) => a.price - b.price);
  }

  if (sortMode === "high") {
    filtered.sort((a, b) => b.price - a.price);
  }

  productGrid.innerHTML = filtered.map(product => `

    <article class="product-card">

      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${product.badge ? `
          <span class="product-badge">
            ${product.badge}
          </span>
        ` : ""}

      </div>

      <div class="product-info">

        <span class="product-category">
          ${product.categoryName}
        </span>

        <h3>${product.name}</h3>

        <p class="product-description">
          ${product.description}
        </p>

        <div class="product-bottom">

          <span class="product-price">
            ${formatPrice(product.price)}
          </span>

          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Ajouter au panier"
          >
            <i data-lucide="plus"></i>
          </button>

        </div>

      </div>

    </article>

  `).join("");

  refreshIcons();

}


/* =====================================
   FILTER BUTTONS
===================================== */

document.querySelectorAll(".filter-btn").forEach(button => {

  button.addEventListener("click", () => {

    document.querySelectorAll(".filter-btn")
      .forEach(btn => btn.classList.remove("active"));

    button.classList.add("active");

    activeFilter = button.dataset.filter;

    renderProducts();

  });

});


/* =====================================
   SORTING
===================================== */

document.getElementById("sort-select")
  .addEventListener("change", event => {

    sortMode = event.target.value;

    renderProducts();

  });


/* =====================================
   ADD TO CART
===================================== */

function addToCart(id) {

  const existing = cart.find(item => item.id === id);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      id,
      quantity: 1
    });
  }

  saveCart();
  renderCart();
  showToast("Added to your cart");

}


/* =====================================
   CHANGE QUANTITY
===================================== */

function changeQuantity(id, amount) {

  const item = cart.find(item => item.id === id);

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    cart = cart.filter(item => item.id !== id);
  }

  saveCart();
  renderCart();

}


/* =====================================
   REMOVE PRODUCT
===================================== */

function removeItem(id) {

  cart = cart.filter(item => item.id !== id);

  saveCart();
  renderCart();

}


/* =====================================
   RENDER CART
===================================== */

function renderCart() {

  const quantity = cartQuantity();

  document.querySelector(".cart-count").textContent = quantity;
  cartTitleCount.textContent = `(${quantity})`;

  if (cart.length === 0) {

    cartEmpty.classList.remove("hidden");
    cartFooter.classList.add("hidden");

    cartItems.innerHTML = "";

    refreshIcons();
    return;

  }

  cartEmpty.classList.add("hidden");
  cartFooter.classList.remove("hidden");

  cartItems.innerHTML = cart.map(item => {

    const product = getProduct(item.id);

    if (!product) return "";

    return `

      <div class="cart-line">

        <img src="${product.image}" alt="${product.name}">

        <div>

          <h4>${product.name}</h4>

          <p>${formatPrice(product.price * item.quantity)}</p>

          <div class="cart-quantity">

            <button
              data-quantity="-1"
              data-id="${product.id}"
              aria-label="Diminuer"
            >−</button>

            <span>${item.quantity}</span>

            <button
              data-quantity="1"
              data-id="${product.id}"
              aria-label="Augmenter"
            >+</button>

          </div>

        </div>

        <button
          class="remove-item"
          data-remove="${product.id}"
          aria-label="Supprimer"
        >×</button>

      </div>

    `;

  }).join("");

  cartSubtotal.textContent = formatPrice(cartTotal());

  refreshIcons();

}


/* =====================================
   CART OPEN / CLOSE
===================================== */

function openCart() {
  cartDrawer.classList.add("open");
  cartBackdrop.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("open");
  cartBackdrop.classList.remove("open");
  document.body.style.overflow = "";
}

document.querySelector(".cart-open")
  .addEventListener("click", openCart);

document.querySelector(".cart-close")
  .addEventListener("click", closeCart);

cartBackdrop.addEventListener("click", closeCart);


/* =====================================
   PRODUCT AND CART ACTIONS
===================================== */

document.addEventListener("click", event => {

  const addButton = event.target.closest("[data-add]");

  if (addButton) {
    addToCart(Number(addButton.dataset.add));
    return;
  }

  const quantityButton = event.target.closest("[data-quantity]");

  if (quantityButton) {

    changeQuantity(
      Number(quantityButton.dataset.id),
      Number(quantityButton.dataset.quantity)
    );

    return;
  }

  const removeButton = event.target.closest("[data-remove]");

  if (removeButton) {
    removeItem(Number(removeButton.dataset.remove));
  }

});


/* =====================================
   WHATSAPP CHECKOUT
===================================== */

function orderOnWhatsApp() {

  if (cart.length === 0) {
    showToast("Your cart is empty");
    return;
  }

  const number = WHATSAPP_NUMBER.replace(/\D/g, "");

  if (!number || number === "212600000000") {
    showToast("Configure your WhatsApp number in script.js");
    return;
  }

  const productLines = cart.map(item => {

    const product = getProduct(item.id);

    if (!product) return "";

    return `• ${product.name} x ${item.quantity} — ${formatPrice(product.price * item.quantity)}`;

  }).filter(Boolean);

  const message = [
    "Hello FORGE NUTRITION!",
    "",
    "I would like information about these products:",
    "",
    ...productLines,
    "",
    `Subtotal: ${formatPrice(cartTotal())}`,
    "",
    "Please confirm availability and delivery fees."
  ].join("\n");

  const url =
    `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  window.open(url, "_blank", "noopener,noreferrer");

}

document.querySelector(".checkout-button")
  .addEventListener("click", orderOnWhatsApp);


/* =====================================
   TOAST NOTIFICATION
===================================== */

let toastTimer;

function showToast(message) {

  toast.querySelector("span").textContent = message;

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2200);

}


/* =====================================
   MOBILE MENU
===================================== */

const menuToggle =
  document.querySelector(".menu-toggle");

const mobileMenu =
  document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {

  mobileMenu.classList.toggle("open");

});

mobileMenu.querySelectorAll("a").forEach(link => {

  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });

});


/* =====================================
   INSTAGRAM LINKS
===================================== */

document.querySelectorAll('a[href*="instagram.com"]')
  .forEach(link => {
    link.href = INSTAGRAM_URL;
  });


/* =====================================
   SCROLL REVEAL
===================================== */

function setupReveal() {

  const elements = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    elements.forEach(element => element.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {

    entries.forEach(entry => {

      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }

    });

  }, {
    threshold: 0.12
  });

  elements.forEach(element => observer.observe(element));

}


/* =====================================
   INITIALIZATION
===================================== */

renderProducts();
renderCart();
setupReveal();
refreshIcons();
