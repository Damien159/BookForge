import { useParams } from "react-router-dom";

export default function BookDetail() {
  const { key } = useParams();

  return (
    <main className="product-detail-container">
      <h1 className="detail-title">Buch {key}</h1>
    </main>
  );
}