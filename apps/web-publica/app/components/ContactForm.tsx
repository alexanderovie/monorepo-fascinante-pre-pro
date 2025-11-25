'use client';

import { useState } from 'react';

interface ContactFormProps {
  onSubmit?: (data: FormData) => void;
  className?: string;
}

export default function ContactForm({ onSubmit, className = '' }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    if (onSubmit) {
      await onSubmit(formData);
    } else {
      // Default behavior: simulate API call
      // In production, this would send to an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label
            htmlFor="hs-firstname-contacts"
            className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200"
          >
            First Name
          </label>
          <input
            type="text"
            id="hs-firstname-contacts"
            name="firstname"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            required
          />
        </div>

        <div>
          <label
            htmlFor="hs-lastname-contacts"
            className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200"
          >
            Last Name
          </label>
          <input
            type="text"
            id="hs-lastname-contacts"
            name="lastname"
            className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="hs-email-contacts"
          className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200"
        >
          Email
        </label>
        <input
          type="email"
          id="hs-email-contacts"
          name="email"
          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          required
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="hs-phone-contacts"
          className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200"
        >
          Phone Number
        </label>
        <input
          type="tel"
          id="hs-phone-contacts"
          name="phone"
          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
        />
      </div>

      <div className="mt-4">
        <label
          htmlFor="hs-about-contacts"
          className="block mb-2 text-sm font-medium text-gray-800 dark:text-neutral-200"
        >
          Details
        </label>
        <textarea
          id="hs-about-contacts"
          name="message"
          rows={4}
          className="py-3 px-4 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200 dark:placeholder-neutral-500 dark:focus:ring-neutral-600"
          required
        ></textarea>
      </div>

      <div className="mt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none focus:outline-hidden focus:bg-blue-700 dark:focus:outline-hidden dark:focus:ring-1 dark:focus:ring-gray-600"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}
