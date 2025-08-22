import { Suspense } from "react";

import NewsPageAnimation from "../animation/newsPageAnimation";
import Footer from "../footer";
import Header from "../header/header";
import HeaderMobile from "../header/headerMobile";

export default function NewLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NewsPageAnimation />
            <div className='wrap'>
                <div className='visual-bg'>
                    <div className='panel'></div>
                </div>

                <Suspense fallback={<></>}>
                    <Header />
                    <HeaderMobile />
                </Suspense>
                {children}
                <div className='h50' style={{ background: "#fff" }}></div>
                <Footer />
            </div>
        </>
    );
}
