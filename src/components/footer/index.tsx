import Image from "next/image";
import Link from "next/link";

import { useTranslations } from "next-intl";

import images from "../../../public/assets/image/images";

const terms = [
    "AccessTerms",
    // "AppAccessTerms",
    // "AppPrivacyTerms",
    "PrivacyTerms",
    "IntellectualPropertyRightsAndPolicies",
    "UserGeneratedContent",
    "CommunityGuidelines",
    "VirtualItemsPolicy",
    "YouthProtectionPolicy"
];

const Footer = () => {
    const t = useTranslations("terms");

    return (
        <div className='footer'>
            <div>
                <p>
                    <Image src={images.logo.logo_footer} alt='' title='' />
                </p>
                <dl>
                    <dt>
                        <Link href='mailto:help@letsgostage.com'>help@letsgostage.com</Link>|&nbsp;&nbsp;
                        <Link href='tel:070-4647-4560'>070-4647-4560</Link>
                    </dt>
                    <dd>
                        Copyright(c) 2024 <span>STAGE</span>. All Rights Reserved.
                    </dd>
                </dl>
                <div className='terms'>
                    {terms.map((item) => (
                        <Link key={item} href={`/terms/${item}`}>
                            {t(item)}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Footer;
