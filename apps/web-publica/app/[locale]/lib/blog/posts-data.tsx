import type { BlogPost } from './types';

/**
 * Blog Posts Mock Data
 * Actualizado: Noviembre 2025
 * Datos de ejemplo para desarrollo
 * Futuro: Reemplazar con CMS o base de datos
 */

export const mockBlogPosts: BlogPost[] = [
  {
    slug: 'announcing-free-plan-small-teams',
    title: 'Announcing a free plan for small teams',
    excerpt: 'At preline, our mission has always been focused on bringing openness and transparency to the design process.',
    content: `
      <p class="text-lg text-gray-800 dark:text-neutral-200">At preline, our mission has always been focused on bringing openness and transparency to the design process. We've always believed that by providing a space where designers can share ongoing work not only empowers them to make better products, it also helps them grow.</p>

      <p class="text-lg text-gray-800 dark:text-neutral-200">We're proud to be a part of creating a more open culture and to continue building a product that supports this vision.</p>

      <div class="text-center">
        <div class="grid lg:grid-cols-2 gap-3">
          <div class="grid grid-cols-2 lg:grid-cols-1 gap-3">
            <figure class="relative w-full h-60">
              <img class="size-full absolute top-0 start-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80" alt="Blog Image">
            </figure>
            <figure class="relative w-full h-60">
              <img class="size-full absolute top-0 start-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1671726203638-83742a2721a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80" alt="Blog Image">
            </figure>
          </div>
          <figure class="relative w-full h-72 sm:h-96 lg:h-full">
            <img class="size-full absolute top-0 start-0 object-cover rounded-xl" src="https://images.unsplash.com/photo-1671726203394-491c8b574a0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80" alt="Blog Image">
          </figure>
        </div>
        <span class="mt-3 block text-sm text-center text-gray-500 dark:text-neutral-500">Working process</span>
      </div>

      <p class="text-lg text-gray-800 dark:text-neutral-200">As we've grown, we've seen how Preline has helped companies such as Spotify, Microsoft, Airbnb, Facebook, and Intercom bring their designers closer together to create amazing things. We've also learned that when the culture of sharing is brought in earlier, the better teams adapt and communicate with one another.</p>

      <p class="text-lg text-gray-800 dark:text-neutral-200">That's why we are excited to share that we now have a <a class="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">free version of Preline</a>, which will allow individual designers, startups and other small teams a chance to create a culture of openness early on.</p>

      <blockquote class="text-center p-4 sm:px-7">
        <p class="text-xl font-medium text-gray-800 lg:text-2xl lg:leading-normal xl:text-2xl xl:leading-normal dark:text-neutral-200">
          To say that switching to Preline has been life-changing is an understatement. My business has tripled and I got my life back.
        </p>
        <p class="mt-5 text-gray-800 dark:text-neutral-200">Nicole Grazioso</p>
      </blockquote>

      <figure>
        <img class="w-full object-cover rounded-xl" src="https://images.unsplash.com/photo-1671726203454-488ab18f7eda?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80" alt="Blog Image">
        <figcaption class="mt-3 text-sm text-center text-gray-500 dark:text-neutral-500">A man and a woman looking at a cell phone.</figcaption>
      </figure>

      <div class="space-y-3">
        <h3 class="text-2xl font-semibold dark:text-white">Bringing the culture of sharing to everyone</h3>
        <p class="text-lg text-gray-800 dark:text-neutral-200">We know the power of sharing is real, and we want to create an opportunity for everyone to try Preline and explore how transformative open communication can be. Now you can have a team of one or two designers and unlimited spectators (think PMs, management, marketing, etc.) share work and explore the design process earlier.</p>
      </div>

      <ul class="list-disc list-outside space-y-5 ps-5 text-lg text-gray-800 dark:text-neutral-200">
        <li class="ps-2">Preline allows us to collaborate in real time and is a really great way for leadership on the team to stay up-to-date with what everybody is working on," <a class="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">said</a> Stewart Scott-Curran, Intercom's Director of Brand Design.</li>
        <li class="ps-2">Preline opened a new way of sharing. It's a persistent way for everyone to see and absorb each other's work," said David Scott, Creative Director at <a class="text-blue-600 decoration-2 hover:underline focus:outline-hidden focus:underline font-medium dark:text-blue-500" href="#">Eventbrite</a>.</li>
      </ul>

      <p class="text-lg text-gray-800 dark:text-neutral-200">Small teams and individual designers need a space where they can watch the design process unfold, both for themselves and for the people they work with – no matter if it's a fellow designer, product manager, developer or client. Preline allows you to invite more people into the process, creating a central place for conversation around design. As those teams grow, transparency and collaboration becomes integrated in how they communicate and work together.</p>
    `,
    author: {
      name: 'Leyla Ludic',
      role: 'UI/UX enthusiast',
      avatar: 'https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
    },
    date: '2023-01-18T00:00:00Z',
    category: 'Company News',
    images: {
      main: 'https://images.unsplash.com/photo-1670272505340-d906d8d77d03?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80',
      gallery: [
        'https://images.unsplash.com/photo-1671726203638-83742a2721a1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80',
        'https://images.unsplash.com/photo-1671726203394-491c8b574a0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=560&q=80',
      ],
    },
    tags: ['Plan', 'Web development', 'Free', 'Team'],
    relatedPosts: [
      '5-reasons-not-start-ux-designer-career',
      'ux-portfolio-20-percent-well-done',
      '7-principles-icon-design',
    ],
  },
  {
    slug: '5-reasons-not-start-ux-designer-career',
    title: '5 Reasons to Not start a UX Designer Career in 2022/2023',
    excerpt: 'Exploring the challenges and considerations for starting a UX design career.',
    content: '<p>Content for 5 Reasons article...</p>',
    author: {
      name: 'Leyla Ludic',
      role: 'UI/UX enthusiast',
      avatar: 'https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
    },
    date: '2023-02-15T00:00:00Z',
    category: 'Career',
    images: {
      main: 'https://images.unsplash.com/photo-1567016526105-22da7c13161a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80',
    },
    tags: ['UX', 'Career', 'Design'],
  },
  {
    slug: 'ux-portfolio-20-percent-well-done',
    title: 'If your UX Portfolio has this 20% Well Done, it Will Give You an 80% Result',
    excerpt: 'Learn how to optimize your UX portfolio for maximum impact.',
    content: '<p>Content for UX Portfolio article...</p>',
    author: {
      name: 'Leyla Ludic',
      role: 'UI/UX enthusiast',
      avatar: 'https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
    },
    date: '2023-03-10T00:00:00Z',
    category: 'Portfolio',
    images: {
      main: 'https://images.unsplash.com/photo-1542125387-c71274d94f0a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80',
    },
    tags: ['UX', 'Portfolio', 'Design'],
  },
  {
    slug: '7-principles-icon-design',
    title: '7 Principles of Icon Design',
    excerpt: 'Essential principles for creating effective and memorable icons.',
    content: '<p>Content for Icon Design article...</p>',
    author: {
      name: 'Leyla Ludic',
      role: 'UI/UX enthusiast',
      avatar: 'https://images.unsplash.com/photo-1669837401587-f9a4cfe3126e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=320&h=320&q=80',
    },
    date: '2023-04-05T00:00:00Z',
    category: 'Design',
    images: {
      main: 'https://images.unsplash.com/photo-1586232702178-f044c5f4d4b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=320&q=80',
    },
    tags: ['Icons', 'Design', 'UI'],
  },
];
