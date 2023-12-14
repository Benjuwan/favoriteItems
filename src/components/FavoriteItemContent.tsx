import { memo, FC, useEffect, useState } from "react";
import parse from 'html-react-parser';
/**
 * 【html-react-parser】HTML文字列をReact要素に変換するツール
 * https://www.npmjs.com/package/html-react-parser
 * 
 * npm i html-react-parser
 * 
 * 参考サイト：https://www.engilaboo.com/react-html-parse/
*/

import { ItemContent } from "./ItemContent";
import { useSelectCheckedItems } from "../hooks/useSelectCheckedItems";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { useRemoveItems } from "../hooks/useRemoveItems";
import { useNolocalDataButChekedExist } from "../hooks/useNolocalDataButChekedExist";
import { useGetCurrentLocalSaveData_DataSort } from "../hooks/useGetCurrentLocalSaveData_DataSort";

type favoriteItemContentType = {
    FirstRenderSignal: boolean;
    setFirstRenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FavoriteItemContent: FC<favoriteItemContentType> = memo(({ FirstRenderSignal, setFirstRenderSignal }) => {
    const { GetTargetImgNum } = useGetTargetImgNum();
    const { RemoveItems } = useRemoveItems();
    const { _nolocalDataButChekedExist } = useNolocalDataButChekedExist();
    const { ActionSelectCheckedItems } = useSelectCheckedItems();
    const { GetCurrentLocalSaveData_DataSort } = useGetCurrentLocalSaveData_DataSort();

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    /* 既存の localStorage データをソート（して isCheckSaveData に反映）*/
    GetCurrentLocalSaveData_DataSort(setCheckSaveData);

    /* ラベルクリックによる登録コンテンツ削除で既存の localStorage データが空になった時の再登録処理（LocalSaveCtrl.tsx でも使用）*/
    useEffect(() => _nolocalDataButChekedExist(isCheckSaveData, FirstRenderSignal, setFirstRenderSignal), [isCheckSaveData]);

    /* useSelectCheckedItems.ts：登録されている localStorage データを呼び出して、.defaultWrapper の登録済みコンテンツには特定のスタイルをあてる（見た目に反映させる）処理 */
    useEffect(() => ActionSelectCheckedItems(), []);

    /* お気に入り解除したコンテンツと合致する一覧コンテンツから checkedContent クラスを削除 */
    const _removeClassName_CheckedContent = (btnEl: HTMLButtonElement) => {
        const removeItem_imgName: string | undefined | null = btnEl.closest('.favorites')?.querySelector('#itemName')?.textContent;
        const removeItem_targetImgName: string | undefined = removeItem_imgName?.split('：')[0];
        const defaultItems_checkedContents: NodeListOf<HTMLDivElement> = document.querySelectorAll('.defaultWrapper .checkedContent');
        defaultItems_checkedContents.forEach(defaultItems_checkedContent => {
            const targetEl_idAttr = defaultItems_checkedContent.querySelector('.itemContents')?.getAttribute('id') as string; // 型アサーション：型推論の上書き
            if (targetEl_idAttr === removeItem_targetImgName) defaultItems_checkedContent.classList.remove('checkedContent');
        });
    }

    return (
        <div className="itemsWrapper favoriteWrapper">
            {isCheckSaveData?.map((item, i) => (
                <div className="items favorites" key={i}>
                    <ItemContent index={i}>
                        {parse(item)}
                        <p id="itemName">{GetTargetImgNum(item, 'items')}</p>
                        <button className="removeItems" onClick={(btnEl) => {
                            btnEl.stopPropagation(); // 親要素の click イベント（viewDetails）の実行防止
                            _removeClassName_CheckedContent(btnEl.currentTarget);
                            RemoveItems(GetTargetImgNum(item, 'itemsOrigin'));
                        }}>お気に入り解除</button>
                    </ItemContent>
                </div>
            ))}
        </div>
    );
});