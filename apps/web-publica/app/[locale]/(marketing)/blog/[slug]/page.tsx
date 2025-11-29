import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';
import BlogArticle from '../../../components/blog/BlogArticle';
import BlogSidebar from '../../../components/blog/BlogSidebar';
import { defaultFooterData } from '../../../lib/footer-data';
import { getPost } from '../../../lib/blog/get-post';

/**
 * Blog Post Page - Dynamic Route
 * Actualizado: Noviembre 2025
 * Ruta dinámica para artículos individuales
 */

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

// ISR: Revalidar cada hora (3600 segundos)
export const revalidate = 3600;

// Permitir generar rutas no pre-renderizadas en runtime
export const dynamicParams = true;

// Cambiar a false si solo quieres servir los pre-renderizados

/**
 * Generate Static Params
 * Pre-renderiza los artículos más recientes en build time
 */
export async function generateStaticParams() {
  try {
    const { getAllPostSlugs } = await import('../../../lib/blog/get-all-posts');
    const slugs = await getAllPostSlugs();

    return slugs.map((slug) => ({
      slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    // Retornar array vacío para evitar fallar el build
    return [];
  }
}

/**
 * Generate Metadata
 * Metadata dinámica para SEO
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const { slug } = await params;
    const post = await getPost(slug);

    if (!post) {
      return {
        title: 'Artículo no encontrado | Blog',
        description: 'El artículo que buscas no existe.',
      };
    }

    return {
      title: `${post.title} | Blog`,
      description: post.excerpt || post.title,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: post.images?.main ? [post.images.main] : [],
        type: 'article',
        publishedTime: post.date,
        authors: [post.author.name],
        tags: post.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: post.images?.main ? [post.images.main] : [],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    // Metadata por defecto en caso de error
    return {
      title: 'Blog',
      description: 'Artículos y noticias',
    };
  }
}

/**
 * Blog Post Page Component
 */
export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params;

  try {
    const post = await getPost(slug);

    if (!post) {
      notFound();
    }

    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          {/* Blog Article */}
          <div className="max-w-[85rem] px-4 sm:px-6 lg:px-8 mx-auto">
            <div className="grid lg:grid-cols-3 gap-y-8 lg:gap-y-0 lg:gap-x-6">
              {/* Content */}
              <BlogArticle post={post} locale={locale} />
              {/* End Content */}

              {/* Sidebar */}
              <BlogSidebar post={post} />
              {/* End Sidebar */}
            </div>
          </div>
          {/* End Blog Article */}
        </main>
        <Footer data={defaultFooterData} />
      </div>
    );
  } catch (error) {
    // Si es error de validación o datos inválidos, 404
    if (error instanceof Error && error.message.includes('not found')) {
      notFound();
    }
    // Otros errores se propagan al error boundary
    throw error;
  }
}
