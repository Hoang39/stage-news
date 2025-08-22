import Image from "next/image";

import useDateTime from "@/hooks/useDateTime";

import images from "../../../public/assets/image/images";

const Datetime = () => {
    const { currentDateTime } = useDateTime();
    return (
        <dt>
            <span>
                <Image src={images.icn.icn_clock} alt='' className='color-blue1' width={16} />
                {currentDateTime}
            </span>
        </dt>
    );
};

export default Datetime;
