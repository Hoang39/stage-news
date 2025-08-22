import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "라이브스테이지 (STAGE) - 팬덤 문화 플랫폼",
        short_name: "STAGE",
        description:
            "라이브스테이지(STAGE/스테이지)는 팬덤과 아티스트가 직간접적으로 소통 할 수 있는 글로벌 팬덤 콘텐츠 커머스 플랫폼입니다.",
        lang: "ko",
        start_url: "/",
        display: "standalone",
        background_color: "black",
        theme_color: "black",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "any",
                type: "image/x-icon"
            }
        ]
    };
}
