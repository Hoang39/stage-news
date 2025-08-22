import NewsDetail from "@/components/news/newsDetail";

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function News(props: Props) {
    const { slug } = await props.params;

    return (
        <>
            <NewsDetail slug={slug} />
        </>
    );
}
