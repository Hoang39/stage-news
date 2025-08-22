"use client";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname, useRouter, useSearchParams } from "next/navigation";

import gsap from "gsap";
import { useLocale, useTranslations } from "next-intl";

import { useScrollLink } from "@/hooks/useScrollLink";

import images from "../../../public/assets/image/images";

const OFFSET = 52;

const HeaderMobile = () => {
    const currentLocale = useLocale();
    const currentPathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();
    const scrollLink = useScrollLink();
    const t = useTranslations("user-info.header");

    const handleChange = (newLocale: string) => {
        const days = 30;
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        const expires = date.toUTCString();
        document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`;

        router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`));

        router.refresh();
    };

    useEffect(() => {
        const mobileLnbOpen = document.querySelector("#mobileLnbOpen");
        const mobileLnbClose = document.querySelector("#mobileLnbClose");
        const hmMenu = document.querySelector(".hm-menu");
        const hmBg = document.querySelector(".hm-bg");

        const openMenu = () => {
            gsap.to(hmMenu, {
                marginRight: "0",
                duration: 0.35,
                ease: "power2.out"
            });
            gsap.set(hmBg, { marginLeft: "0" });
        };

        const closeMenu = () => {
            gsap.to(hmMenu, {
                marginRight: "-320px",
                duration: 0.35,
                ease: "power2.out"
            });
            gsap.set(hmBg, { marginLeft: "100%" });
        };

        const closeMenuOnBackgroundClick = () => {
            gsap.to(hmMenu, {
                marginRight: "-320px",
                duration: 0.35,
                ease: "power2.out"
            });
            gsap.set(hmBg, { marginLeft: "100%" });
        };

        mobileLnbOpen?.addEventListener("click", openMenu);
        mobileLnbClose?.addEventListener("click", closeMenu);
        hmBg?.addEventListener("click", closeMenuOnBackgroundClick);

        return () => {
            mobileLnbOpen?.removeEventListener("click", openMenu);
            mobileLnbClose?.removeEventListener("click", closeMenu);
            hmBg?.removeEventListener("click", closeMenuOnBackgroundClick);
        };
    }, []);

    useEffect(() => {
        if (searchParams.get("sec")) {
            const position = document.getElementById(searchParams.get("sec") as string)?.offsetTop as number;
            window.scrollTo({ top: position - OFFSET, behavior: "smooth" });
        }
    }, [searchParams]);

    return (
        <div className='header-mobile'>
            <dl className='hm-header'>
                <dt>
                    <Link href='/'>
                        <Image src={images.favicon} height={22} alt='logo' title='logo' />
                        &nbsp;&nbsp;
                        <Image src={images.logo.logo_white} height='20' alt='' title='' />
                    </Link>
                </dt>
                <dd>
                    <span id='mobileLnbOpen'>
                        <i className='fa-sharp fa-regular fa-bars'></i>
                    </span>
                </dd>
            </dl>
            <div className='hm-menu'>
                <dl>
                    <dt>{t("site-menu")}</dt>
                    <dd id='mobileLnbClose'>
                        <i className='fa-light fa-xmark'></i>
                    </dd>
                </dl>

                <div id='cssmenu'>
                    <ul>
                        <li>
                            <span onClick={() => scrollLink(1, OFFSET)}>
                                <em>
                                    <i className='fa-light fa-building'></i>
                                </em>{" "}
                                <span>{t("about-us-mobile")}</span>
                            </span>
                        </li>
                        <li>
                            <span onClick={() => scrollLink(2, OFFSET)}>
                                <em>
                                    <i className='fa-light fa-film'></i>
                                </em>{" "}
                                <span>{t("our-service-mobile")}</span>
                            </span>
                        </li>
                        <li>
                            <span onClick={() => scrollLink(3, OFFSET)}>
                                <em>
                                    <i className='fa-light fa-handshake'></i>
                                </em>{" "}
                                <span>{t("partnership-mobile")}</span>
                            </span>
                        </li>
                        <li>
                            <span onClick={() => scrollLink(4, OFFSET)}>
                                <em>
                                    <i className='fa-light fa-pen-to-square'></i>
                                </em>{" "}
                                <span>{t("contact-mobile")}</span>
                            </span>
                        </li>
                        <li>
                            <span onClick={() => redirect("/news")}>
                                <em>
                                    <i className='fa-light fa-newspaper'></i>
                                </em>{" "}
                                <span>{t("news-mobile")}</span>
                            </span>
                        </li>
                    </ul>
                </div>

                <h2>
                    <p>
                        <span
                            onClick={() => {
                                if (currentLocale == "en") handleChange("ko");
                            }}
                            className={`${currentLocale == "ko" && "active"}`}
                        >
                            <Image src={images.flag.flag_kor} height='13' alt='' title='' />
                            <span>KOR</span>
                        </span>
                        <span
                            onClick={() => {
                                if (currentLocale == "ko") handleChange("en");
                            }}
                            className={`${currentLocale == "en" && "active"}`}
                        >
                            <Image src={images.flag.flag_eng} height='13' alt='' title='' />
                            <span>ENG</span>
                        </span>
                    </p>
                    <Link href='https://forms.gle/5aveJHGHoe83zbiD7' target='_blank'>
                        <i className='fa-light fa-comment-lines'></i> {t("collab")}
                    </Link>
                </h2>
            </div>
            <div className='hm-bg'></div>
        </div>
    );
};

export default HeaderMobile;
