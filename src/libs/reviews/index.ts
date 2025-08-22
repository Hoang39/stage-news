import fs from "fs/promises";
import path from "path";

import logger from "../logger";
import { serpApi } from "../serpapi";
import { AppReview, AppStoreReview, GooglePlayReview } from "../serpapi/types";

interface ReviewsData {
    timestamp: string;
    reviews: AppReview[];
}

class ReviewsService {
    private static instance: ReviewsService | null = null;
    private readonly dataDir: string;
    private readonly googlePlayAppId: string;
    private readonly appStoreAppId: string;
    private readonly refreshIntervalDays: number = 2; // Số ngày giữa các lần làm mới dữ liệu

    private constructor() {
        const baseUploadDir = process.env.UPLOAD_FOLDER as string;

        this.dataDir = path.join(baseUploadDir, "reviews");

        this.googlePlayAppId = process.env.GOOGLE_PLAY_APP_ID || "biz.livestage";
        this.appStoreAppId = process.env.APP_STORE_APP_ID || "6670477498";

        if (!this.googlePlayAppId || !this.appStoreAppId) {
            throw new Error("App IDs are not configured in environment variables");
        }
    }

    public static getInstance(): ReviewsService {
        if (!ReviewsService.instance) {
            ReviewsService.instance = new ReviewsService();
        }

        return ReviewsService.instance;
    }

    private getReviewFileName(): string {
        return "reviews.json";
    }

    private async ensureDataDir(): Promise<void> {
        try {
            await fs.access(this.dataDir);
        } catch {
            await fs.mkdir(this.dataDir, { recursive: true });
        }
    }

    private mapGooglePlayReview(review: GooglePlayReview): AppReview {
        // Convert date from "June 05, 2025" to "2025-06-05"
        const date = new Date(review?.date || "June 05, 2025");
        const formattedDate = date.toISOString().split("T")[0];

        return {
            id: review?.id || "",
            title: "Google Play review title", // Google Play API doesn't provide title review
            content: review?.snippet || "",
            date: formattedDate,
            rating: review?.rating || 5,
            author_name: review?.title || "",
            author_avatar: review?.avatar || "",
            store: "google_play"
        };
    }

    private mapAppStoreReview(review: AppStoreReview): AppReview {
        // Convert date from "2025.06.13" to "2025-06-13"
        const [year, month, day] = (review?.review_date || "2025.06.13").split(".");
        const formattedDate = `${year}-${month}-${day}`;

        return {
            id: review.id || "",
            title: review?.title || "",
            content: review?.text || "",
            date: formattedDate,
            rating: review?.rating || 5,
            author_name: review?.author?.name || "",
            author_avatar: undefined, // App Store API doesn't provide author avatar
            store: "app_store"
        };
    }

    private async fetchAndSaveReviews(): Promise<void> {
        console.log("----- 🚀 ~ ReviewsService: Start fetchAndSaveReviews ------");

        try {
            // Fetch reviews from both platforms
            const [googlePlayResponse, appStoreResponse] = await Promise.all([
                serpApi.getGooglePlayReviews({
                    product_id: this.googlePlayAppId,
                    gl: "kr",
                    hl: "ko",
                    all_reviews: "true",
                    rating: 5,
                    sort_by: 1
                }),
                serpApi.getAppStoreReviews({
                    product_id: this.appStoreAppId,
                    country: "kr",
                    page: 1,
                    sort: "mostrecent"
                })
            ]);

            // if (!googlePlayResponse.success || !appStoreResponse.success) {
            //     throw new Error("Failed to fetch reviews from one or both platforms");
            // }

            // Map and combine reviews
            const allReviews: AppReview[] = [
                ...(googlePlayResponse.data?.reviews || []).map(this.mapGooglePlayReview),
                ...(appStoreResponse.data?.reviews || []).map(this.mapAppStoreReview)
            ];

            // Sort reviews by date in descending order (newest first)
            allReviews.sort((a, b) => {
                const dateA = a.date ? new Date(a.date).getTime() : 0;
                const dateB = b.date ? new Date(b.date).getTime() : 0;
                return dateB - dateA;
            });

            // Create reviews data object
            const reviewsData: ReviewsData = {
                timestamp: new Date().toISOString(),
                reviews: allReviews
            };

            // Ensure directory exists
            await this.ensureDataDir();

            // Save to file
            const filePath = path.join(this.dataDir, this.getReviewFileName());
            await fs.writeFile(filePath, JSON.stringify(reviewsData, null, 2), "utf-8");

            logger.info("Successfully saved reviews data", { path: filePath });
        } catch (error) {
            logger.error("Error fetching and saving reviews", { error });
            throw error;
        }
    }

    public async fetchReviews(): Promise<AppReview[]> {
        try {
            // Skip API calls during build time or when explicitly disabled
            if (process.env.NEXT_PHASE === "phase-production-build") {
                logger.info("Skipping fetchReviews during build phase or when explicitly disabled");
                return [];
            }

            await this.ensureDataDir();

            const filePath = path.join(this.dataDir, this.getReviewFileName());

            // Check if file exists and read its data
            try {
                const data = await fs.readFile(filePath, "utf-8");
                const reviewsData: ReviewsData = JSON.parse(data);

                if (process.env.NODE_ENV !== "production") return reviewsData.reviews;

                // Check if the timestamp is from within the configured refresh interval
                const fileDate = new Date(reviewsData.timestamp);
                const today = new Date();
                const refreshThreshold = new Date(today.getTime() - this.refreshIntervalDays * 24 * 60 * 60 * 1000);

                if (fileDate >= refreshThreshold) {
                    return reviewsData.reviews;
                }
            } catch {
                // File doesn't exist or is invalid, continue to fetch new data
            }

            // Fetch new data if file doesn't exist or is older than the configured refresh interval
            await this.fetchAndSaveReviews();

            // Read the updated file
            const data = await fs.readFile(filePath, "utf-8");
            const reviewsData: ReviewsData = JSON.parse(data);
            return reviewsData.reviews;
        } catch (error) {
            logger.error("Error in fetchReviews", { error });
            return [];
        }
    }
}

// Create instance immediately
export const reviewsService = ReviewsService.getInstance();
