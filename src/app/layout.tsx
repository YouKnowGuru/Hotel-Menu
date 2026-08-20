import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/providers/providers";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://menustudio.app";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "MenuStudio — Premium Menu Creator",
    template: "%s — MenuStudio",
  },
  description:
    "Design professional restaurant menus in minutes. Premium templates, intuitive visual editor, print-quality exports.",
  keywords: [
    "menu creator", "restaurant menu", "menu design", "food menu",
    "cafe menu", "hotel menu", "menu template", "print menu",
  ],
  openGraph: {
    title: "MenuStudio — Premium Menu Creator",
    description: "Design professional restaurant menus in minutes.",
    type: "website",
    siteName: "MenuStudio",
    url: BASE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "MenuStudio — Premium Menu Creator",
    description: "Design professional restaurant menus in minutes.",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      name: "MenuStudio",
      url: BASE_URL,
      description:
        "Premium menu creator for restaurants, cafes, and hotels with professional templates and print-quality exports.",
    },
    {
      "@type": "WebApplication",
      "@id": `${BASE_URL}/#webapp`,
      name: "MenuStudio",
      url: BASE_URL,
      applicationCategory: "DesignApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Cormorant+Garamond:wght@300;400;500;600;700&family=Crimson+Text:wght@400;600;700&family=Dancing+Script:wght@400;700&family=Great+Vibes&family=Inter:wght@300;400;500;600;700&family=Lora:wght@400;500;600;700&family=Merriweather:wght@300;400;700&family=Montserrat:wght@300;400;500;600;700&family=Oswald:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Raleway:wght@300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body
        className="font-sans"
        // Browser security/wallet extensions (e.g. Bitdefender) inject
        // attributes like `bis_register` into <body> before hydration —
        // suppress the resulting attribute-level mismatch warnings.
        suppressHydrationWarning
      >
        {/* Apply the persisted theme and strip browser-extension injected attributes (e.g. Bitdefender bis_skin_checked) before React hydration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem("menustudio-theme");
                if (t === "light") {
                  document.documentElement.classList.add("light");
                  document.documentElement.classList.remove("dark");
                }
              } catch(e) {}
              try {
                var clean = function(el) {
                  if (el && el.removeAttribute) {
                    el.removeAttribute("bis_skin_checked");
                    el.removeAttribute("bis_register");
                    el.removeAttribute("bis_size");
                  }
                };
                if (typeof MutationObserver !== "undefined") {
                  new MutationObserver(function(mutations) {
                    for (var i = 0; i < mutations.length; i++) {
                      var m = mutations[i];
                      if (m.type === "attributes" && (m.attributeName === "bis_skin_checked" || m.attributeName === "bis_register" || m.attributeName === "bis_size")) {
                        clean(m.target);
                      }
                    }
                  }).observe(document.documentElement, {
                    attributes: true,
                    subtree: true,
                    attributeFilter: ["bis_skin_checked", "bis_register", "bis_size"]
                  });
                }
              } catch(e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
