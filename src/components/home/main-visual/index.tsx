import Image from "next/image";
import Link from "next/link";

import images from "../../../../public/assets/image/images";

const MainVisual = () => {
    return (
        <div className='main-visual'>
            <video autoPlay muted loop playsInline>
                <source src='../../assets/image/main_visual.mp4' type='video/mp4' />
            </video>
            <div className='mv-copy'>
                <h2 data-in-effect='flipInX' data-in-delay='90'>
                    YOUR NEXT
                </h2>
                <h3 data-in-effect='flipInX' data-in-delay='70'>
                    STAGE IS ______
                </h3>
                <h4 data-in-effect='flipInX' data-in-delay='50'>
                    APP DOWNLOAD
                </h4>
                <div>
                    <Link href='https://play.google.com/store/apps/details?id=biz.livestage' target='_blank'>
                        <span>
                            <Image src={images.icn.icn_google_play} alt='' title='' /> Google Play
                        </span>
                        <i className='fa-sharp fa-light fa-arrow-right'></i>
                    </Link>
                    <Link href='https://apps.apple.com/kr/app/stage/id6670477498' target='_blank'>
                        <span>
                            <Image src={images.icn.icn_app_store} alt='' title='' /> App Store
                        </span>
                        <i className='fa-sharp fa-light fa-arrow-right'></i>
                    </Link>
                </div>
                <p style={{ paddingRight: "24px" }}>
                    <span>
                        <Image src={images.main_visual.main_visual_circle} alt='' title='' />
                    </span>
                    <i className='fa-light fa-arrow-down'></i>
                </p>
            </div>
            <div className='mv-btm'>
                <p>
                    <Image src={images.main_visual.main_visual_scroll} alt='' title='' />
                </p>
                <div>SCROLL DOWN</div>
            </div>
        </div>
    );
};

export default MainVisual;
