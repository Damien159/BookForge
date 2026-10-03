//Universelle Funktion für einen einzelnen Buch-Abschnitt
async function fetchAndRenderBooks(section, customQuery = null) {
  // Nimmt entweder die Sucheingabe oder das data-query aus dem HTML
  const query = customQuery || section.getAttribute("data-query");
  const grid = section.querySelector(".buecher-grid") || section;

  if (!query) return;

  grid.innerHTML = "<p>Bücher werden geladen...</p>";

  try {
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`,
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

      const cardHTML = `
        <div class="buecher-card">
          <button class="fav-btn" title="Zu Favoriten hinzufügen">
            <img src="svg/Heart.svg" alt="Favorit" class="svg-icon">
          </button>
          <img src="${cover}" alt="${title}">
          <h3>${title}</h3>
          <p>${author}</p>
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
/* Automatischer Banner-Slider (Scrollt alle 20 Sekunden)*/
function initBannerAutoSlider() {
  const slider = document.querySelector(".homepage .img");
  const prevBtn = document.querySelector(".slider-arrow.prev");
  const nextBtn = document.querySelector(".slider-arrow.next");
  if (!slider) return;

// Funktion zum Weiter-Scrollen (nach rechts)
  function nextSlide() {
    // Wenn am Ende angekommen, wieder zum ersten Bild springen
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
    }
  }

  // Funktion zum Zurück-Scrollen (nach links)
  function prevSlide() {
    // Wenn ganz am Anfang, zum letzten Bild springen
    if (slider.scrollLeft <= 10) {
      slider.scrollTo({ left: slider.scrollWidth, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: -slider.clientWidth, behavior: "smooth" });
    }
  }

  // Event Listener für die Pfeil-Klicks
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextSlide();
      resetTimer(); // Timer zurücksetzen, damit er nach Manuell-Klick nicht direkt springt
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevSlide();
      resetTimer();
    });
  }

  setInterval(() => {
    // Wenn am Ende angekommen, wieder an den Anfang scrollen
    if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 10) {
      slider.scrollTo({ left: 0, behavior: "smooth" });
    } else {
      slider.scrollBy({ left: slider.clientWidth, behavior: "smooth" });
    }
  }, 20000); // 20.000 ms = 20 Sekunden
}

// Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  initBannerAutoSlider();
  const sections = document.querySelectorAll(".buecher-sektion");

  // Alle Kategorien aus dem HTML automatisch befüllen
  sections.forEach((section) => fetchAndRenderBooks(section));

  // Suchleiste verknüpfen (befüllt den ersten Abschnitt "Unsere Bücher")
  const searchInput = document.querySelector(".search-container input");
  const searchButton = document.querySelector(".search-button");

  const handleSearch = () => {
    const query = searchInput.value.trim();
    if (query && sections.length > 0) {
      // Lädt die Suchergebnisse in den ersten Bereich (Unsere Bücher)
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
