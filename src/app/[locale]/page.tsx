import { getTranslations } from "next-intl/server";

import MainContact from "@/components/home/main-contact";
import MainIntro from "@/components/home/main-intro";
import MainPartner from "@/components/home/main-partner";
import MainReview from "@/components/home/main-review";
import MainService from "@/components/home/main-service";
import MainVision from "@/components/home/main-vision";
import MainVisual from "@/components/home/main-visual";
import LandingLayout from "@/components/layout/landingLayout";

import "aos/dist/aos.css";

type PageProps = {
    params: Promise<{ locale: string }>;
};

export async function generateMetadata(props: PageProps) {
    const params = await props.params;

    const { locale } = params;

    const t = await getTranslations({ locale, namespace: "meta-data" });

    return {
        title: t("title"),
        description: t("description"),
        robots: "index, follow",
        openGraph: {
            // Display for link share
            title: t("title"),
            description: t("description"),
            type: "website",
            url: `${process.env.NEXT_PUBLIC_DOMAIN}`,
            siteName: t("title"),
            images: [
                {
                    url: `${process.env.NEXT_PUBLIC_DOMAIN}/assets/image/visual_sub_bg01_min.jpg`,
                    width: 1200,
                    height: 630,
                    alt: t("title")
                }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: t("title"),
            description: t("description"),
            images: [`${process.env.NEXT_PUBLIC_DOMAIN}/assets/image/visual_sub_bg01_min.jpg`]
        },
        verification: {
            google: "VAIkfEdIFtQGwxzgb2hWwz8gqSeTHMb1wvJAYtgnAyQ",
            other: {
                "naver-site-verification": "b13d8ba1475e8c4e2d78d21739c5460a94a5344a"
            }
        },
        alternates: {
            canonical: `${process.env.NEXT_PUBLIC_DOMAIN}`
        }
    };
}

export default async function Home() {
    return (
        <LandingLayout>
            <MainVisual />
            <MainIntro />
            <MainVision />
            <MainService />
            <MainPartner />
            <MainReview />
            <MainContact />
        </LandingLayout>
    );
}
