"use client";

import { useEffect, useState } from "react";

import { ClientSafeProvider, getProviders, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";

import "./signin.css";

export default function SignIn() {
    const t = useTranslations("user-info.signin");
    const [providers, setProviders] = useState<Record<string, ClientSafeProvider> | null>(null);

    useEffect(() => {
        const fetchProviders = async () => {
            const res = await getProviders();
            setProviders(res);
        };
        fetchProviders();
    }, []);

    const handleSignIn = (providerId: string) => {
        signIn(providerId, { callbackUrl: "/user/my-profile" });
    };

    // Function to get provider icon and styling
    const getProviderConfig = (providerId: string) => {
        switch (providerId) {
            case "google":
                return {
                    name: "Google",
                    icon: "/assets/image/sns_icons/google.svg",
                    bgColor: "bg-white",
                    textColor: "text-gray-700",
                    borderColor: "border-gray-300",
                    hoverBg: "hover:bg-gray-50",
                    hoverBorder: "hover:border-gray-400"
                };
            case "github":
                return {
                    name: "GitHub",
                    icon: "/assets/image/sns_icons/discord.svg", // Using discord icon as fallback
                    bgColor: "bg-gray-900",
                    textColor: "text-white",
                    borderColor: "border-gray-900",
                    hoverBg: "hover:bg-gray-800",
                    hoverBorder: "hover:border-gray-700"
                };
            case "naver":
                return {
                    name: "Naver",
                    icon: "/assets/image/sns_icons/naver.svg",
                    bgColor: "bg-green-500",
                    textColor: "text-white",
                    borderColor: "border-green-500",
                    hoverBg: "hover:bg-green-600",
                    hoverBorder: "hover:border-green-600"
                };
            case "facebook":
                return {
                    name: "Facebook",
                    icon: "/assets/image/sns_icons/facebook.svg",
                    bgColor: "bg-blue-600",
                    textColor: "text-white",
                    borderColor: "border-blue-600",
                    hoverBg: "hover:bg-blue-700",
                    hoverBorder: "hover:border-blue-700"
                };
            case "apple":
                return {
                    name: "Apple",
                    icon: "/assets/image/sns_icons/apple.svg",
                    bgColor: "bg-gray-400",
                    textColor: "text-white",
                    borderColor: "border-gray-400",
                    hoverBg: "hover:bg-gray-500",
                    hoverBorder: "hover:border-gray-500"
                };
            case "kakao":
                return {
                    name: "Kakao",
                    icon: "/assets/image/sns_icons/kakao.svg",
                    bgColor: "bg-yellow-400",
                    textColor: "text-gray-800",
                    borderColor: "border-yellow-400",
                    hoverBg: "hover:bg-yellow-500",
                    hoverBorder: "hover:border-yellow-500"
                };
            case "tiktok":
                return {
                    name: "TikTok",
                    icon: "/assets/image/sns_icons/tiktok.svg",
                    bgColor: "bg-black",
                    textColor: "text-white",
                    borderColor: "border-black",
                    hoverBg: "hover:bg-gray-900",
                    hoverBorder: "hover:border-gray-900"
                };
            default:
                return {
                    name: providerId.charAt(0).toUpperCase() + providerId.slice(1),
                    icon: "/assets/image/sns_icons/google.svg", // Default fallback
                    bgColor: "bg-indigo-600",
                    textColor: "text-white",
                    borderColor: "border-indigo-600",
                    hoverBg: "hover:bg-indigo-700",
                    hoverBorder: "hover:border-indigo-700"
                };
        }
    };

    return (
        <div className='signin-container'>
            {/* Overlay for better readability */}
            <div className='signin-overlay'></div>

            {/* Login Form Container */}
            <div className='signin-form-container'>
                <div className='signin-form'>
                    {/* Header */}
                    <div className='signin-header'>
                        <div className='signin-logo-container'>
                            <img src='/assets/image/account.svg' alt='Account icon' className='signin-logo' />
                        </div>
                        <h2 className='signin-title'>{t("title")}</h2>
                        <p className='signin-subtitle'>
                            {t("subtitle")} <span className='signin-subtitle-highlight'>{t("stage-app")}</span>{" "}
                            {t("application")}
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className='signin-buttons-container'>
                        {!providers ? (
                            // Loading Skeleton
                            <>
                                {[1, 2, 3].map((index: number) => (
                                    <div key={index} className='signin-skeleton'>
                                        {/* Icon skeleton */}
                                        <div className='signin-skeleton-icon'></div>

                                        {/* Text skeleton */}
                                        <div className='signin-skeleton-text'>
                                            <div className='signin-skeleton-text-line'></div>
                                        </div>

                                        {/* Arrow skeleton */}
                                        <div className='signin-skeleton-arrow'></div>
                                    </div>
                                ))}
                            </>
                        ) : (
                            // Actual providers
                            Object.values(providers).map((provider: ClientSafeProvider) => {
                                const config = getProviderConfig(provider.id);
                                return (
                                    <button
                                        key={provider.id}
                                        onClick={() => handleSignIn(provider.id)}
                                        className={`signin-provider-button signin-provider-button--${provider.id}`}
                                    >
                                        {/* Icon Container */}
                                        <div className='signin-provider-icon-container'>
                                            <img
                                                src={config.icon}
                                                alt={`${config.name} icon`}
                                                className='signin-provider-icon'
                                            />
                                        </div>

                                        {/* Text */}
                                        <span className='signin-provider-text'>
                                            {t("continue-with")} {config.name}
                                        </span>

                                        {/* Arrow Icon */}
                                        <div className='signin-provider-arrow'>
                                            <svg
                                                className='w-5 h-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M9 5l7 7-7 7'
                                                />
                                            </svg>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>

                    {/* Divider */}
                    <div className='signin-divider'>
                        <div className='signin-divider-line'></div>
                        <div className='signin-divider-text'>
                            <span>{t("secure-fast")}</span>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className='signin-footer'>
                        <a href='/terms/PrivacyTerms' className='signin-footer-link'>
                            {t("terms-of-service")}
                        </a>
                        <span className='signin-footer-separator'>•</span>
                        <a href='/terms/YouthProtectionPolicy' className='signin-footer-link'>
                            {t("privacy-policy")}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
