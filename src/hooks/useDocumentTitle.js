import { useEffect } from "react";

const DEFAULT_TITLE = "BookForge | Bücher online kaufen";

// title = null oder leer: Standardtitel
export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | BookForge` : DEFAULT_TITLE;
    return () => {
      document.title = DEFAULT_TITLE;
    };
  }, [title]);
}