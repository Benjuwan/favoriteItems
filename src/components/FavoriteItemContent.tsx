import { memo, useEffect, useContext } from "react";
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

export const FavoriteItemContent = memo(() => {
    const { isItems } = useContext(ItemsContext);

    const { inUseEffect_act_selectCheckedItems } = useSelectCheckedItems();
    useEffect(() => inUseEffect_act_selectCheckedItems(), []);

    const { GetTargetImgNum } = useGetTargetImgNum();

    const { RemoveItems } = useRemoveItems();

    return (
        <div className="itemsWrapper favorites">
            {isItems?.map((item, i) => (
                <div className="items favorites" key={i}>
                    <ItemContent index={i} imgNameViewBool={true}>
                        {parse(item)}
                        <p>{GetTargetImgNum(item, 'items')}の画像</p>
                        <button className="removeItems" onClick={(btnEl) => {
                            btnEl.stopPropagation(); // 親要素の click イベント（viewDetails）の実行防止
                            RemoveItems(GetTargetImgNum(item, 'itemsOrigin'));
                        }}>お気に入り解除</button>
                    </ItemContent>
                </div>
            ))}
        </div>
    );
});