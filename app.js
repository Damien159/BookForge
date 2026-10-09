// ==========================================
// 1. BENUTZER-VERWALTUNG & USER-STORAGE LOGIK
// ==========================================

function getCurrentUser() {
  return localStorage.getItem('bookforge_logged_in_user') || null;
}

function getCartKey() {
  const user = getCurrentUser();
  return user ? `bookforge_cart_${user}` : 'bookforge_cart_guest';
}

function getWishlistKey() {
  const user = getCurrentUser();
  return user ? `bookforge_wishlist_${user}` : 'bookforge_wishlist_guest';
}

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(getCartKey())) || [];
  } catch (e) {
    return [];
  }
}

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(getWishlistKey())) || [];
  } catch (e) {
    return [];
  }
}

function initAuth() {
  updateUserInterface();

  const showRegBtn = document.getElementById('show-register-btn');
  const showLoginBtn = document.getElementById('show-login-btn');
  const loginForm = document.getElementById('login-form');
  const regForm = document.getElementById('register-form');

  if (showRegBtn) {
    showRegBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (loginForm) loginForm.style.display = 'none';
      if (regForm) regForm.style.display = 'flex';
    };
  }

  if (showLoginBtn) {
    showLoginBtn.onclick = function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (regForm) regForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'flex';
    };
  }

  if (regForm) {
    regForm.onsubmit = function (e) {
      e.preventDefault();

      const usernameInput = document.getElementById('reg-username');
      const emailInput = document.getElementById('reg-email');
      const passwordInput = document.getElementById('reg-password');

      if (!usernameInput || !emailInput || !passwordInput) return;

      const username = usernameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('bookforge_users')) || [];
      } catch (err) {
        users = [];
      }

      const userExists = users.some(
        u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email.toLowerCase()
      );

      if (userExists) {
        alert('Benutzername oder E-Mail ist bereits vergeben!');
        return;
      }

      users.push({ username, email, password });
      localStorage.setItem('bookforge_users', JSON.stringify(users));

      alert('Konto erfolgreich erstellt! Du kannst dich jetzt anmelden.');
      regForm.reset();
      regForm.style.display = 'none';
      if (loginForm) loginForm.style.display = 'flex';
    };
  }

  if (loginForm) {
    loginForm.onsubmit = function (e) {
      e.preventDefault();

      const userInput = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;

      let users = [];
      try {
        users = JSON.parse(localStorage.getItem('bookforge_users')) || [];
      } catch (err) {
        users = [];
      }

      const user = users.find(
        u => (u.username.toLowerCase() === userInput.toLowerCase() || u.email.toLowerCase() === userInput.toLowerCase()) && u.password === password
      );

      if (!user) {
        alert('Ungültige Anmeldedaten!');
        return;
      }

      mergeGuestDataToUser(user.username);
      localStorage.setItem('bookforge_logged_in_user', user.username);

      loginForm.reset();
      updateUserInterface();
      updateAllUI();
      if (typeof renderCartPage === 'function') renderCartPage();
      if (typeof renderWishlistPage === 'function') renderWishlistPage();
    };
  }

  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.onclick = function () {
      localStorage.removeItem('bookforge_logged_in_user');
      updateUserInterface();
      updateAllUI();
      if (typeof renderCartPage === 'function') renderCartPage();
      if (typeof renderWishlistPage === 'function') renderWishlistPage();
    };
  }
}

function mergeGuestDataToUser(username) {
  const guestCart = JSON.parse(localStorage.getItem('bookforge_cart_guest')) || [];
  const guestWishlist = JSON.parse(localStorage.getItem('bookforge_wishlist_guest')) || [];

  if (guestCart.length > 0) {
    const userCartKey = `bookforge_cart_${username}`;
    let userCart = JSON.parse(localStorage.getItem(userCartKey)) || [];

    guestCart.forEach(gItem => {
      const idx = userCart.findIndex(uItem => uItem.title === gItem.title);
      if (idx > -1) {
        userCart[idx].quantity = (userCart[idx].quantity || 1) + (gItem.quantity || 1);
      } else {
        userCart.push(gItem);
      }
    });

    localStorage.setItem(userCartKey, JSON.stringify(userCart));
    localStorage.removeItem('bookforge_cart_guest');
  }

  if (guestWishlist.length > 0) {
    const userWishlistKey = `bookforge_wishlist_${username}`;
    let userWishlist = JSON.parse(localStorage.getItem(userWishlistKey)) || [];

    guestWishlist.forEach(item => {
      if (!userWishlist.includes(item)) userWishlist.push(item);
    });

    localStorage.setItem(userWishlistKey, JSON.stringify(userWishlist));
    localStorage.removeItem('bookforge_wishlist_guest');
  }
}

