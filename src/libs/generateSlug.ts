import { nanoid } from "nanoid";
import slugify from "slugify";

export function generateSlug(title: string): string {
    const slug = slugify(title, {
        lower: true,
        strict: true,
        locale: "ko"
    });

    return `${slug}-${nanoid(6)}`;
}
