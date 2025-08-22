import { NextRequest } from "next/server";

type NextCustomMiddleWareType = (
    req: NextRequest,
    params?: { next?: () => void; prevResult?: any }
) => Promise<any | Response>;

export const handler =
    (...middlewares: NextCustomMiddleWareType[]) =>
    async (req: NextRequest) => {
        let result;
        for (let i = 0; i < middlewares.length; i++) {
            let nextInvoked = false;
            const next = () => {
                nextInvoked = true;
            };
            result = await middlewares[i](req, { next, prevResult: result });
            if (!nextInvoked) {
                break;
            }
        }
        return result;
    };
