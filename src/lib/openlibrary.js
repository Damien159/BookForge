import { getBookPrice } from "./price";

const API = "https://openlibrary.org";
const COVERS = "https://covers.openlibrary.org";
const CACHE_TTL = 10 * 60 * 1000; // 10 Minuten

export const NO_COVER = "/img/no-cover.svg";

function coverUrl(coverId, size = "M") {
  return coverId && coverId > 0
    ? `${COVERS}/b/id/${coverId}-${size}.jpg`
    : NO_COVER;
}

function normalizeDoc(doc) {
  const key = (doc.key || "").replace("/works/", "");
  return {
    key,
    title: doc.title || "Unbekannter Titel",
    author: doc.author_name?.[0] || "Unbekannter Autor",
    cover: coverUrl(doc.cover_i),
    price: getBookPrice(key),
  };
}

export async function searchBooks(query, signal) {
  const cacheKey = `bookforge_cache_${query}`;

  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey));
    if (cached && Date.now() - cached.time < CACHE_TTL) return cached.books;
  } catch {
    // kaputter Cache wird ignoriert
  }

  const fields = "key,title,author_name,cover_i";
  const response = await fetch(
    `${API}/search.json?q=${encodeURIComponent(query)}&limit=8&fields=${fields}`,
    { signal },
  );
  if (!response.ok) throw new Error(`OpenLibrary: ${response.status}`);

  const data = await response.json();
  const books = (data.docs || []).map(normalizeDoc).filter((book) => book.key);

  try {
    sessionStorage.setItem(cacheKey, JSON.stringify({ time: Date.now(), books }));
  } catch {
    // Storage voll: egal
  }

  return books;
}

export async function fetchBook(key, signal) {
  const response = await fetch(`${API}/works/${encodeURIComponent(key)}.json`, {
    signal,
  });
  if (!response.ok) throw new Error("Buch nicht gefunden");
  const work = await response.json();

  let author = "Unbekannter Autor";
  const authorKey = work.authors?.[0]?.author?.key;
  if (authorKey) {
    try {
      const authorResponse = await fetch(`${API}${authorKey}.json`, { signal });
      if (authorResponse.ok) {
        author = (await authorResponse.json()).name || author;
      }
    } catch (error) {
      if (error.name === "AbortError") throw error;
      // Autor nicht ladbar: Buch trotzdem anzeigen
    }
  }

  const description =
    typeof work.description === "string"
      ? work.description
      : work.description?.value || "";

  return {
    key,
    title: work.title || "Unbekannter Titel",
    author,
    cover: coverUrl(work.covers?.[0], "L"),
    description: description || "Keine Beschreibung verfügbar.",
    price: getBookPrice(key),
  };
}