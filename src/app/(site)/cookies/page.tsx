import type { Metadata } from "next";
import { LegalPage } from "@/components/site/legal-page";

export const metadata: Metadata = { title: "Política de cookies", robots: { index: false }, alternates: { canonical: "/cookies" } };

export default function CookiesPage() {
  return (
    <LegalPage title="Política de cookies" href="/cookies" updated="noviembre de 2026">
      <h2>1. ¿Usamos cookies?</h2>
      <p>
        Esta web <strong>no utiliza cookies de análisis, publicidad ni seguimiento</strong>. Por eso no mostramos un banner de
        consentimiento.
      </p>

      <h2>2. Cookies técnicas</h2>
      <p>
        Solo se usan cookies técnicas imprescindibles en la zona de administración (/admin) para mantener la sesión iniciada del
        personal autorizado. Están exentas de consentimiento según el artículo 22.2 de la LSSI-CE.
      </p>

      <h2>3. Servicios de terceros</h2>
      <ul>
        <li>El mapa de la página de contacto se carga desde OpenStreetMap, que no instala cookies de seguimiento.</li>
        <li>
          Los enlaces a WhatsApp y Google Maps abren servicios externos que aplican sus propias políticas de cookies cuando los
          visitas.
        </li>
      </ul>

      <h2>4. Cambios</h2>
      <p>
        Si en el futuro incorporamos herramientas de analítica u otras cookies no técnicas, actualizaremos esta política y
        solicitaremos tu consentimiento antes de instalarlas.
      </p>
    </LegalPage>
  );
}
