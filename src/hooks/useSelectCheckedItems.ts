import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useGetTargetImgNum } from "./useGetTargetImgNum";
import { usePushLocalSaveBoxes } from "./usePushLocalSaveBoxes";
import { useLocalSaved } from "./useLocalSaved";

/* 登録されている localStorage データを呼び出して、.defaultWrapper のコンテンツに反映する処理 */

export const useSelectCheckedItems = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext);
    const { setCheckItems } = useContext(CheckItemsContext);

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();

    const _selectCheckedItems = (SaveDateItems: string[]) => {
        /* 現在登録済みのコンテンツ表記を調整・更新する処理 */
        const shallowCopy: string[] = [...SaveDateItems];
        const selectCheckedItems = shallowCopy.map(SaveDateItem => {
            const getTargetImgNumbers: string = GetTargetImgNum(SaveDateItem, 'itemsOrigin');
            return getTargetImgNumbers;
        });
        setCheckItems((_prevCheckitems) => selectCheckedItems);

        /* .defaultWrapper のコンテンツ（.itemsOrigin の子要素たち）を対象に、登録された内容と合致するものを localStorage へセット及び見た目に反映させる処理 */
        const items: NodeListOf<HTMLDivElement> = document.querySelectorAll('.defaultWrapper .items');
        items.forEach(item => {
            item.classList.remove('checkedContent'); // 初期化（checkedContent クラスを削除）

            const itemImgAltTxt: string | null | undefined = item.querySelector('img')?.getAttribute('alt');
            selectCheckedItems.forEach(selectCheckedItem => {
                if (itemImgAltTxt?.match(selectCheckedItem)) {
                    const itemsOrigin: HTMLDivElement | null = item.querySelector('.itemsOrigin');
                    if (itemsOrigin !== null) {
                        _pushLocalSaveBoxes(itemsOrigin?.innerHTML);
                        _localSaved('localSaveBoxes', localSaveBoxes);
                    }
                    
                    item.classList.toggle('checkedContent'); // 選択されたコンテンツにシグナル用の class を付与
                }
            });
        });
    }

    /* 登録されている localStorage データを呼び出して、.defaultWrapper のコンテンツに反映する処理 */
    const inUseEffect_act_selectCheckedItems = () => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            _selectCheckedItems(SaveDateItems);
        }
    }

    return { inUseEffect_act_selectCheckedItems }
}