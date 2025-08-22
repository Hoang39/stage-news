import Image from "next/image";
import Link from "next/link";

import images from "../../../../public/assets/image/images";

const MainContact = () => {
    return (
        <div className='main-contact' id='4'>
            <dl>
                <dt>
                    <Image src={images.main_contact.main_contact_img} alt='' title='' />
                </dt>
                <dd>
                    <h2>
                        “Where Fandom <br /> BECOMES <u>A MOVEMENT</u>
                        ”
                        <br />
                        <span>HIT THE STAGE</span>
                    </h2>

                    <div className='download'>
                        <Link href='https://play.google.com/store/apps/details?id=biz.livestage' target='_blank'>
                            <span>
                                <Image src={images.icn.icn_google_play} height='23' alt='' title='' /> Google Play
                            </span>
                            <i className='fa-sharp fa-light fa-arrow-right'></i>
                        </Link>
                        <Link href='https://apps.apple.com/kr/app/stage/id6670477498' target='_blank'>
                            <span>
                                <Image src={images.icn.icn_app_store} height='23' alt='' title='' /> App Store
                            </span>
                            <i className='fa-sharp fa-light fa-arrow-right'></i>
                        </Link>
                    </div>

                    <div className='contact-us'>
                        <span>
                            (주) 라이브스테이지 <br />
                            <i className='fa-regular fa-user' /> 대표이사 : 조은성, 이요훈 <br />
                            <i className='fa-regular fa-location-dot' /> 주소 : (06621) 서울특별시 서초구 강남대로 53길
                            8 10층
                            <br />
                            <i className='fa-regular fa-envelope' /> 이메일 : help@letsgostage.com <br />
                            <i className='fa-regular fa-phone' /> 대표번호 : +82-70-4647-4560 <br /> (평일 10시 - 17시 /
                            주말, 공휴일 휴무)
                        </span>
                    </div>

                    <p>
                        <Link href='https://blog.naver.com/letsgostage' target='_blank'>
                            <Image src={images.icn.icn_sns_blog_svg} alt='' title='' />
                        </Link>
                        <Link href='https://www.instagram.com/official_stage/' target='_blank'>
                            <Image src={images.icn.icn_sns_instagram2} alt='' title='' />
                        </Link>
                        <Link href='https://x.com/SnsStage' target='_blank'>
                            <Image src={images.icn.icn_sns_twitter2} alt='' title='' />
                        </Link>
                        <Link href='https://youtube.com/@stage2024-u5g?si=-9tsamFR5p7SuYtn' target='_blank'>
                            <Image src={images.icn.icn_sns_youtube2} alt='' title='' />
                        </Link>
                        <Link href='https://pf.kakao.com/_xbxolPn' target='_blank'>
                            <Image src={images.icn.icn_sns_kakao3} alt='' title='' width={70} />
                        </Link>
                    </p>
                </dd>
            </dl>
        </div>
    );
};

export default MainContact;
