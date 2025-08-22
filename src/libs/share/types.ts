export interface ShareInfo {
    title: string;
    description: string;
    thumb: string;
    data?: any;
}

export type ShareRef =
    | "product_detail"
    | "playback"
    | "event"
    | "user_event_ab"
    | "user_event_poll"
    | "youtube_player"
    | "error"
    | "";
