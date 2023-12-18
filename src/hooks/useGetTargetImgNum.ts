/* 指定したワード（prefix-）を先頭に置いた文字列に加工する（各画像データのナンバーを取得するのに使用）*/

export const useGetTargetImgNum = () => {
    const GetTargetImgNum: (item: string, prefix: string) => string = (
        item: string,
        prefix: string
    ) => {
        // console.log(item.split('itemsOrigin-')[1]);
        const targetNumber = item.split('itemsOrigin-')[1].split('"')[0];
        return `${prefix}-${targetNumber}`;
    }

    return { GetTargetImgNum }
}