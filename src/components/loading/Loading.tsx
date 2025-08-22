import React from "react";

import { useTranslations } from "next-intl";

import "./Loading.css";

interface LoadingProps {
    title?: string;
    message?: string;
    type?: "verifying" | "loading" | "authenticating";
}

const Loading: React.FC<LoadingProps> = ({ title, message, type = "loading" }) => {
    const t = useTranslations("loading");

    // Use provided title/message or fallback to translations
    const displayTitle = title || t(`${type}`);
    const displayMessage = message || t(`${type}-message`);

    return (
        <div className='loading'>
            <div className='loading-container'>
                <div className='loading-spinner'>
                    <div className='spinner-ring'></div>
                    <div className='spinner-ring'></div>
                    <div className='spinner-ring'></div>
                </div>
                <div className='loading-text'>
                    <h2>{displayTitle}</h2>
                    <p>{displayMessage}</p>
                </div>
            </div>
        </div>
    );
};

export default Loading;
