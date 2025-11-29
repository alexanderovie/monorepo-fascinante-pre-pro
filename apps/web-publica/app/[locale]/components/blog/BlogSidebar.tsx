import type { BlogPost } from '../../lib/blog/types';
import { getPost } from '../../lib/blog/get-post';
import { Link } from '../../../../i18n/navigation';
import Image from 'next/image';

/**
 * BlogSidebar Component
 * Actualizado: Noviembre 2025
 * Sidebar con información del autor y artículos relacionados
 */

interface BlogSidebarProps {
  post: BlogPost;
}

export default async function BlogSidebar({ post }: BlogSidebarProps) {
  // Obtener artículos relacionados
  const relatedPostsPromises = post.relatedPosts
    ? post.relatedPosts.slice(0, 3).map((slug) => getPost(slug))
    : [];

  const relatedPostsResults = await Promise.all(relatedPostsPromises);
  const relatedPosts = relatedPostsResults.filter((p): p is BlogPost => p !== null);

  return (
    <div className="lg:col-span-1 lg:w-full lg:h-full lg:bg-linear-to-r lg:from-gray-50 lg:via-transparent lg:to-transparent dark:from-neutral-800">
      <div className="sticky top-0 start-0 py-8 lg:ps-8">
        {/* Avatar Media */}
        <div className="group flex items-center gap-x-3 border-b border-gray-200 pb-8 mb-8 dark:border-neutral-700">
          <Link href="#" className="block shrink-0 focus:outline-hidden">
            {post.author.avatar ? (
              <Image
                className="size-10 rounded-full"
                src={post.author.avatar}
                alt={post.author.name}
                width={40}
                height={40}
              />
            ) : (
              <div className="size-10 rounded-full bg-gray-200 dark:bg-neutral-700 flex items-center justify-center">
                <span className="text-gray-600 dark:text-neutral-400 text-sm font-semibold">
                  {post.author.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </Link>

          <Link href="" className="group grow block focus:outline-hidden">
            <h5 className="group-hover:text-gray-600 group-focus:text-gray-600 text-sm font-semibold text-gray-800 dark:group-hover:text-neutral-400 dark:group-focus:text-neutral-400 dark:text-neutral-200">
              {post.author.name}
            </h5>
            <p className="text-sm text-gray-500 dark:text-neutral-500">
              {post.author.role || 'Author'}
            </p>
          </Link>

          <div className="grow">
            <div className="flex justify-end">
              <button
                type="button"
                className="py-1.5 px-2.5 inline-flex items-center gap-x-2 text-xs font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
              >
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
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" x2="19" y1="8" y2="14" />
                  <line x1="22" x2="16" y1="11" y2="11" />
                </svg>
                Follow
              </button>
            </div>
          </div>
        </div>
        {/* End Avatar Media */}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="space-y-6">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group flex items-center gap-x-6 focus:outline-hidden"
              >
                <div className="grow">
                  <span className="text-sm font-bold text-gray-800 group-hover:text-blue-600 group-focus:text-blue-600 dark:text-neutral-200 dark:group-hover:text-blue-500 dark:group-focus:text-blue-500">
                    {relatedPost.title}
                  </span>
                </div>

                {relatedPost.images?.main && (
                  <div className="shrink-0 relative rounded-lg overflow-hidden size-20">
                    <Image
                      className="size-full absolute top-0 start-0 object-cover rounded-lg"
                      src={relatedPost.images.main}
                      alt={relatedPost.title}
                      fill
                      sizes="80px"
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
