"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useTranslations } from 'next-intl';

import { Button } from "@/components/ui/button";

interface Banner2Props {
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  defaultVisible?: boolean;
}

const Banner2 = ({
  title = "Version 2.0 is now available!",
  description = "Read the full release notes",
  linkText = "here",
  linkUrl = "#",
  defaultVisible = true,
}: Banner2Props) => {
  const [isVisible, setIsVisible] = useState(defaultVisible);
  const t = useTranslations('banner');

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 w-full py-3">
      <div className="max-w-[85rem] w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <span className="text-sm text-white">
              <span className="font-medium">{title}</span>{" "}
              <span className="text-white/90">
                {description}{" "}
                <a
                  href={linkUrl}
                  className="hover:text-white underline underline-offset-2 font-medium"
                  target="_blank"
                >
                  {linkText}
                </a>
                .
              </span>
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 h-8 w-8 flex-none text-white hover:bg-white/20 hover:text-white"
            onClick={handleClose}
            aria-label={t('closeButton')}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">{t('closeButton')}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export { Banner2 };
