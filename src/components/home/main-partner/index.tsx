"use client";

import Image from "next/image";

import "swiper/css/autoplay";
import "swiper/css/free-mode";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import useSite from "@/hooks/useSite";
import { Partner } from "@/interfaces/partner";

import "swiper/css";

// import images from "../../../../public/assets/image/images";

const MainPartner = () => {
    const { partner } = useSite({});
    let imageList: Partner[] = [];

    if (partner?.data?.data?.length)
        imageList =
            partner?.data?.data?.length < 5
                ? [...partner?.data?.data]
                : [...partner?.data?.data, [...partner?.data?.data]];

    return (
        <div className='main-partner' id='3'>
            <h2 data-aos='fade-up' style={{ color: "#b20710" }}>
                OUR PARTNERSHIP
            </h2>
            {imageList?.length < 5 ? (
                <div
                    className='swiper-area mp-slide'
                    style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}
                >
                    {imageList?.map((src: Partner, index: number) => (
                        <div
                            key={index}
                            style={{
                                width: "200px",
                                height: "160px"
                            }}
                        >
                            <Image
                                width={160}
                                height={0}
                                src={src.image}
                                alt={src.title}
                                title={src.title}
                                style={{ height: "auto", objectFit: "cover" }}
                            />
                        </div>
                    ))}
                </div>
            ) : (
                <div className='swiper-area mp-slide'>
                    <Swiper
                        modules={[Autoplay]}
                        slidesPerView='auto'
                        spaceBetween={100}
                        loop={true}
                        autoplay={{
                            delay: 0,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: false
                        }}
                        speed={8000}
                        breakpoints={{
                            300: { spaceBetween: 50 },
                            480: { spaceBetween: 50 },
                            768: { spaceBetween: 60 },
                            992: { spaceBetween: 70 },
                            1200: { spaceBetween: 80 }
                        }}
                        className='swiper-wrapper'
                        data-aos='fade-up'
                    >
                        {imageList?.map((src: Partner, index: number) => (
                            <SwiperSlide key={index} className='swiper-slide'>
                                <div
                                    style={{
                                        width: "200px",
                                        height: "160px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    <Image
                                        width={160}
                                        height={0}
                                        src={src.image}
                                        alt={src.title}
                                        title={src.title}
                                        style={{ height: "auto", objectFit: "cover" }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
        </div>
    );
};

export default MainPartner;
