import Image from "next/image";

import { useTranslations } from "next-intl";

import images from "../../../../public/assets/image/images";

const MainVision = () => {
    const t = useTranslations("home");

    const visionElement = [
        {
            img: images.main_vision.main_vision_img01,
            title: "INNOVATION",
            description: t("vision-element-1")
        },
        {
            img: images.main_vision.main_vision_img02,
            title: "DIVERSITY",
            description: t("vision-element-2")
        },
        {
            img: images.main_vision.main_vision_img03,
            title: "INCLUSIVITY",
            description: t("vision-element-3")
        },
        {
            img: images.main_vision.main_vision_img04,
            title: "TRANSPARENCY",
            description: t("vision-element-4")
        },
        {
            img: images.main_vision.main_vision_img05,
            title: "SUSTAINABILITY",
            description: t("vision-element-5")
        }
    ];

    return (
        <div className='main-vision'>
            <div>
                <h2 data-aos='fade-up'>VISION</h2>
                <ul data-aos='fade-up'>
                    {visionElement?.map((item, index: number) => (
                        <li key={index}>
                            <p>
                                <Image src={item.img} alt='' title='' />
                            </p>
                            <h2>{item.title}</h2>
                            <h3>{item.description}</h3>
                        </li>
                    ))}
                </ul>
                <div data-aos='fade-up'>
                    {t.rich("vision", {
                        br: () => <div style={{ marginBottom: 12 }} />
                    })}
                </div>
            </div>
        </div>
    );
};

export default MainVision;
