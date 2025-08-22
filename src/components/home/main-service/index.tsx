import Image from "next/image";

import { useTranslations } from "next-intl";

import images from "../../../../public/assets/image/images";

const MainService = () => {
    const t = useTranslations("home");

    const serviceElement = [
        {
            title: <>LIVE CONTENTS</>,
            description: t("service-desc-1"),
            subDescription: t("service-sub-desc-1"),
            icn: images.main_service.main_service_icn01,
            img: images.main_service.main_service_img01
        },
        {
            title: (
                <>
                    VOTE <em>({t("service-title-sub-2")})</em>
                </>
            ),
            description: t("service-desc-2"),
            subDescription: t("service-sub-desc-2"),
            icn: images.main_service.main_service_icn02,
            img: images.main_service.main_service_img02
        },
        {
            title: <>STORE</>,
            description: t("service-desc-3"),
            subDescription: t("service-sub-desc-3"),
            icn: images.main_service.main_service_icn03,
            img: images.main_service.main_service_img03
        }
    ];

    return (
        <div className='main-service' id='2'>
            <div>
                <h2 data-aos='fade-up'>OUR SERVICE</h2>

                {serviceElement?.map((item, index: number) => (
                    <dl key={index}>
                        <dt>
                            <h2 data-aos='fade-up'>{item.title}</h2>
                            <h3 data-aos='fade-up'>{item.description}</h3>
                            <div data-aos='fade-up'>{item.subDescription}</div>
                        </dt>
                        <dd>
                            <div data-aos='fade-up'>
                                <Image src={item.icn} alt='' title='' />
                            </div>
                            <p data-aos='fade-up'>
                                <Image src={item.img} alt='' title='' />
                            </p>
                        </dd>
                    </dl>
                ))}
            </div>
        </div>
    );
};

export default MainService;
