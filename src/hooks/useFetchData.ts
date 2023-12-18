import { contentType } from "../ts/contentType";

/* コンテンツデータを取得 */

export const useFetchData = () => {
    const FetchData: (url: string) => Promise<contentType[]> = async (url: string) => {
        const response = await fetch(url, { cache: "no-store" });
        const resObj: contentType[] = await response.json();
        return resObj;
    }

    return { FetchData }
}