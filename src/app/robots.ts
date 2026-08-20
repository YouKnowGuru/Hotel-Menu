import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/editor/", "/projects/", "/settings/", "/brand-kit/", "/profile/", "/reset-password"],
      },
    ],
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || "https://menustudio.app"}/sitemap.xml`,
  };
}
