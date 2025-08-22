"use client";

import React, { useEffect } from "react";

import AOS from "aos";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "aos/dist/aos.css";
import "swiper/swiper-bundle.css";

const NewsPageAnimation = () => {
    gsap.registerPlugin(ScrollToPlugin);

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        ScrollTrigger.refresh();

        AOS.init({
            duration: 1200,
            easing: "ease-in-out"
        });

        gsap.to(".panel", {
            scaleY: 0,
            duration: 1.5,
            ease: "power4.inOut"
        });

        const handleScroll = () => {
            const headerElement = document.querySelector(".header");
            if (headerElement) {
                if (window.scrollY > 50) {
                    headerElement.setAttribute("style", "background: #000000");
                } else {
                    headerElement.setAttribute("style", "background: rgba(0, 0, 0, 0.2)");
                }
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return <></>;
};

export default NewsPageAnimation;
