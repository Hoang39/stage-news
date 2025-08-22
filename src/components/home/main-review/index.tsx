import { reviewsService } from "@/libs/reviews";

import { ReviewSwiper } from "./ReviewSwiper";

const MainReview = async () => {
    try {
        const reviews = await reviewsService.fetchReviews();
        return (
            <div className='main-review' id='5'>
                <h2 data-aos='fade-up'>REVIEWS</h2>
                <ReviewSwiper reviews={reviews} />
            </div>
        );
    } catch (error) {
        console.log("🚀 ~ MainReview ~ error:", error);
        return null;
    }
};

export default MainReview;
