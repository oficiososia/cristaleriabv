/**
 * Servicios de la cristalería. El `slug` coincide con la categoría de la
 * calculadora de presupuestos y con la carpeta de fotos en /public/images/services.
 */
export type ServiceSlug =
  | "mamparas"
  | "espejos"
  | "cerramientos"
  | "aluminio"
  | "barandillas"
  | "armarios"
  | "domino"
  | "otros";

export type Service = {
  slug: ServiceSlug;
  name: string;
  /** Descripción corta (la misma que en la web anterior). */
  short: string;
  headline: string;
  intro: string;
  features: string[];
  ideas: string[];
  seoTitle: string;
  seoDescription: string;
};

export const services: Service[] = [
  {
    slug: "mamparas",
    name: "Mamparas",
    short: "Mamparas de baño y ducha a medida",
    headline: "Mamparas de baño y ducha hechas a tu medida",
    intro:
      "Diseñamos, fabricamos e instalamos mamparas para plato de ducha y bañera ajustadas al milímetro a tu baño. Frontales, angulares, correderas, abatibles o paneles fijos tipo walk-in, siempre con cristal templado de seguridad.",
    features: [
      "Cristal templado de seguridad de 6, 8 o 10 mm",
      "Perfilería completa, mínima o sin perfil",
      "Acabados cromo, blanco, negro y más",
      "Opciones de cristal extraclaro, al ácido o serigrafiado",
      "Tratamiento antical para facilitar la limpieza",
      "Modelos estándar con entrega más rápida",
    ],
    ideas: ["Plato de ducha", "Sobre bañera", "Esquina en L", "Walk-in con panel fijo"],
    seoTitle: "Mamparas de baño y ducha a medida",
    seoDescription:
      "Mamparas de ducha y bañera a medida en Crevillente y el Baix Vinalopó. Cristal templado, perfilería a elegir e instalación profesional. Calcula tu presupuesto.",
  },
  {
    slug: "espejos",
    name: "Espejos",
    short: "Espejos decorativos y funcionales",
    headline: "Espejos a medida que amplían y llenan de luz",
    intro:
      "Cortamos y colocamos espejos a medida para baños, recibidores, dormitorios, gimnasios y comercios. Cantos pulidos o biselados, taladros para apliques y la forma que necesites.",
    features: [
      "Corte a medida y formas especiales",
      "Canto pulido o biselado",
      "Taladros para enchufes, apliques o tornillería",
      "Espejos de baño, de cuerpo entero y paredes de espejo",
      "Colocación con adhesivo o soportes ocultos",
    ],
    ideas: ["Baño", "Recibidor", "Pared de gimnasio", "Comercio"],
    seoTitle: "Espejos a medida",
    seoDescription:
      "Espejos a medida en el Baix Vinalopó: baños, recibidores, paredes de espejo y gimnasios. Canto pulido o biselado y colocación profesional.",
  },
  {
    slug: "cerramientos",
    name: "Cerramientos",
    short: "Cerramientos de terrazas y balcones",
    headline: "Cerramientos para disfrutar tu terraza todo el año",
    intro:
      "Convertimos terrazas, balcones y porches en espacios aprovechables durante todo el año. Cerramientos de cristal y aluminio que protegen del viento, la lluvia y el ruido sin renunciar a la luz.",
    features: [
      "Terrazas, balcones, porches y áticos",
      "Sistemas correderos y fijos",
      "Cristal templado, laminado o con cámara (Climalit)",
      "Mejor aislamiento térmico y acústico",
      "Estudio previo de medidas en tu vivienda",
    ],
    ideas: ["Terraza", "Balcón", "Porche", "Ático"],
    seoTitle: "Cerramientos de terrazas y balcones",
    seoDescription:
      "Cerramientos de cristal y aluminio para terrazas, balcones y porches en Crevillente, Elche y el Baix Vinalopó. Presupuesto orientativo online.",
  },
  {
    slug: "aluminio",
    name: "Aluminio",
    short: "Carpintería de aluminio y ventanas",
    headline: "Carpintería de aluminio y ventanas que aíslan",
    intro:
      "Fabricamos ventanas, puertas y correderas de aluminio a medida, con el acristalamiento adecuado para cada caso: desde cristal simple hasta doble acristalamiento con cámara y cristal acústico.",
    features: [
      "Ventanas abatibles, oscilobatientes y correderas",
      "Puertas de aluminio y balconeras",
      "Doble acristalamiento con cámara y cristal acústico",
      "Variedad de colores y acabados",
      "Sustitución de cristales en carpintería existente",
    ],
    ideas: ["Ventanas", "Correderas", "Puertas", "Balconeras"],
    seoTitle: "Carpintería de aluminio y ventanas",
    seoDescription:
      "Ventanas, puertas y correderas de aluminio a medida en el Baix Vinalopó. Doble acristalamiento y cristal acústico. Calcula tu presupuesto orientativo.",
  },
  {
    slug: "barandillas",
    name: "Barandillas",
    short: "Barandillas de vidrio y aluminio",
    headline: "Barandillas de vidrio: seguridad sin perder vistas",
    intro:
      "Instalamos barandillas de vidrio y aluminio para escaleras, balcones, terrazas y piscinas. El vidrio laminado de seguridad protege sin cortar la luz ni las vistas.",
    features: [
      "Vidrio laminado de seguridad",
      "Escaleras, balcones, terrazas y piscinas",
      "Sistemas con perfil inferior, pinzas o pasamanos",
      "Acabados en aluminio y acero",
      "Interior y exterior",
    ],
    ideas: ["Escalera", "Balcón", "Piscina", "Terraza"],
    seoTitle: "Barandillas de vidrio y aluminio",
    seoDescription:
      "Barandillas de vidrio laminado y aluminio para escaleras, balcones y piscinas en Crevillente y el Baix Vinalopó. Presupuesto orientativo online.",
  },
  {
    slug: "armarios",
    name: "Armarios",
    short: "Puertas de armario en cristal",
    headline: "Puertas de armario en cristal y espejo",
    intro:
      "Renovamos tus armarios con puertas de cristal lacado, espejo o cristal decorativo, correderas o abatibles. Una forma sencilla de dar un aire nuevo al dormitorio o al vestidor.",
    features: [
      "Puertas correderas y abatibles",
      "Cristal lacado, espejo, ahumado o al ácido",
      "Herrajes básicos o premium",
      "Medidas a tu hueco",
      "Vestidores y armarios empotrados",
    ],
    ideas: ["Dormitorio", "Vestidor", "Empotrado", "Recibidor"],
    seoTitle: "Puertas de armario de cristal",
    seoDescription:
      "Puertas de armario en cristal lacado, espejo o ahumado, correderas o abatibles, a medida en el Baix Vinalopó.",
  },
  {
    slug: "domino",
    name: "Dominó",
    short: "Paneles de vidrio decorativos y divisores",
    headline: "Paneles de vidrio decorativos y divisores",
    intro:
      "Separa ambientes sin perder luz con paneles y divisores de vidrio. Ideales para cocinas abiertas, despachos, duchas de obra o cualquier espacio que necesite privacidad sin muros.",
    features: [
      "Divisores de ambientes y separadores",
      "Cristal transparente, al ácido o decorativo",
      "Con o sin perfilería",
      "Combinables en módulos",
      "Para vivienda, oficina y comercio",
    ],
    ideas: ["Cocina abierta", "Despacho", "Oficina", "Ducha de obra"],
    seoTitle: "Paneles de vidrio decorativos y divisores",
    seoDescription:
      "Paneles y divisores de vidrio decorativo para separar ambientes con luz en Crevillente y el Baix Vinalopó.",
  },
  {
    slug: "otros",
    name: "Otros trabajos",
    short: "Cristales sueltos y trabajos especiales",
    headline: "Cristales sueltos y trabajos especiales",
    intro:
      "Cortamos cristal a medida para cualquier uso: sobremesas, estanterías, vitrinas, cuadros, sustitución de cristales rotos y encargos especiales. Si es de vidrio, cuéntanos qué necesitas.",
    features: [
      "Cristal a medida para sobremesas y estanterías",
      "Sustitución de cristales rotos",
      "Vitrinas y cuadros",
      "Cantos, taladros y formas especiales",
      "Encargos para comercios y profesionales",
    ],
    ideas: ["Sobremesa", "Estantería", "Vitrina", "Reposición"],
    seoTitle: "Cristales a medida y trabajos especiales",
    seoDescription:
      "Cristales a medida, sobremesas, estanterías, vitrinas y sustitución de cristales rotos en el Baix Vinalopó.",
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
