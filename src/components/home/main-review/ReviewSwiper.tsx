"use client";

import "swiper/css/autoplay";
import "swiper/css/free-mode";
import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { AppReview } from "@/libs/serpapi";

import "swiper/css";

interface ReviewSwiperProps {
    reviews: AppReview[];
}

export const ReviewSwiper = ({ reviews }: ReviewSwiperProps) => {
    const starArray = new Array(5).fill(1);

    return (
        <div data-aos='fade-up' className='swiper-area mp-slide'>
            <Swiper
                modules={[Autoplay]}
                slidesPerView='auto'
                spaceBetween={20}
                loop={true}
                centeredSlides
                autoplay={{
                    delay: 500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false
                }}
                speed={2000}
                className='swiper-wrapper'
            >
                {reviews?.map((review, index: number) => {
                    return (
                        <SwiperSlide key={index} className='swiper-slide'>
                            <div className='review' key={review.id}>
                                <div className='stars'>
                                    {starArray.map((val, index) => (
                                        <i
                                            key={index}
                                            className={
                                                review.rating > index
                                                    ? "fa-solid fa-star-sharp"
                                                    : "fa-regular fa-star-sharp"
                                            }
                                        />
                                    ))}
                                </div>
                                <span className='review-store'>
                                    <i
                                        className={`fa-brands ${review.store === "google_play" ? "fa-google-play" : "fa-apple"}`}
                                    />
                                    &nbsp;&nbsp;{review.date}
                                </span>
                                <p className='review-content'>{review.content}</p>
                                <div className='review-author'>
                                    <i className='fa-solid fa-user' />
                                    &nbsp;&nbsp;{review.author_name}
                                </div>
                            </div>
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        </div>
    );
};
