// Universelle Funktion für einen einzelnen Buch-Abschnitt
async function fetchAndRenderBooks(section, customQuery = null) {
  // Nimmt entweder die Sucheingabe oder das data-query aus dem HTML
  const query = customQuery || section.getAttribute("data-query");
  const grid = section.querySelector(".buecher-grid") || section;

  if (!query) return;

  grid.innerHTML = "<p>Bücher werden geladen...</p>";

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`
    );
    const data = await response.json();

    grid.innerHTML = ""; // Ladeanzeige leeren

    if (!data.docs || data.docs.length === 0) {
      grid.innerHTML = "<p>Keine Bücher gefunden.</p>";
      return;
    }

    data.docs.forEach((book) => {
      const title = book.title || "Unbekannter Titel";
      const author = book.author_name
        ? book.author_name[0]
        : "Unbekannter Autor";
      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/180x220?text=Kein+Cover";

      const price =
        (12.99 + (book.first_publish_year ? book.first_publish_year % 10 : 3))
          .toFixed(2)
          .replace(".", ",") + " €";

      // OpenLibrary-Key säubern (Entfernt "/works/")
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
  } catch (error) {
    console.error("Fehler beim Laden:", error);
    grid.innerHTML = "<p>Fehler beim Laden der Buchdaten.</p>";
  }
}

/* Automatischer Banner-Slider (Scrollt alle 20 Sekunden) */
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

/* Logik speziell für die Produktdetailseite */
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

    // 1. Titel setzen
    detailTitle.textContent = bookData.title || "Unbekannter Titel";

    // 2. Beschreibung setzen
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

    // 3. Cover setzen (mit Fallback, falls kein Bild vorhanden ist)
    const coverEl = document.getElementById("detail-cover");
    if (coverEl) {
      if (bookData.covers && bookData.covers.length > 0 && bookData.covers[0] > 0) {
        coverEl.src = `https://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`;
        coverEl.alt = bookData.title || "Buchcover";
      } else {
        coverEl.src = "https://via.placeholder.com/200x300?text=Kein+Cover";
      }
    }

    // 4. Autor laden
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

// Haupt-Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  // Prüfen, ob wir uns auf der Detailseite befinden
  const isDetailPage = document.getElementById("detail-title") !== null;

  if (isDetailPage) {
    // Auf der Detailseite NUR die Detail-Logik ausführen
    initDetailPage();
    return;
  }

  // Auf der Startseite: Banner-Slider und Buchkategorien laden
  initBannerAutoSlider();

  const sections = document.querySelectorAll(".buecher-sektion");
  sections.forEach((section) => fetchAndRenderBooks(section));

  // Suchleiste verknüpfen
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
});