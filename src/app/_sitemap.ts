import { MetadataRoute } from "next";

import prisma from "@/libs/db";
import { Locale, getPathname, routing } from "@/libs/i18n/routing";

// Adapt this as necessary
const host = process.env.NEXT_PUBLIC_DOMAIN;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const newsListEntries: any[] = [];
    try {
        const fetchList = await prisma.news.findMany({
            select: {
                id: true,
                slug: true
            },
            where: {
                site: process.env.NEXT_PUBLIC_SITE,
                disabled: false
            }
        });

        fetchList.forEach((i) => {
            newsListEntries.push(...getEntries({ pathname: "/news/[slug]", params: { slug: i.slug } }));
        });
    } catch (error) {
        console.log("🚀 ~ sitemap ~ error:", error);
    }

    // Adapt this as necessary
    return [...getEntries("/"), ...getEntries("/news"), ...newsListEntries];
}

type Href = Parameters<typeof getPathname>[0]["href"];

function getEntries(href: Href) {
    return routing.locales.map((locale) => ({
        url: getUrl(href, locale),
        alternates: {
            languages: Object.fromEntries(routing.locales.map((cur) => [cur, getUrl(href, cur)]))
        }
    }));
}

function getUrl(href: Href, locale: Locale) {
    const pathname = getPathname({ locale, href });
    return host + pathname;
}