function updateUserInterface() {
  const currentUser = getCurrentUser();
  const authForms = document.getElementById('auth-forms');
  const userInfoBox = document.getElementById('user-info-box');
  const profileNavText = document.getElementById('profile-nav-text');
  const userDisplayName = document.getElementById('user-display-name');

  if (currentUser) {
    if (authForms) authForms.style.display = 'none';
    if (userInfoBox) userInfoBox.style.display = 'block';
    if (profileNavText) profileNavText.textContent = currentUser;
    if (userDisplayName) userDisplayName.textContent = currentUser;
  } else {
    if (authForms) authForms.style.display = 'block';
    if (userInfoBox) userInfoBox.style.display = 'none';
    if (profileNavText) profileNavText.textContent = 'Mein Konto';
  }
}


// ==========================================
// 2. OPENLIBRARY API & BÜCHER RENDERN
// ==========================================

async function fetchAndRenderBooks(section, customQuery = null) {
  const query = customQuery || section.getAttribute("data-query");
  const grid = section.querySelector(".buecher-grid") || section;

  if (!query) return;

  grid.innerHTML = "<p>Bücher werden geladen...</p>";

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`
    );
    const data = await response.json();

    grid.innerHTML = "";

    if (!data.docs || data.docs.length === 0) {
      grid.innerHTML = "<p>Keine Bücher gefunden.</p>";
      return;
    }

    data.docs.forEach((book) => {
      const title = book.title || "Unbekannter Titel";
      const author = book.author_name ? book.author_name[0] : "Unbekannter Autor";
      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/180x220?text=Kein+Cover";

      const price =
        (12.99 + (book.first_publish_year ? book.first_publish_year % 10 : 3))
          .toFixed(2)
          .replace(".", ",") + " €";

      const rawKey = book.key || "";
      const cleanKey = rawKey.replace("/works/", "");

      const cardHTML = `
        <div class="buecher-card">
          <button class="fav-btn" title="Zu Favoriten hinzufügen">
            <img src="svg/Heart.svg" alt="Favorit" class="svg-icon">
          </button>

          <a href="buch-details.html?key=${cleanKey}" class="book-card-link">
            <img src="${cover}" alt="${title}">
            <h3>${title}</h3>
            <p>${author}</p>
          </a>

          <p class="price">${price}</p>
          <div class="button-group">
            <button class="cart-btn">
              <img src="svg/Buy-Cart.svg" alt="Warenkorb" class="svg-icon">
            </button>
          </div>
        </div>
      `;
      grid.innerHTML += cardHTML;
    });

    // Nach dem Laden der Bücher die Herz-Farben abgleichen
    updateWishlistUI();
  } catch (error) {
    console.error("Fehler beim Laden:", error);
    grid.innerHTML = "<p>Fehler beim Laden der Buchdaten.</p>";
  }
}

function initBannerAutoSlider() {
  const slider = document.querySelector(".homepage .img");
  const prevBtn = document.querySelector(".slider-arrow.prev");
  const nextBtn = document.querySelector(".slider-arrow.next");
  if (!slider) return;

  let sliderInterval;

  function nextSlide() {
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
    }
  }

  function prevSlide() {
    if (slider.scrollLeft <= 10) {
      slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: -slider.clientWidth, behavior: "smooth" });
    }
  }

  function startTimer() {
    sliderInterval = setInterval(nextSlide, 20000);
  }

  function resetTimer() {
    clearInterval(sliderInterval);
    startTimer();
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });
  }

  startTimer();
}

async function initDetailPage() {
  const detailTitle = document.getElementById("detail-title");
  if (!detailTitle) return;

  const urlParams = new URLSearchParams(window.location.search);
  const workKey = urlParams.get("key");

  if (!workKey) {
    detailTitle.textContent = "Kein Buch ausgewählt.";
    return;
  }

  try {
    const response = await fetch(
      `https://openlibrary.org/works/${workKey}.json`
    );
    if (!response.ok) throw new Error("Buch nicht gefunden");
    const bookData = await response.json();

    detailTitle.textContent = bookData.title || "Unbekannter Titel";

    const descEl = document.getElementById("detail-description");
    if (descEl) {
      if (typeof bookData.description === "string") {
        descEl.textContent = bookData.description;
      } else if (bookData.description && bookData.description.value) {
        descEl.textContent = bookData.description.value;
      } else {
        descEl.textContent = "Keine Beschreibung verfügbar.";
      }
    }

    const coverEl = document.getElementById("detail-cover");
    if (coverEl) {
      if (
        bookData.covers &&
        bookData.covers.length > 0 &&
        bookData.covers[0] > 0
      ) {
        coverEl.src = `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`;
        coverEl.alt = bookData.title || "Buchcover";
      } else {
        coverEl.src = "https://via.placeholder.com/200x300?text=Kein+Cover";
      }
    }

    const authorEl = document.getElementById("detail-author");
    if (authorEl && bookData.authors && bookData.authors.length > 0) {
      const authorKey = bookData.authors[0].author.key;
      const authorRes = await fetch(`https://openlibrary.org${authorKey}.json`);
      if (authorRes.ok) {
        const authorData = await authorRes.json();
        authorEl.textContent = authorData.name || "Unbekannter Autor";
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden der Produktdetails:", error);
    detailTitle.textContent = "Fehler beim Laden des Buches.";
  }
}


