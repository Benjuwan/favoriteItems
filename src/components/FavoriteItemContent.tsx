import { memo, useEffect, useContext, useState } from "react";
import parse from 'html-react-parser';
/**
 * 【html-react-parser】HTML文字列をReact要素に変換するツール
 * https://www.npmjs.com/package/html-react-parser
 * 
 * npm i html-react-parser
 * 
 * 参考サイト：https://www.engilaboo.com/react-html-parse/
*/

import { ItemsContext } from "../provider/ItemsContext";
import { ItemContent } from "./ItemContent";
import { useSelectCheckedItems } from "../hooks/useSelectCheckedItems";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { useRemoveItems } from "../hooks/useRemoveItems";
import { useResetAllFavorite } from "../hooks/useResetAllFavorite";

export const FavoriteItemContent = memo(() => {
    const { isItems } = useContext(ItemsContext);

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { RemoveItems } = useRemoveItems();
    const { ResetAllFavorite } = useResetAllFavorite();

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
        }
    }, [isItems]);

    const { inUseEffect_act_selectCheckedItems } = useSelectCheckedItems();
    useEffect(() => inUseEffect_act_selectCheckedItems(), []);

    return (
        <div className="itemsWrapper favoriteWrapper">
            {isItems?.map((item, i) => (
                <div className="items favorites" key={i}>
                    <ItemContent index={i}>
                        {parse(item)}
                        <p>{GetTargetImgNum(item, 'items')}の画像</p>
                        <button className="removeItems" onClick={(btnEl) => {
                            btnEl.stopPropagation(); // 親要素の click イベント（viewDetails）の実行防止
                            RemoveItems(GetTargetImgNum(item, 'itemsOrigin'));
                            { isCheckSaveData.length <= 1 && ResetAllFavorite }
                        }}>お気に入り解除</button>
                    </ItemContent>
                </div>
            ))}
        </div>
    );
});