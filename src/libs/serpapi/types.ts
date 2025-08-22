export interface AppReviewResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export interface AppReview {
    id: string;
    title: string;
    content: string;
    date?: string;
    rating: number;
    author_name: string;
    author_avatar?: string;
    store: "app_store" | "google_play";
}

export interface GooglePlayReviewParams {
    product_id: string;
    gl: string;
    hl: string;
    all_reviews: "true" | "false";
    rating: 1 | 2 | 3 | 4 | 5;
    sort_by: 1 | 2 | 3;
}

export interface AppStoreReviewParams {
    product_id: string;
    country: string;
    page: number;
    sort: "mostrecent" | "mosthelpful" | "mostfavorable" | "mostcritical";
}

/*Custom */
export interface GooglePlayReview {
    id: string;
    title: string; //review title
    avatar: string; //author avatar
    rating: number;
    snippet: string; //content
    likes: number;
    date: string;
    iso_date: string;
}

export interface GooglePlayReviewResponse {
    reviews: GooglePlayReview[];
}

export interface AppStoreReview {
    position: number;
    id: string;
    title: string; // review title
    text: string; //content
    rating: number;
    review_date: string;
    reviewed_version: string;
    author: Author;
}

export interface Author {
    name: string;
    author_id: string;
}

export interface AppStoreReviewResponse {
    search_information: {
        total_page_count: number;
        reviews_results_state: string;
        results_count: number;
    };
    reviews: AppStoreReview[];
}
