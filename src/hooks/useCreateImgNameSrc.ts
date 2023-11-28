import { useContext } from "react";
import { ImgNameContext } from "../provider/ImgNameSrcContext";

export const useCreateImgNameSrc = () => {
    const { isImgNameSrc, setImgNameSrc } = useContext(ImgNameContext);

    const createImgNameSrc = (
        itemNumber: number,
        targetAry: string[]
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