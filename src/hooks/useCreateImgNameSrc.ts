import { useContext } from "react";
import { ImgNameContext } from "../provider/ImgNameSrcContext";

/*（ダミー）画像のソースパス名を生成 */

export const useCreateImgNameSrc = () => {
    const { isImgNameSrc, setImgNameSrc } = useContext(ImgNameContext);

    /* ダミー画像生成サイトから用意する方法の場合 */
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

    /* img-1 といった画像名をナンバリングで指定（用意した画像を使用）する方法の場合 */
    const createImgNameSrc_alt = (
        itemNumber: number
    ) => {
        const imgNameSrcBoxes: string[] = [];
        for (let i = 1; i <= itemNumber; i++) {
            const newImg: string = `img-${i}`;
            imgNameSrcBoxes.push(newImg);
        }
        setImgNameSrc((_prevImgNameSrc) => [...isImgNameSrc, ...imgNameSrcBoxes]);
    }

    return { createImgNameSrc, createImgNameSrc_alt }
}