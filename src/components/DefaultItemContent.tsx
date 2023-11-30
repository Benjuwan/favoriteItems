import { memo, useState, useEffect, useContext } from "react";
import { ImgNameContext } from "../provider/ImgNameSrcContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { ItemContent } from "./ItemContent";
import { CheckBox } from "./CheckBox";

export const DefaultItemContent = memo(() => {
    const { isImgNameSrc } = useContext(ImgNameContext);
    const { isCheckItems } = useContext(CheckItemsContext);

    const [isAdjustItems, setAdjustItems] = useState<string[]>([]);

    useEffect(() => {
        const favoritesItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.favorites .items');
        if (favoritesItems.length > 0) {
            const favoriteItemAltTxt: string[] = [];
            favoritesItems.forEach(favoritesItem => {
                const targetImgAltTxt: string | null | undefined = favoritesItem.querySelector('img')?.getAttribute('alt');
                const adjustAltTxt: string | undefined = targetImgAltTxt?.split('：')[1].split('の画像')[0];
                if (typeof adjustAltTxt !== "undefined") favoriteItemAltTxt.push(adjustAltTxt);
            });

            const adjustItems = [...isImgNameSrc].filter(item => {
                /*（![...favoriteItemAltTxt] ＝ boolean{ false } の配列）以下の処理で true の要素を返して、それに合致する item が返却される */
                return ![...favoriteItemAltTxt].some(favoriteItem => item.match(favoriteItem));
            });
            setAdjustItems((_prevAdjustItems) => [...isAdjustItems, ...adjustItems]);
        }
    }, [isCheckItems]);

    return (
        <div className="itemsWrapper defaults">
            {/* {isAdjustItems.length > 0 ?
                <>{isAdjustItems.map((Adjust_imgNameSrc, i) => (
                    <div className="items" key={i}>
                        <ItemContent imgNameSrc={Adjust_imgNameSrc} index={i} />
                        <CheckBox index={i} />
                    </div>
                ))}</> :
                <>{isImgNameSrc.map((imgNameSrc, i) => (
                    <div className="items" key={i}>
                        <ItemContent imgNameSrc={imgNameSrc} index={i} />
                        <CheckBox index={i} />
                    </div>
                ))}</>
            } */}
            {isImgNameSrc.map((imgNameSrc, i) => (
                <div className="items" key={i}>
                    <ItemContent imgNameSrc={imgNameSrc} index={i} />
                    <CheckBox index={i} />
                </div>
            ))}
        </div>
    );
});