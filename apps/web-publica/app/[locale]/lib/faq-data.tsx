export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isOpen?: boolean;
}

export const defaultFAQData: FAQItem[] = [
  {
    id: 'why-not-showing',
    question: '¿Por qué mi negocio no aparece en Google?',
    answer:
      'Tu perfil podría no estar verificado u optimizado. Nuestra auditoría gratuita te muestra exactamente qué falta para aparecer cuando tus clientes buscan.',
    isOpen: true,
  },
  {
    id: 'what-included',
    question: '¿Qué incluye la auditoría gratuita?',
    answer:
      'Recibirás un reporte completo con tu visibilidad actual, reseñas, y recomendaciones específicas para mejorar. Todo basado en datos reales de Google Business Profile.',
  },
  {
    id: 'need-website',
    question: '¿Necesito un sitio web para aparecer en Google?',
    answer:
      'No es obligatorio, pero un buen sitio web mejora tu ranking y conversiones. Te ayudamos a entender qué necesitas para mejorar tu visibilidad.',
  },
  {
    id: 'how-long',
    question: '¿Cuánto tiempo toma ver resultados?',
    answer:
      'La mayoría de negocios ven mejoras en 2-4 semanas después de la optimización. Los resultados se miden en tiempo real en tu dashboard.',
  },
  {
    id: 'cancel-anytime',
    question: '¿Puedo cancelar en cualquier momento?',
    answer:
      'Absolutamente. Tú tienes el control total. Sin contratos, sin ataduras.',
  },
];
