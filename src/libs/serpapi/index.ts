import SerApi from "google-search-results-nodejs";

// import logger from "../logger";
import {
    AppReviewResponse,
    AppStoreReviewParams,
    AppStoreReviewResponse,
    GooglePlayReviewParams,
    GooglePlayReviewResponse
} from "./types";

class SerpApiService {
    private static instance: SerpApiService | null = null;
    private search: any; // Using any here since we don't have proper types for the library

    private constructor() {
        if (!process.env.SERP_API_KEY) {
            throw new Error("SERP_API_KEY is not defined in environment variables");
        }
        this.search = new SerApi.GoogleSearch(process.env.SERP_API_KEY);
    }

    public static getInstance(): SerpApiService {
        if (!SerpApiService.instance) {
            SerpApiService.instance = new SerpApiService();
        }

        return SerpApiService.instance;
    }

    public async getGooglePlayReviews(
        params: GooglePlayReviewParams
    ): Promise<AppReviewResponse<GooglePlayReviewResponse>> {
        try {
            const apiParams = {
                engine: "google_play_product",
                store: "apps",
                platform: "phone",
                ...params
            };

            const response = await new Promise<GooglePlayReviewResponse>((resolve, reject) => {
                this.search.json(apiParams, (data: GooglePlayReviewResponse, error?: any) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    // console.log("🚀 ~ SerpApiService ~ Google Play Reviews:", data);
                    resolve(data);
                });
            });

            if (!response || !response.reviews) {
                throw new Error("Invalid response from SerpApi");
            }

            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.error("🚀 ~ SerpApiService ~ Google Play Reviews Error:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }

    public async getAppStoreReviews(params: AppStoreReviewParams): Promise<AppReviewResponse<AppStoreReviewResponse>> {
        try {
            const apiParams = {
                engine: "apple_reviews",
                ...params
            };

            const response = await new Promise<AppStoreReviewResponse>((resolve, reject) => {
                this.search.json(apiParams, (data: AppStoreReviewResponse, error?: any) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    // console.log("🚀 ~ SerpApiService ~ App Store Reviews:", data);
                    resolve(data);
                });
            });

            if (!response || !response.reviews) {
                throw new Error("Invalid response from SerpApi");
            }

            return {
                success: true,
                data: response
            };
        } catch (error) {
            console.log("🚀 ~ SerpApiService ~ getAppStoreReviews ~ error:", error);
            return {
                success: false,
                error: error instanceof Error ? error.message : "Unknown error occurred"
            };
        }
    }
}

export const serpApi = SerpApiService.getInstance();
export * from "./types";
