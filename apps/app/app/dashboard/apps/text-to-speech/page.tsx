import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import TextToSpeechClient from "@/components/text-to-speech/TextToSpeechClient";

export async function generateMetadata(): Promise<Metadata> {
  return generateMeta({
    title: "Text to Speech",
    description:
      "Text to speech app is a ui template that converts written text into spoken audio. Built with shadcn/ui, Tailwind CSS, Next.js and React.",
    canonical: "/dashboard/apps/text-to-speech",
  });
}

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-neutral-900">
      <div className="p-2 sm:p-5 sm:py-0 md:pt-5">
        <div className="max-w-4xl mx-auto">
          <TextToSpeechClient />
        </div>
      </div>
    </div>
  );
}
