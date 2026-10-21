import { Link } from "react-router-dom";
import { CATEGORIES } from "../data/categories";

export default function CategoryCards({ active }) {
  return (
    <nav className="categories" aria-label="Beliebte Kategorien">
      {CATEGORIES.map((category) => {
        const isActive = active === category.query;
        return (
          <Link
            key={category.query}
            to={`/?q=${encodeURIComponent(category.query)}`}
            className={`category-card${category.sale ? " sale" : ""}${isActive ? " active" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            <span>{category.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}