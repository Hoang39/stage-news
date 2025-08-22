import { cache } from "react";

import logger from "../logger";
import api from "./liveApi";
import { ShareInfo, ShareRef } from "./types";

class ShareApiService {
    private static instance: ShareApiService | null = null;
    private workspace: "LiveService" | "LiveService_test" | null = null;

    private constructor(isTest?: boolean) {
        this.workspace = isTest ? "LiveService_test" : "LiveService";
    }

    public static getInstance = ({ isTest }: { isTest?: boolean }): ShareApiService => {
        if (this.instance) {
            this.instance.switchWorkspace(isTest);
        } else {
            this.instance = new ShareApiService(isTest);
        }

        return this.instance;
    };

    private switchWorkspace = (isTest?: boolean) => {
        this.workspace = isTest ? "LiveService_test" : "LiveService";
    };

    private getDataFromPayload = (data: any) => {
        if (data?.RESULT_DATA && data?.RESULT_CODE === "200") return data?.RESULT_DATA;
        return data;
    };

    public fetchShareInfo = cache(async (ref: ShareRef = "") => {
        try {
            const parts = ref.split("/");
            const first = parts[0];
            const last = parts[parts.length - 1];

            let dataInfo: ShareInfo = {
                title: "",
                description: "",
                thumb: "",
                data: undefined
            };

            switch (first) {
                case "product_detail":
                    dataInfo = await this.fetchGoodsInfo(Number(last));
                    break;
                case "playback":
                    dataInfo = await this.fetchLiveInfo(last);
                    break;
                case "youtube_player":
                    const pid = last.split("_").at(-1);
                    dataInfo = await this.fetchLiveInfo(pid as string);
                    break;
                case "event":
                    dataInfo = await this.fetchEventInfo(ref);
                    break;
                case "user_event_ab":
                case "user_event_poll":
                    dataInfo = await this.fetchUserEventInfo(Number(last));
                    break;

                default:
                    throw new Error("Invalid type ref");
            }

            return {
                ref: first,
                data: dataInfo
            };
        } catch (error) {
            logger.error("🚀 ~ fetchShareInfo:", error);
            return {
                ref: "error" as ShareRef,
                data: {
                    title: "ERROR",
                    description: "ERROR",
                    thumb: "ERROR",
                    data: undefined
                } as ShareInfo
            };
        }
    });

    private fetchGoodsInfo = async (goodsId: number): Promise<ShareInfo> => {
        const data = {
            JSON: JSON.stringify({
                // SHOPID: "",
                GOODSID: goodsId
                // F_USER_PID: "",
                // LIVE_TF: "",
                // CACHE_TF: "T"
            })
        };

        return await new Promise((resolve, reject) => {
            api.post(`/${this.workspace}/rest/ciplive/v1/goods/info`, data)
                .then((res) => {
                    if (res && res.data) {
                        const info = this.getDataFromPayload(res.data);
                        // console.log("🚀 ~ fetchGoodsInfo ~ info:", info);

                        resolve({
                            title: info?.[0].GOODS?.[0].NAME || "",
                            description: info?.[0].GOODS?.[0].GINFO || "",
                            thumb: info?.[0].GOODS?.[0].THUMURL || "",
                            data: info?.[0].GOODS?.[0]
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    private fetchEventInfo = async (ref: string): Promise<ShareInfo> => {
        const [, user_pid, pid] = ref.split("/");

        try {
            // Fetch event info
            const eventRes = await api.get(`/${this.workspace}/rest/ciplive/v1/idol/event`, {
                params: { eventPid: pid }
            });

            if (!eventRes?.data) {
                throw new Error("Failed to fetch event data");
            }

            const eventInfo = this.getDataFromPayload(eventRes.data);
            const eventData = eventInfo?.[0];

            if (!eventData) {
                throw new Error("Event data not found");
            }

            // Fetch rank list
            const rankRes = await api.get(`/${this.workspace}/rest/ciplive/v1/idol/event/rank/list`, {
                params: {
                    eventPid: Number(pid),
                    userPid: user_pid,
                    pageNum: 1,
                    pageSize: 30
                }
            });

            if (rankRes?.data) {
                const rankInfo = this.getDataFromPayload(rankRes.data);
                if (rankInfo?.[0]?.ITEMS) {
                    eventData.RANK_LIST = rankInfo[0].ITEMS;
                }
            }

            return {
                title: eventData.TITLE || "",
                description: eventData.CONTENT ?? eventData.TITLE ?? "",
                thumb: eventData.THUMB_URL || "",
                data: eventData
            };
        } catch (error) {
            logger.error("🚀 ~ fetchEventInfo ~ error:", error);
            throw error;
        }
    };

    private fetchUserEventInfo = async (eventId: number): Promise<ShareInfo> => {
        return await new Promise((resolve, reject) => {
            api.get(`/${this.workspace}/rest/ciplive/v1/idol/user/event`, {
                params: {
                    eventPid: eventId
                }
            })
                .then((res) => {
                    if (res && res.data) {
                        const info = this.getDataFromPayload(res.data);
                        console.log("🚀 ~ fetchUserEventInfo ~ info:", info);

                        resolve({
                            title: info?.[0].TITLE || "",
                            description: info?.DESCRIPTION ?? info?.[0].TITLE ?? "",
                            thumb: info?.[0].AUTHOR_AVATAR || "",
                            data: info?.[0]
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };

    private fetchLiveInfo = async (liveId: string): Promise<ShareInfo> => {
        const data = {
            JSON: JSON.stringify({
                LIVE_PID: liveId
                // USER_PID: "",
                // GOODS_TF: "T"
            })
        };

        return await new Promise((resolve, reject) => {
            api.post(`/${this.workspace}/rest/ciplive/v1/live/user`, data)
                .then((res) => {
                    if (res && res.data) {
                        const info = this.getDataFromPayload(res.data);
                        console.log("🚀 ~ fetchLiveInfo ~ info:", info);

                        resolve({
                            title: `${info?.[0].LIVE?.TITLE} (${info?.[0].LIVE?.USER_NAME})`,
                            description: info?.[0].LIVE?.SUB_TITLE || "",
                            thumb: info?.[0].LIVE?.IMAGE_URL || "",
                            data: info?.[0].LIVE
                        });
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    };
}

export const shareService = ShareApiService.getInstance({});

export * from "./types";

export default ShareApiService;
