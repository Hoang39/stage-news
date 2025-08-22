"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { SquareX } from "lucide-react";

import useSite from "@/hooks/useSite";
import { Popup } from "@/interfaces/popup";

const placementStyles: Record<string, React.CSSProperties> = {
    "top-left": { top: "0", left: "0", transform: "translate(0, 0)" },
    "top-center": { top: "0", left: "50%", transform: "translateX(-50%)" },
    "top-right": { top: "0", right: "0", transform: "translate(0, 0)" },

    "middle-left": { top: "50%", left: "0", transform: "translateY(-50%)" },
    "middle-center": { top: "50%", left: "50%", transform: "translate(-50%, -50%)" },
    "middle-right": { top: "50%", right: "0", transform: "translateY(-50%)" },

    "bottom-left": { bottom: "0", left: "0", transform: "translate(0, 0)" },
    "bottom-center": { bottom: "0", left: "50%", transform: "translateX(-50%)" },
    "bottom-right": { bottom: "0", right: "0", transform: "translate(0, 0)" }
};

export default function PopupInformation() {
    const { popup: data, isFetching } = useSite({ site: process.env.NEXT_PUBLIC_SITE });

    const [popup, setPopup] = useState<Popup[]>([]);

    useEffect(() => {
        setPopup(data?.data.data.filter((item: any) => !localStorage.getItem(`popup-${item.id}`)));
    }, [data]);

    useEffect(() => {
        if (popup?.length > 0) {
            const initialClosedState: Record<number, boolean> = {};
            popup.forEach((item: any) => {
                initialClosedState[item.id] = false;
            });
        }
    }, [popup]);

    const handleClose = (id: number) => {
        localStorage.setItem(`popup-${id}`, "off");
        setPopup((prev: Popup[]) => prev.filter((item: any) => item.id != id));
    };

    const parseMargin = (margin: string) => {
        const [top, bottom, left, right] = margin.split("-").map(Number);
        return {
            marginTop: `${top}px`,
            marginBottom: `${bottom}px`,
            marginLeft: `${left}px`,
            marginRight: `${right}px`
        };
    };

    if (isFetching || !popup?.length) return undefined;
    else
        return (
            <>
                {popup?.map((item: Popup, index: number) => {
                    const marginStyle = parseMargin(item.margin);
                    return (
                        <div
                            key={index}
                            style={{
                                ...(placementStyles[item.placement] || {}),
                                ...marginStyle
                            }}
                            className='popup-container'
                        >
                            {item.link ? (
                                <Link href={item.link} target='_blank' rel='noopener noreferrer'>
                                    <div
                                        style={{
                                            width: item.width,
                                            height: item.height,
                                            maxWidth: "90vw",
                                            maxHeight: "90vh",
                                            backgroundImage: `url(${item.image})`,
                                            backgroundSize: "cover",
                                            backgroundPosition: "center"
                                        }}
                                    />
                                </Link>
                            ) : (
                                <div
                                    style={{
                                        width: item.width,
                                        height: item.height,
                                        maxWidth: "90vw",
                                        maxHeight: "90vh",
                                        backgroundImage: `url(${item.image})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center"
                                    }}
                                />
                            )}
                            <div className='popup-footer'>
                                <SquareX size={20} onClick={() => handleClose(item.id)} />
                            </div>
                        </div>
                    );
                })}
            </>
        );
}
