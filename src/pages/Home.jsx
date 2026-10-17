import { useSearchParams } from "react-router-dom";
import BookSection from "../components/BookSection";

const SECTIONS = [
  { id: "katalog", title: "Unsere Bücher", query: "novel" },
  { id: "bestseller", title: "Bestseller", query: "bestseller" },
  { id: "fantasy", title: "Fantasy", query: "fantasy" },
  { id: "krimis", title: "Thriller", query: "thriller" },
];

export default function Home() {
  const [params] = useSearchParams();
  const search = params.get("q")?.trim();

  return (
    <main>
      {search ? (
        <BookSection
          key={search}
          id="suche"
          title={`Suchergebnisse für: "${search}"`}
          query={search}
          eager
        />
      ) : (
        SECTIONS.map((section, index) => (
          <BookSection key={section.id} {...section} eager={index === 0} />
        ))
      )}
    </main>
  );
}