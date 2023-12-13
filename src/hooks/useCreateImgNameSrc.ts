import { useContext } from "react";
import { contentType } from "../ts/contentType";
import { ImgNameContext } from "../provider/ImgNameSrcContext";

/* 画像のソースパス名を生成 */

export const useCreateImgNameSrc = () => {
    const { isImgNameSrc, setImgNameSrc } = useContext(ImgNameContext);

    /* 画像データのナンバリングを特定の表記（桁が変わるごとに微調整）にしたい場合 */
    // const _adjust_SpecificImgSrcName = (targetEl: contentType) => {
    //     if (targetEl.contentNumber < 10) {
    //         /* 10 個目までは img-00x の表記 */
    //         return `img-00${targetEl.contentNumber}`;
    //     } else if (targetEl.contentNumber < 100) {
    //         /* 10 個目から 100 個目までは img-0xx の表記 */
    //         return `img-0${targetEl.contentNumber}`;
    //     } else {
    //         return `img-${targetEl.contentNumber}`;
    //     }
    // }

    /* img-1 といった画像名をナンバリングで指定（用意した画像を使用）する方法の場合 */
    const createImgNameSrc = (
        targetAry: contentType[]
    ) => {
        const getTargetElsName: string[] = targetAry.map(targetEl => {
            // return _adjust_SpecificImgSrcName(targetEl);
            return `img-${targetEl.contentNumber}`;
        });
        setImgNameSrc((_prevImgNameSrc) => [...isImgNameSrc, ...getTargetElsName]);
    }

    return { createImgNameSrc }
}