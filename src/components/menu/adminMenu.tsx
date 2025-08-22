"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useTranslations } from "next-intl";

import useAuth from "@/hooks/useAuth";
import useUser from "@/hooks/useUser";
import { MenuItem, menuList } from "@/libs/adminRoute";

import images from "../../../public/assets/image/images";

export default function AdminMenu() {
    const t = useTranslations("admin");
    const pathname = usePathname();
    const { user } = useUser();
    const { logout } = useAuth();

    return (
        <div className='lnb'>
            <h1>
                <Link href='/admin'>
                    <Image src={images.favicon} height={30} alt='logo' title='logo' />
                    &nbsp;&nbsp;
                    <Image src={images.logo.logo_white} height={24} alt='' />
                </Link>
            </h1>
            <dl>
                <dt>
                    <span>{user?.name?.[0] ?? ""}</span>
                </dt>
                <dd>
                    <dl>
                        <dt>
                            <h2>{t("title", { name: user?.name })}</h2>
                            <h3>{t("welcome")}</h3>
                        </dt>
                        <dd>
                            <Link href='/admin/profile'>
                                <Image src={images.icn.icn_gear} alt='' width={16} />
                            </Link>
                        </dd>
                    </dl>
                </dd>
            </dl>
            <div id='cssmenu'>
                <ul>
                    {menuList
                        ?.filter((item: MenuItem) => item.roles?.includes(user?.role as string))
                        .map((item, index: number) => (
                            <li
                                key={index}
                                className={`${"/" + pathname.split("/").slice(2).join("/") == item.path ? "open" : ""}`}
                            >
                                <Link href={item?.path} style={{ textShadow: "none" }}>
                                    <em>{item.icn}</em>
                                    {t(item?.name)}
                                </Link>
                                <Image src={images.icn.icn_arr_right3} alt='' width={10} className='csmenu-arr' />
                            </li>
                        ))}
                </ul>
            </div>
            <p>
                <span onClick={logout}>
                    <Image src={images.icn.icn_right_bracket} alt='' width={16} />
                    {t("logout")}
                </span>
            </p>
        </div>
    );
}
