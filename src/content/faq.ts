/**
 * Preguntas frecuentes. Respuestas de la web anterior; solo se han corregido
 * las que contradecían la política actual de visita técnica (gratis en
 * Crevillente; fuera, 10 € por cada 10 km o fracción).
 */
export type Faq = { q: string; a: string; tags: string[] };

export const faqs: Faq[] = [
  {
    q: "¿Cuánto tiempo tarda un proyecto de principio a fin?",
    a: "Los plazos varían según el tipo y complejidad del proyecto. Generalmente, desde la toma de medidas hasta la instalación final pueden transcurrir entre 7 y 15 días laborables. En proyectos más complejos o a medida, el plazo puede extenderse.",
    tags: ["plazo", "tiempo", "tarda", "cuanto tarda", "semanas", "dias", "pedido personalizado"],
  },
  {
    q: "¿Qué tipos de cristal ofrecéis?",
    a: "Trabajamos con cristal float (básico), templado, laminado, Climalit (doble acristalamiento), acústico y decorativo. Cada tipo tiene características específicas de seguridad, aislamiento y resistencia. Te asesoraremos sobre la mejor opción para tu proyecto.",
    tags: ["tipos", "cristal", "vidrio", "float", "climalit", "acustico", "ventanas", "decorativo"],
  },
  {
    q: "¿El cristal templado es más seguro?",
    a: "Sí, el cristal templado es hasta 5 veces más resistente que el cristal normal. Además, en caso de rotura, se fragmenta en pequeños trozos no cortantes, reduciendo significativamente el riesgo de lesiones. Es obligatorio en mamparas de baño y recomendable en muchas aplicaciones.",
    tags: ["templado", "seguro", "seguridad", "romper", "resistente"],
  },
  {
    q: "¿Ofrecéis garantía en vuestros trabajos?",
    a: "Sí, todos nuestros trabajos incluyen garantía. La duración varía según el tipo de instalación, pero generalmente ofrecemos 2 años en instalaciones y 5 años en defectos de fabricación. Los detalles específicos se especifican en cada presupuesto.",
    tags: ["garantia", "garantias"],
  },
  {
    q: "¿Cómo se limpia y mantiene el cristal?",
    a: "Para el mantenimiento diario, recomendamos usar agua con jabón neutro y una bayeta suave. Evita productos abrasivos o estropajos. Para cristales especiales (antical, mate, decorado), te proporcionaremos instrucciones específicas tras la instalación.",
    tags: ["limpiar", "limpia", "limpieza", "mantener", "mantenimiento", "cal", "antical"],
  },
  {
    q: "¿Cuándo recibiré el presupuesto final?",
    a: "Tras la visita técnica, elaboramos un presupuesto detallado que recibirás en un plazo máximo de 48 horas. El presupuesto incluye todos los costes: materiales, fabricación, transporte e instalación, sin sorpresas.",
    tags: ["presupuesto final", "definitivo", "cuando", "sin compromiso", "48"],
  },
  {
    q: "¿Qué diferencia hay entre cristal laminado y templado?",
    a: "El cristal laminado tiene una lámina de PVB entre dos hojas de vidrio, lo que lo hace muy seguro (los fragmentos quedan adheridos). El templado es más resistente a impactos y cambios de temperatura. Según la aplicación, uno u otro es más adecuado.",
    tags: ["laminado", "diferencia", "pvb"],
  },
  {
    q: "¿Trabajáis fuera del Baix Vinalopó?",
    a: "Nuestra zona principal de actuación es el Baix Vinalopó, pero podemos valorar proyectos en zonas cercanas. Contacta con nosotros para consultar disponibilidad en tu ubicación. El desplazamiento para la visita técnica se calcula a razón de 10 € por cada 10 km desde Crevillente.",
    tags: ["fuera", "zona", "elche", "alicante", "santa pola", "provincia", "murcia", "torrevieja"],
  },
  {
    q: "¿Qué formas de pago aceptáis?",
    a: "Aceptamos transferencia bancaria, efectivo y tarjeta. Habitualmente se solicita un anticipo del 40-50% al confirmar el pedido y el resto al finalizar la instalación. Las condiciones específicas se detallan en cada presupuesto.",
    tags: ["pago", "pagar", "tarjeta", "transferencia", "efectivo", "anticipo"],
  },
  {
    q: "¿La visita técnica tiene coste?",
    a: "La visita técnica para toma de medidas y asesoramiento es gratuita dentro de Crevillente. Fuera de Crevillente cobramos el desplazamiento a razón de 10 € por cada 10 km (o fracción) desde nuestras instalaciones; puedes calcularlo al momento en la calculadora de presupuestos. Sin compromiso: solo si decides contratar procedemos con la fabricación e instalación.",
    tags: ["visita", "tecnica", "coste", "gratis", "gratuita", "medidas", "desplazamiento"],
  },
];
