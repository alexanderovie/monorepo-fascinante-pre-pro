import type { ReactNode, ComponentProps } from 'react';

/**
 * MDX Components
 * Actualizado: Noviembre 2025
 * Componentes customizados con espaciado profesional estándar de la industria
 * Basado en documentación oficial: https://github.com/hashicorp/next-mdx-remote
 * Espaciado entre párrafos: 32px (mb-8) - Estándar profesional 2025
 * Interlineado: 1.625x (leading-relaxed) - Mejora legibilidad
 */

// Definición de componentes MDX compatible con next-mdx-remote
// Según documentación oficial, no requiere tipos especiales de 'mdx/types'
export const mdxComponents = {
  // Párrafos - Espaciado profesional estándar
  p: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'p'>) => (
    <p
      className="text-lg text-gray-800 dark:text-neutral-200 mb-8 leading-relaxed"
      {...props}
    >
      {children}
    </p>
  ),

  // Headings con espaciado vertical profesional
  h1: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'h1'>) => (
    <h1
      className="text-3xl font-bold lg:text-5xl dark:text-white mt-12 mb-6 first:mt-0"
      {...props}
    >
      {children}
    </h1>
  ),

  h2: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'h2'>) => (
    <h2
      className="text-2xl font-semibold dark:text-white mt-12 mb-6 first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),

  h3: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'h3'>) => (
    <h3
      className="text-xl font-semibold lg:text-2xl dark:text-white mt-8 mb-4"
      {...props}
    >
      {children}
    </h3>
  ),

  // Links - mismo estilo que el HTML original
  a: ({ href, children, ...props }: { children?: ReactNode; href?: string } & ComponentProps<'a'>) => (
    <a
      href={href}
      className="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500"
      {...props}
    >
      {children}
    </a>
  ),

  // Listas - Espaciado profesional
  ul: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'ul'>) => (
    <ul
      className="list-disc list-outside space-y-4 ps-5 text-lg text-gray-800 dark:text-neutral-200 my-8"
      {...props}
    >
      {children}
    </ul>
  ),

  ol: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'ol'>) => (
    <ol
      className="list-decimal list-outside space-y-4 ps-5 text-lg text-gray-800 dark:text-neutral-200 my-8"
      {...props}
    >
      {children}
    </ol>
  ),

  li: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'li'>) => (
    <li className="ps-2 leading-relaxed" {...props}>
      {children}
    </li>
  ),

  // Blockquotes - Espaciado vertical mejorado
  blockquote: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'blockquote'>) => (
    <blockquote
      className="text-center p-4 sm:px-7 my-8"
      {...props}
    >
      {children}
    </blockquote>
  ),

  // Imágenes - usando Next.js Image con el mismo estilo
  img: ({ src, alt, ...props }: { src?: string; alt?: string } & ComponentProps<'img'>) => {
    // Si es una URL externa, usar Image de Next.js
    if (src && (src.startsWith('http') || src.startsWith('//'))) {
      return (
        <img
          src={src}
          alt={alt || ''}
          className="w-full object-cover rounded-xl"
          {...props}
        />
      );
    }
    // Para rutas locales - usar img normal ya que no tenemos las dimensiones exactas
    return (
      <img
        src={src || ''}
        alt={alt || ''}
        className="w-full object-cover rounded-xl"
        {...props}
      />
    );
  },

  // Figures - Espaciado vertical profesional para imágenes
  figure: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'figure'>) => (
    <figure className="my-8" {...props}>
      {children}
    </figure>
  ),

  figcaption: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'figcaption'>) => (
    <figcaption
      className="mt-3 text-sm text-center text-gray-500 dark:text-neutral-500"
      {...props}
    >
      {children}
    </figcaption>
  ),

  // Divs con clases específicas (para grids de imágenes, etc.)
  // Mantener clases exactas - el espaciado lo manejan los párrafos circundantes
  div: ({ className, children, ...props }: { className?: string; children?: ReactNode } & ComponentProps<'div'>) => {
    // Mantener clases específicas sin modificarlas
    // El espaciado vertical se maneja por los párrafos antes/después
    if (className) {
      return (
        <div className={className} {...props}>
          {children}
        </div>
      );
    }
    return <div {...props}>{children}</div>;
  },

  // Strong/Bold
  strong: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'strong'>) => (
    <strong className="font-semibold" {...props}>
      {children}
    </strong>
  ),

  // Emphasis/Italic
  em: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'em'>) => (
    <em {...props}>{children}</em>
  ),

  // Code blocks - Espaciado vertical profesional
  code: ({ children, className, ...props }: { children?: ReactNode; className?: string } & ComponentProps<'code'>) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="px-1 py-0.5 rounded bg-gray-100 dark:bg-neutral-800 text-sm font-mono text-gray-800 dark:text-neutral-200"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },

  pre: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'pre'>) => (
    <pre
      className="p-4 rounded-lg bg-gray-100 dark:bg-neutral-800 overflow-x-auto my-8"
      {...props}
    >
      {children}
    </pre>
  ),

  // Horizontal rule
  hr: ({ ...props }: ComponentProps<'hr'>) => (
    <hr
      className="my-8 border-gray-200 dark:border-neutral-700"
      {...props}
    />
  ),

  // Tablas - Estilos profesionales y responsive
  table: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'table'>) => (
    <div className="my-8 overflow-x-auto">
      <table
        className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700 border border-gray-200 dark:border-neutral-700 rounded-lg"
        {...props}
      >
        {children}
      </table>
    </div>
  ),

  thead: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'thead'>) => (
    <thead
      className="bg-gray-50 dark:bg-neutral-800"
      {...props}
    >
      {children}
    </thead>
  ),

  tbody: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'tbody'>) => (
    <tbody
      className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-neutral-700"
      {...props}
    >
      {children}
    </tbody>
  ),

  tr: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'tr'>) => (
    <tr
      className="hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
      {...props}
    >
      {children}
    </tr>
  ),

  th: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'th'>) => (
    <th
      scope="col"
      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-neutral-300 uppercase tracking-wider"
      {...props}
    >
      {children}
    </th>
  ),

  td: ({ children, ...props }: { children?: ReactNode } & ComponentProps<'td'>) => (
    <td
      className="px-6 py-4 text-sm text-gray-800 dark:text-neutral-200 leading-relaxed"
      {...props}
    >
      {children}
    </td>
  ),
};
