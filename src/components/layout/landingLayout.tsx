import { Suspense } from "react";

import LandingPageAnimation from "@/components/animation/landingPageAnimation";
import Footer from "@/components/footer";
import Header from "@/components/header/header";
import HeaderMobile from "@/components/header/headerMobile";
import PopupInformation from "@/components/popup/popupInformation";

export default function LandingLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <LandingPageAnimation />
            <PopupInformation />
            <div className='wrap'>
                <div className='visual-bg'>
                    <div className='panel'></div>
                </div>

                <Suspense fallback={<></>}>
                    <Header />
                    <HeaderMobile />
                </Suspense>

                {children}

                <Footer />
            </div>
        </>
    );
}
