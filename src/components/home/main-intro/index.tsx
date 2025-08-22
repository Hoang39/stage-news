import Image from "next/image";

import { useTranslations } from "next-intl";

import images from "../../../../public/assets/image/images";

const MainIntro = () => {
    const t = useTranslations("home");

    return (
        <div className='main-intro' id='1'>
            <div>
                <h2 data-aos='fade-up'>ABOUT US</h2>
                <h3 data-aos='fade-up'>{t("intro")}</h3>
                <h4 data-aos='fade-up'>
                    {t.rich("sub-intro", {
                        br: () => <br />,
                        li: (chunks) => <li>{chunks}</li>,
                        strong: (chunks) => <strong>{chunks}</strong>
                    })}
                </h4>
                <p data-aos='fade-up'>
                    <Image src={images.main_intro.main_intro_img01} alt='' title='' />
                    <Image src={images.main_intro.main_intro_img02} alt='' title='' />
                    <Image src={images.main_intro.main_intro_img03} alt='' title='' />
                    <Image src={images.main_intro.main_intro_img04} alt='' title='' />
                    <Image src={images.main_intro.main_intro_img05} alt='' title='' />
                    <Image src={images.main_intro.main_intro_img06} alt='' title='' />
                </p>
            </div>
        </div>
    );
};

export default MainIntro;
