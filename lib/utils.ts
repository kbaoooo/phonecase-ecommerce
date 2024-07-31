import { type ClassValue, clsx } from "clsx"
import { Metadata } from "next"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: 'currency',
    currency: 'USD',
  })
  return formatter.format(price)
}

export function contructMetadata({
  title= "CaseCobra - custom high-quality phone cases",
  description= "CaseCobra offers custom high-quality phone cases that are durable and scratch-resistant. Design your own case today!",
  image= '/thumbnail.png',
  icons= '/favicon.ico',
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: '@casecobra-kbao',
    },
    icons,
    metadataBase: new URL('https://phonecase-ecommerce-cobro.vercel.app/'),
  }
}
