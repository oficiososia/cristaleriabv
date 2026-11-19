/** Proceso de trabajo (9 pasos de la web anterior, con la política de visita corregida). */
export type ProcessStep = {
  title: string;
  description: string;
  action?: { label: string; kind: "travel" | "calculator" };
  options?: string[];
  /** Índice de la foto en photos.process (si tiene). */
  photo?: number;
};

export const processSteps: ProcessStep[] = [
  {
    title: "Asesoramiento",
    description: "Escuchamos tus necesidades y te asesoramos sobre las mejores opciones para tu proyecto.",
    photo: 0,
  },
  {
    title: "Presupuesto orientativo gratuito",
    description:
      "Te ofrecemos un presupuesto orientativo sin compromiso para que conozcas el rango de precios. Puedes calcularlo tú mismo en dos minutos.",
    action: { label: "Calcular presupuesto", kind: "calculator" },
  },
  {
    title: "Toma de medidas",
    description:
      "Visitamos tu casa o negocio para asesorarte en persona y tomar medidas precisas. La visita es gratuita en Crevillente; fuera, el desplazamiento cuesta 10 € por cada 10 km.",
    action: { label: "Calcular coste de desplazamiento", kind: "travel" },
    photo: 1,
  },
  {
    title: "Presupuesto detallado",
    description:
      "Elaboramos un presupuesto detallado con todos los costes. El coste del presupuesto se restará del precio final del proyecto en caso de ser aceptado, y su precio variará según la magnitud del proyecto.",
  },
  {
    title: "Diseño y fabricación",
    description: "Diseñamos y fabricamos tu proyecto en nuestro taller con materiales de primera calidad.",
    photo: 2,
  },
  {
    title: "Pre-montaje",
    description: "Realizamos el pre-montaje en nuestras instalaciones para asegurar un ajuste perfecto. Incluido en el precio.",
  },
  {
    title: "Control de calidad",
    description: "Verificamos que todo esté perfecto y funcione correctamente antes de la entrega.",
    photo: 3,
  },
  {
    title: "Garantía",
    description: "Todos nuestros trabajos tienen garantía, para tu tranquilidad.",
  },
  {
    title: "Entrega",
    description: "Elige la opción que mejor se adapte a ti:",
    options: [
      "Recogida del pedido en nuestras instalaciones",
      "Envío del pedido a tu domicilio",
      "Instalación completa por nuestro equipo",
    ],
    photo: 4,
  },
];
