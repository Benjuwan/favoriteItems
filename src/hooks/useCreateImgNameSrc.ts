export const useCreateImgNameSrc = () => {
    const createImgNameSrc = (
        itemNumber: number,
        targetAry: string[],
        isImgNameSrc: string[],
        setImgNameSrc: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const imgNameSrcBoxes: string[] = [];
        for (let i = 0; i < itemNumber; i++) {
            const newImg: string = targetAry[i];
            imgNameSrcBoxes.push(newImg);
        }
        setImgNameSrc((_prevImgNameSrc) => [...isImgNameSrc, ...imgNameSrcBoxes]);
    }

    return { createImgNameSrc }
}