const FOOTER_COLUMNS = [
  {
    title: "Services & Hilfe",
    links: [
      "Kontakt & FAQ",
      "Versand & Lieferzeiten",
      "Rücksendung & Umtausch",
      "Gutscheine einlösen",
      "Filialfinder",
    ],
  },
  {
    title: "Über BookForge",
    links: ["Über uns", "Karriere & Jobs", "Nachhaltigkeit", "Presse"],
  },
  {
    title: "Rechtliches",
    links: ["Datenschutz", "Impressum", "AGB", "Cookie-Einstellungen"],
  },
];

export default function Footer() {
  return (
    <footer>
      <div className="footer-container">
        {FOOTER_COLUMNS.map((column) => (
          <div className="footer-links" key={column.title}>
            <h4>{column.title}</h4>
            <ul>
              {column.links.map((label) => (
                <li key={label}>
                  <a href="#">{label}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="footer-links">
          <h4>Folge uns</h4>
          <ul className="social-links">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">TikTok</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>
          <h4 className="sub-heading">Zahlungsarten</h4>
          <p className="payment-methods">
            Visa • Mastercard • PayPal • Klarna • BillPay
          </p>
        </div>
      </div>

      <p className="copyright">&copy; {new Date().getFullYear()} BookForge. Alle Rechte vorbehalten.</p>
    </footer>
  );
}