// 1. Universelle Funktion für einen einzelnen Buch-Abschnitt
async function fetchAndRenderBooks(section, customQuery = null) {
  // Nimmt entweder die Sucheingabe oder das data-query aus dem HTML
  const query = customQuery || section.getAttribute("data-query");
  const grid = section.querySelector(".buecher-grid") || section;

  if (!query) return;

  grid.innerHTML = "<p>Bücher werden geladen...</p>";

  try {
    const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`);
    const data = await response.json();

    grid.innerHTML = ""; // Ladeanzeige leeren

    if (!data.docs || data.docs.length === 0) {
      grid.innerHTML = "<p>Keine Bücher gefunden.</p>";
      return;
    }

    data.docs.forEach(book => {
      const title = book.title || "Unbekannter Titel";
      const author = book.author_name ? book.author_name[0] : "Unbekannter Autor";
      const cover = book.cover_i 
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/180x220?text=Kein+Cover";

      const price = (12.99 + (book.first_publish_year ? (book.first_publish_year % 10) : 3)).toFixed(2).replace('.', ',') + " €";

      grid.innerHTML += `
        <div class="buecher-card">
          <img src="${cover}" alt="${title}">
          <h3>${title}</h3>
          <p>${author}</p>
          <p>${price}</p>
          <div class="button-group">
            <button>In den Warenkorb</button>
            <button>Meine Liste</button>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Fehler beim Laden:", error);
    grid.innerHTML = "<p>Fehler beim Laden der Buchdaten.</p>";
  }
}

// 2. Initialisierung beim Laden der Seite
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".buecher-sektion");
  
  // Alle Kategorien aus dem HTML automatisch befüllen
  sections.forEach(section => fetchAndRenderBooks(section));

  // 3. Suchleiste verknüpfen (befüllt den ersten Abschnitt "Unsere Bücher")
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