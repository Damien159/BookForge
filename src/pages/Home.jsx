import { useSearchParams } from "react-router-dom";
import BookSection from "../components/BookSection";
import HeroSlider from "../components/HeroSlider";
import CategoryCards from "../components/CategoryCards";
import { CATEGORIES } from "../data/categories";
import { NAV_MENU } from "../data/navigation";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

const SECTIONS = [
  { id: "katalog", title: "Unsere Bücher", query: "novel" },
  { id: "bestseller", title: "Bestseller", query: "bestseller" },
  { id: "fantasy", title: "Fantasy", query: "fantasy" },
  { id: "krimis", title: "Thriller", query: "thriller" },
];

export default function Home() {
  const [params] = useSearchParams();
  const search = params.get("q")?.trim();
  const category = [...CATEGORIES, ...NAV_MENU.flatMap((menu) => menu.items)].find(
    (entry) => entry.query === search,
  );
  const title = category
    ? `Kategorie: ${category.label}`
    : `Suchergebnisse für: "${search}"`;
  useDocumentTitle(search ? title : null);

  return (
    <>
      {!search && <HeroSlider />}
      <main>
        <CategoryCards active={search} />
        {search ? (
          <BookSection
            key={search}
            id="suche"
            title={title}
            query={search}
            limit={24}
            eager
          />
        ) : (
          SECTIONS.map((section, index) => (
            <BookSection key={section.id} {...section} eager={index === 0} />
          ))
        )}
      </main>
    </>
  );
}