// ==========================================
// 3. WARENKORB & MERKLISTEN UI-UPDATES
// ==========================================

function updateAllUI() {
  updateWishlistUI();
  updateCartUI();
}

function updateCartUI() {
  const cart = getCart();

  const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const counterEl = document.getElementById("cart-counter") || document.getElementById("cart-count");
  if (counterEl) {
    counterEl.textContent = totalCount;
    counterEl.style.display = totalCount > 0 ? "inline-block" : "none";
  }

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );
  const priceEl = document.getElementById("cart-total");
  if (priceEl) {
    priceEl.textContent = totalPrice.toLocaleString("de-DE", {
      style: "currency",
      currency: "EUR",
    });
  }
}

function updateWishlistUI() {
  const wishlist = getWishlist();
  const counterEl = document.getElementById("wishlist-counter") || document.getElementById("wishlist-count");
  if (counterEl) {
    counterEl.textContent = wishlist.length;
    counterEl.style.display = wishlist.length > 0 ? "inline-block" : "none";
  }

  document.querySelectorAll(".fav-btn").forEach((btn) => {
    const bookData = getBookData(btn);
    if (bookData && wishlist.includes(bookData.title)) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

function getBookData(element) {
  const card = element.closest(
    ".buecher-card, .product-detail-container, .book-card-link"
  );
  if (!card) return null;

  const titleEl = card.querySelector("h3, .detail-title, h2");
  const title = element.dataset.id || (titleEl ? titleEl.textContent.trim() : null);

  const priceEl = card.querySelector(".price, .detail-price, p.price");
  let price = 0;
  if (priceEl) {
    const priceText = priceEl.textContent
      .replace("€", "")
      .replace(",", ".")
      .trim();
    price = parseFloat(priceText) || 0;
  }

  if (!title) return null;
  return { title, price };
}

function addToCart(bookData, button) {
  let cart = getCart();
  const existingIndex = cart.findIndex((item) => item.title === bookData.title);

  if (existingIndex > -1) {
    cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + 1;
  } else {
    cart.push({
      title: bookData.title,
      price: bookData.price,
      quantity: 1,
    });
  }

  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  updateAllUI();

  if (button) {
    button.classList.add("added");
    setTimeout(() => button.classList.remove("added"), 800);
  }
}

function toggleWishlist(bookTitle) {
  let wishlist = getWishlist();
  if (wishlist.includes(bookTitle)) {
    wishlist = wishlist.filter((id) => id !== bookTitle);
  } else {
    wishlist.push(bookTitle);
  }
  localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
  updateWishlistUI();
}

function setupGlobalClickEvents() {
  document.body.addEventListener("click", (event) => {
    const favBtn = event.target.closest(".fav-btn");
    if (favBtn) {
      event.preventDefault();
      event.stopPropagation();
      const bookData = getBookData(favBtn);
      if (bookData) toggleWishlist(bookData.title);
      return;
    }

    const cartBtn = event.target.closest(".cart-btn");
    if (cartBtn) {
      event.preventDefault();
      event.stopPropagation();
      const bookData = getBookData(cartBtn);
      if (bookData) addToCart(bookData, cartBtn);
      return;
    }
  });
}


// ==========================================
// 4. SEITEN-RENDERING (WARENKORB & MERKLISTE)
// ==========================================

function renderCartPage() {
  const cartContent = document.getElementById("cart-content");
  if (!cartContent) return;

  const cart = getCart();

  if (!cart || cart.length === 0) {
    cartContent.innerHTML = `
      <div class="empty-message" style="width: 100%;">
        <h2>Dein Warenkorb ist leer.</h2>
        <p>Stöbere in unserem Sortiment und füge deine Lieblingsbücher hinzu!</p>
        <a href="index.html">Zurück zur Startseite</a>
      </div>`;
    return;
  }

  let itemsHTML = '<div class="cart-items-list">';
  let totalSum = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * (item.quantity || 1);
    totalSum += itemTotal;

    itemsHTML += `
      <div class="cart-item">
        <div class="cart-item-info">
          <div>
            <h3 class="cart-item-title">${item.title}</h3>
            <div class="cart-item-price">${item.price.toFixed(2).replace(".", ",")} €</div>
          </div>
        </div>
        <div class="cart-item-controls">
          <div class="quantity-control">
            <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
            <span class="quantity-value">${item.quantity || 1}</span>
            <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
          </div>
          <button class="remove-btn" onclick="removeItem(${index})" title="Entfernen">&times;</button>
        </div>
      </div>`;
  });
  itemsHTML += "</div>";

  const summaryHTML = `
    <div class="cart-summary">
      <h3>Zusammenfassung</h3>
      <div class="summary-row">
        <span>Zwischensumme</span>
        <span>${totalSum.toFixed(2).replace(".", ",")} €</span>
      </div>
      <div class="summary-row">
        <span>Versandkosten</span>
        <span>Kostenlos</span>
      </div>
      <div class="summary-row total">
        <span>Gesamtsumme</span>
        <span>${totalSum.toFixed(2).replace(".", ",")} €</span>
      </div>
      <button class="checkout-btn">Zur Kasse gehen</button>
    </div>`;

  cartContent.innerHTML = itemsHTML + summaryHTML;
}

function changeQuantity(index, delta) {
  let cart = getCart();
  if (!cart[index]) return;

  cart[index].quantity = (cart[index].quantity || 1) + delta;
  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  updateAllUI();
  renderCartPage();
}

function removeItem(index) {
  let cart = getCart();
  cart.splice(index, 1);
  localStorage.setItem(getCartKey(), JSON.stringify(cart));
  updateAllUI();
  renderCartPage();
}

function renderWishlistPage() {
  const grid = document.getElementById("wishlist-grid");
  if (!grid) return;

  const wishlist = getWishlist();

  if (!wishlist || wishlist.length === 0) {
    grid.innerHTML = `
      <div class="empty-message">
        <h2>Deine Merkliste ist noch leer.</h2>
        <p>Klicke auf das Herz-Symbol bei Büchern, die dir gefallen, um sie für später zu speichern.</p>
        <a href="index.html">Jetzt Bücher entdecken</a>
      </div>`;
    return;
  }

  let gridHTML = "";
  wishlist.forEach((title) => {
    gridHTML += `
      <div class="buecher-card wishlist-card">
        <button class="remove-wish-btn" onclick="removeFromWishlistPage('${title}')" title="Von Merkliste entfernen">&times;</button>
        <h3>${title}</h3>
        <p class="author">Gemerktes Buch</p>
        <div class="button-group" style="margin-top: auto; padding-top: 10px;">
          <button class="cart-btn" data-id="${title}" title="In den Warenkorb">
            <img src="svg/Buy-Cart.svg" alt="Warenkorb" class="svg-icon">
          </button>
        </div>
      </div>`;
  });

  grid.innerHTML = gridHTML;
}

function removeFromWishlistPage(title) {
  let wishlist = getWishlist();
  wishlist = wishlist.filter((t) => t !== title);
  localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
  updateAllUI();
  renderWishlistPage();
}


// ==========================================
// 5. ZENTRALER STARTUP-LISTENER
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  // Auth initialisieren
  initAuth();

  // Klick-Listener & UI aktivieren
  setupGlobalClickEvents();
  updateAllUI();

  // Seiten-spezifische Views rendern
  renderCartPage();
  renderWishlistPage();

  // Startseiten-Module
  const isDetailPage = document.getElementById("detail-title") !== null;
  if (isDetailPage) {
    initDetailPage();
  } else {
    initBannerAutoSlider();

    const sections = document.querySelectorAll(".buecher-sektion");
    sections.forEach((section) => fetchAndRenderBooks(section));

    const searchInput = document.querySelector(".search-container input");
    const searchButton = document.querySelector(".search-button");

    const handleSearch = () => {
      const query = searchInput.value.trim();
      if (query && sections.length > 0) {
        const mainSection = sections[0];
        const heading = mainSection.querySelector("h2");
        if (heading) heading.textContent = `Suchergebnisse für: "${query}"`;
        fetchAndRenderBooks(mainSection, query);
      }
    };

    if (searchButton && searchInput) {
      searchButton.addEventListener("click", handleSearch);
      searchInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") handleSearch();
      });
    }
  }
});

// Live-Sync für Multi-Tab
window.addEventListener("storage", () => {
  updateAllUI();
  renderCartPage();
  renderWishlistPage();
});