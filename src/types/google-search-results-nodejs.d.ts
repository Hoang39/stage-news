declare module "google-search-results-nodejs" {
    class GoogleSearch {
        constructor(apiKey: string);
        json(params: any): Promise<any>;
    }
    const SerApi: { GoogleSearch: typeof GoogleSearch };
    export default SerApi;
}
