// Funktion zum Abrufen von Büchern aus der Open Library API
async function loadBooksFromOpenLibrary(query = "bestseller") {
  const container = document.getElementById("unsere-buecher");
  if (!container) return;

  // Ladeanzeige
  container.innerHTML = "<h2>Unsere Bücher</h2><p>Bücher werden geladen...</p>";

  try {
    // API Abruf (auf 8 Ergebnisse begrenzt)
    const response = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=8`,
    );
    const data = await response.json();

    // Überschrift zurücksetzen
    container.innerHTML = "<h2>Unsere Bücher</h2>";

    if (!data.docs || data.docs.length === 0) {
      container.innerHTML += "<p>Keine Bücher gefunden.</p>";
      return;
    }

    data.docs.forEach((book) => {
      // Titel & Autor extrahieren
      const title = book.title || "Unbekannter Titel";
      const author = book.author_name
        ? book.author_name[0]
        : "Unbekannter Autor";

      // Cover-Bild über die cover_i ID laden (falls vorhanden)
      const cover = book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : "https://via.placeholder.com/180x220?text=Kein+Cover";

      // Da Open Library ein Archiv und kein Shop ist, simulieren wir Preise
      // Basierend auf dem ersten Erscheinungsjahr oder Random
      const price =
        (12.99 + (book.first_publish_year ? book.first_publish_year % 10 : 3))
          .toFixed(2)
          .replace(".", ",") + " €";

      // Genau deine vorhandene .buecher-card Struktur beibehalten!
      const cardHTML = `
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

      container.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Fehler beim Laden der Open Library API:", error);
    container.innerHTML =
      "<h2>Unsere Bücher</h2><p>Fehler beim Laden der Buchdaten.</p>";
  }
}

// 3. Verknüpfung mit der Suchleiste und dem Seitenstart
document.addEventListener("DOMContentLoaded", () => {
  // Initiales Laden beim Seitenaufruf
  loadBooksFromOpenLibrary("fantasy");

  // Suchleiste verknüpfen
  const searchInput = document.querySelector(".search-container input");
  const searchButton = document.querySelector(".search-button");

  if (searchButton && searchInput) {
    // Klick auf Lupe/Such-Button
    searchButton.addEventListener("click", () => {
      const query = searchInput.value.trim();
      if (query) loadBooksFromOpenLibrary(query);
    });

    // Enter-Taste im Suchfeld
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const query = searchInput.value.trim();
        if (query) loadBooksFromOpenLibrary(query);
      }
    });
  }
});