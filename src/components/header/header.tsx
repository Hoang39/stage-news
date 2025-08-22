"use client";

import { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useScrollLink } from "@/hooks/useScrollLink";

import images from "../../../public/assets/image/images";
import Dropdown from "../dropdown";

const OFFSET = 97;

const Header = () => {
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
        if (searchParams.get("sec")) {
            const position = document.getElementById(searchParams.get("sec") as string)?.offsetTop as number;
            window.scrollTo({ top: position - OFFSET, behavior: "smooth" });
        }
    }, [searchParams]);

    return (
        <div className='header'>
            <dl>
                <div>
                    <Link href='/'>
                        <Image src={images.favicon} height={36} alt='logo' title='logo' />
                        &nbsp;&nbsp;
                        <Image src={images.logo.logo_white} height='30' alt='로고' title='로고' />
                    </Link>
                </div>
                <dd>
                    <span onClick={() => scrollLink(1, OFFSET)}>{t("about-us")}</span>
                    <span onClick={() => scrollLink(2, OFFSET)}>{t("our-service")}</span>
                    <span onClick={() => scrollLink(3, OFFSET)}>{t("partnership")}</span>
                    <span onClick={() => scrollLink(4, OFFSET)}>{t("contact")}</span>
                    <Link href='/news'>{t("news")}</Link>
                </dd>
                <dt>
                    <Link href='https://forms.gle/5aveJHGHoe83zbiD7' target='_blank'>
                        {t("collab")}
                    </Link>
                    <Dropdown
                        trigger={
                            <button className='dropdown-trigger-btn'>
                                {currentLocale == "ko" && (
                                    <>
                                        <Image src={images.flag.flag_kor} height='12' alt='' title='' /> KOR
                                    </>
                                )}
                                {currentLocale == "en" && (
                                    <>
                                        <Image src={images.flag.flag_eng} height='12' alt='' title='' /> ENG
                                    </>
                                )}
                                <i className='fa-light fa-chevron-down' />
                            </button>
                        }
                        items={[
                            {
                                label: "KOR",
                                icon: <Image src={images.flag.flag_kor} height='12' alt='' title='' />,
                                onClick: () => {
                                    if (currentLocale == "en") handleChange("ko");
                                }
                            },
                            {
                                label: "ENG",
                                icon: <Image src={images.flag.flag_eng} height='12' alt='' title='' />,
                                onClick: () => {
                                    if (currentLocale == "ko") handleChange("en");
                                }
                            }
                        ]}
                        align='left'
                        width='40px'
                    />
                </dt>
            </dl>
        </div>
    );
};

export default Header;
