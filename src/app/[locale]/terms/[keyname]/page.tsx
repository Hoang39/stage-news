"use client";

import { useEffect, useState } from "react";

import { useParams } from "next/navigation";

const langObject = {
    en: "en_US",
    ko: "ko_KR"
};

export default function TermsPage() {
    const params = useParams<{
        locale: string;
        keyname: string;
    }>();

    const [isError, setIsError] = useState(false);
    const [checked, setChecked] = useState(false);

    const lang = langObject[params.locale as keyof typeof langObject] || langObject.ko;
    const fileUrl = `https://cfimg.letsgostage.com/static_resource/terms/${params.keyname}_${lang}.html?v=${Date.now()}`;

    useEffect(() => {
        setIsError(false);
        setChecked(false);
        fetch(fileUrl, { method: "HEAD" })
            .then((res) => {
                if (!res.ok) setIsError(true);
                setChecked(true);
            })
            .catch(() => {
                setIsError(true);
                setChecked(true);
            });
    }, [fileUrl]);

    if (!checked) return <div>Loading...</div>;
    if (isError) return <div>Terms not found.</div>;

    return <iframe src={fileUrl} title='Terms' />;
}
