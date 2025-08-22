"use client";

import React, { useEffect } from "react";

import AOS from "aos";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "aos/dist/aos.css";
import "swiper/swiper-bundle.css";

const LandingPageAnimation = () => {
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

        gsap.fromTo(
            ".mv-btm > div",
            {
                opacity: 0
            },
            {
                opacity: 1,
                duration: 0.3,
                repeat: -1,
                yoyo: true,
                stagger: 0.1,
                ease: "power2.inOut",
                delay: 0.2
            }
        );

        setTimeout(() => {
            const mvCopy = document.querySelector(".mv-copy");
            // mvCopy.style.display = 'block';
            const headings = mvCopy?.querySelectorAll("h2, h3, h4");

            headings?.forEach((heading, index) => {
                gsap.fromTo(
                    heading,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        delay: index * 0.2,
                        ease: "power3.out"
                    }
                );
            });
        }, 600);

        setTimeout(function () {
            gsap.fromTo(
                ".mv-copy > div",
                {
                    x: -50,
                    y: 0,
                    opacity: 0
                },
                {
                    x: 0,
                    y: 0,
                    duration: 2.5,
                    opacity: 1,
                    ease: "elastic.out",
                    delay: 1
                }
            );
        }, 800);

        setTimeout(function () {
            gsap.fromTo(
                ".mv-copy > p",
                {
                    x: 0,
                    y: -30,
                    opacity: 0
                },
                {
                    x: 0,
                    y: 0,
                    duration: 2.5,
                    opacity: 1,
                    ease: "elastic.out",
                    delay: 1
                }
            );
        }, 1200);

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

        const mvBtm = document.querySelector(".mv-btm");
        const handleClickScroll = () => {
            gsap.to(window, {
                scrollTo: { y: window.innerHeight - 51, autoKill: false },
                duration: 0.9,
                ease: "power2.out"
            });
        };

        mvBtm?.addEventListener("click", handleClickScroll);
        window.addEventListener("scroll", handleScroll);

        return () => {
            mvBtm?.removeEventListener("click", handleClickScroll);
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    return <></>;
};

export default LandingPageAnimation;
