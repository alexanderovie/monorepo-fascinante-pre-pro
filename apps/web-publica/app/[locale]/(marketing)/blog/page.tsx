import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Hero from '../../components/Hero';
import { defaultFooterData } from '../../lib/footer-data';
import Image from 'next/image';
import { Link } from '../../../../i18n/navigation';
import { getAllPosts } from '../../lib/blog/get-all-posts';
import { getTranslations } from 'next-intl/server';

/**
 * Blog Page - Página de blog
 * Actualizado: Noviembre 2025
 * Lista de artículos dinámica
 */
export default async function BlogPage() {
  const posts = await getAllPosts({ limit: 12, sortBy: 'date', sortOrder: 'desc' });
  const t = await getTranslations('hero.blog');

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section - Mismo layout que homepage pero sin botones */}
        <Hero
          badge={t('badge')}
          title={t('title')}
          description={t('description')}
          primaryButton={null}
          secondaryButton={null}
          tabs={[]}
          showBackground={false}
        />

        {/* Card Blog */}
        <div className="max-w-[85rem] px-4 py-10 sm:px-6 lg:px-8 lg:py-14 mx-auto">

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.length > 0 ? (
              posts.map((post, index) => {
                // Primer artículo con badge "Sponsored" (opcional)
                const isFirst = index === 0;
                // Tercer artículo con estilo especial (si existe)
                const isThird = index === 2 && posts.length > 2;

                if (isThird && post.images?.main) {
                  // Card con background image (estilo especial)
                  return (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group relative flex flex-col w-full min-h-60 bg-center bg-cover rounded-xl hover:shadow-lg focus:outline-hidden focus:shadow-lg transition"
                      style={{
                        backgroundImage: `url(${post.images.main})`,
                      }}
                    >
                      <div className="flex-auto p-4 md:p-6">
                        <h3 className="text-xl text-white/90 group-hover:text-white">
                          <span className="font-bold">{post.category}</span> {post.title}
                        </h3>
                      </div>
                      <div className="pt-0 p-4 md:p-6">
                        <div className="inline-flex items-center gap-2 text-sm font-medium text-white group-hover:text-white/70 group-focus:text-white/70">
                          Read more
                          <svg
                            className="shrink-0 size-4"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  );
                }

                // Card normal
                return (
                  <Link
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    className="group flex flex-col focus:outline-hidden"
                  >
                    <div className="relative pt-[50%] sm:pt-[70%] rounded-xl overflow-hidden">
                      {post.images?.main ? (
                        <Image
                          className="size-full absolute top-0 start-0 object-cover group-hover:scale-105 group-focus:scale-105 transition-transform duration-500 ease-in-out rounded-xl"
                          src={post.images.main}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="size-full absolute top-0 start-0 bg-gray-200 dark:bg-neutral-700 rounded-xl" />
                      )}
                      {isFirst && (
                        <span className="absolute top-0 end-0 rounded-se-xl rounded-es-xl text-xs font-medium bg-gray-800 text-white py-1.5 px-3 dark:bg-neutral-900">
                          Sponsored
                        </span>
                      )}
                    </div>

                    <div className="mt-7">
                      <h3 className="text-xl font-semibold text-gray-800 group-hover:text-gray-600 dark:text-neutral-300 dark:group-hover:text-white">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="mt-3 text-gray-800 dark:text-neutral-200">{post.excerpt}</p>
                      )}
                      <p className="mt-5 inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 group-hover:underline group-focus:underline font-medium dark:text-blue-500">
                        Read more
                        <svg
                          className="shrink-0 size-4"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="m9 18 6-6-6-6" />
                        </svg>
                      </p>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="col-span-full text-center py-10">
                <p className="text-gray-600 dark:text-neutral-400">No hay artículos disponibles.</p>
              </div>
            )}
          </div>
          {/* End Grid */}
        </div>
        {/* End Card Blog */}
      </main>
      <Footer data={defaultFooterData} />
    </div>
  );
}
