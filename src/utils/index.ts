const translateContent = function (content: string, lang: string) {
    if (!content || !lang) {
        return "";
    }
    try {
        const contentObj = JSON.parse(content);
        if (contentObj[lang] === undefined) {
            return content || "[Content Error]";
        }
        return contentObj[lang];
    } catch {
        return content || "[Content Error]";
    }
};

const extractText = function (content: string) {
    if (!content) return content;
    const parts = content.split("::");
    return parts.length > 1 ? parts.slice(1).join("::") : content;
};

export const translateFn = (key: string, lang: string) => {
    try {
        const parsedKey = JSON.parse(key);
        if (typeof parsedKey === "object" && parsedKey !== null) {
            return translateContent(key, lang);
        }
    } catch {}
    return extractText(key);
};

export const formatStringLength = (str: string, length?: number) => {
    if (!length) length = 10;
    let result = "";

    if (str.length > length) {
        result = str.slice(0, length - 3);
        result += "...";
    } else {
        result = str;
    }

    return result;
};
