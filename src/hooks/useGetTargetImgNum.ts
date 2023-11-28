export const useGetTargetImgNum = () => {
    const GetTargetImgNum = (
        item: string,
        prefix: string
    ) => {
        const targetNumber = item.split('itemsOrigin-')[1].split('">')[0];
        return `${prefix}-${targetNumber}`;
    }

    return { GetTargetImgNum }
}