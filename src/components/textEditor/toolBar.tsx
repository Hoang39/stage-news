"use client";

import { useCallback, useEffect, useState } from "react";

import { type Editor } from "@tiptap/react";
import { Select } from "antd";
import {
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    Image,
    Italic,
    Link,
    Quote,
    Redo,
    Strikethrough,
    Underline,
    Undo
} from "lucide-react";

import axiosInstance from "@/libs/axios";
import { hexToRgb, rgbToHex } from "@/libs/color";
import { useNotificationContext } from "@/providers/notificationProvider";

const { Option } = Select;

type Props = {
    editor: Editor | null;
};

const Toolbar = ({ editor }: Props) => {
    const fontSize = editor?.getAttributes("textStyle").fontSize;

    const [selectedSize, setSelectedSize] = useState(parseInt(fontSize, 10) || 14);

    const { openNotification } = useNotificationContext();

    const handleFontSizeChange = (size: number) => {
        setSelectedSize(size);
        editor
            ?.chain()
            .focus()
            .setMark("textStyle", { fontSize: `${size}px` })
            .run();
    };

    useEffect(() => {
        if (!editor) return;
        setSelectedSize(parseInt(fontSize, 10) || 14);
    }, [fontSize, editor]);

    const addImage = useCallback(() => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";

        input.onchange = async (event: any) => {
            const file = event.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.set("file", file);

            try {
                const { data } = await axiosInstance.post("/file", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });

                editor?.chain().focus().setImage({ src: data?.data?.path }).run();
            } catch (error) {
                openNotification("error", "Upload failed!", undefined, {
                    showProgress: true,
                    pauseOnHover: true
                });
                throw error;
            }
        };

        input.click();
    }, [editor, openNotification]);

    const setLink = useCallback(() => {
        const previousUrl = editor?.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);

        if (url == null) {
            return;
        }

        if (url == "") {
            editor?.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }

        try {
            editor?.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
        } catch (error) {
            throw error;
        }
    }, [editor]);

    const toolbarList = [
        {
            name: "Undo",
            action: () => editor?.chain().focus().undo().run(),
            isActive: () => false,
            reset: () => {},
            Icon: Undo
        },
        {
            name: "Redo",
            action: () => editor?.chain().focus().redo().run(),
            isActive: () => false,
            reset: () => {},
            Icon: Redo
        },
        {
            name: "Bold",
            action: () => editor?.chain().focus().toggleBold().run(),
            isActive: () => editor?.isActive("bold"),
            reset: () => editor?.chain().focus().toggleBold().run(),
            Icon: Bold
        },
        {
            name: "Italic",
            action: () => editor?.chain().focus().toggleItalic().run(),
            isActive: () => editor?.isActive("italic"),
            reset: () => editor?.chain().focus().toggleItalic().run(),
            Icon: Italic
        },
        {
            name: "Underline",
            action: () => editor?.chain().focus().toggleUnderline().run(),
            isActive: () => editor?.isActive("underline"),
            reset: () => editor?.chain().focus().toggleUnderline().run(),
            Icon: Underline
        },
        {
            name: "Strike",
            action: () => editor?.chain().focus().toggleStrike().run(),
            isActive: () => editor?.isActive("strike"),
            reset: () => editor?.chain().focus().toggleStrike().run(),
            Icon: Strikethrough
        },
        {
            name: "Blockquote",
            action: () => editor?.chain().focus().toggleBlockquote().run(),
            isActive: () => editor?.isActive("blockquote"),
            reset: () => editor?.chain().focus().toggleBlockquote().run(),
            Icon: Quote
        },
        {
            name: "Image",
            action: addImage,
            isActive: () => false,
            reset: () => {},
            Icon: Image
        },
        {
            name: "Link",
            action: setLink,
            isActive: () => editor?.isActive("link"),
            reset: () => editor?.chain().focus().unsetLink().run(),
            Icon: Link
        },
        {
            name: "AlignLeft",
            action: () => editor?.chain().focus().setTextAlign("left").run(),
            isActive: () => editor?.isActive({ textAlign: "left" }),
            reset: () => editor?.chain().focus().unsetTextAlign().run(),
            Icon: AlignLeft
        },
        {
            name: "AlignCenter",
            action: () => editor?.chain().focus().setTextAlign("center").run(),
            isActive: () => editor?.isActive({ textAlign: "center" }),
            reset: () => editor?.chain().focus().unsetTextAlign().run(),
            Icon: AlignCenter
        },
        {
            name: "AlignRight",
            action: () => editor?.chain().focus().setTextAlign("right").run(),
            isActive: () => editor?.isActive({ textAlign: "right" }),
            reset: () => editor?.chain().focus().unsetTextAlign().run(),
            Icon: AlignRight
        },
        {
            name: "AlignJustify",
            action: () => editor?.chain().focus().setTextAlign("justify").run(),
            isActive: () => editor?.isActive({ textAlign: "justify" }),
            reset: () => editor?.chain().focus().unsetTextAlign().run(),
            Icon: AlignJustify
        }
    ];

    if (!editor) {
        return null;
    }
    return (
        <div className='toolbar-wrap'>
            <div>
                {toolbarList?.map((item, index: number) => (
                    <button
                        key={index}
                        type='button'
                        onClick={(e) => {
                            e.preventDefault();
                            if (item?.isActive()) {
                                item.reset();
                            } else {
                                item.action();
                            }
                        }}
                        className={`${item?.isActive() ? "active" : "inactive"}`}
                    >
                        <item.Icon />
                    </button>
                ))}

                <input
                    type='color'
                    onChange={(event) =>
                        editor.chain().focus().setColor(hexToRgb(event.target.value, "rgb(153,153,153)")).run()
                    }
                    value={rgbToHex(editor.getAttributes("textStyle").color ?? "", "#999999")}
                    data-testid='setColor'
                />

                <Select
                    size='small'
                    value={selectedSize}
                    className=''
                    onChange={handleFontSizeChange}
                    style={{ width: "48px" }}
                >
                    {Array.from({ length: 20 }, (_, i) => (i + 1) * 2)?.map((item: number, index: number) => (
                        <Option key={index} value={item} style={{ fontSize: "12px" }}>
                            {item}
                        </Option>
                    ))}
                </Select>
            </div>
        </div>
    );
};

export default Toolbar;
