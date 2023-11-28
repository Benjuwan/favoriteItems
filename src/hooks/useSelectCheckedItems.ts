import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useGetTargetImgNum } from "./useGetTargetImgNum";
import { usePushLocalSaveBoxes } from "./usePushLocalSaveBoxes";
import { useLocalSaved } from "./useLocalSaved";

export const useSelectCheckedItems = () => {
    const { setCheckItems } = useContext(CheckItemsContext);
    const { localSaveBoxes } = useContext(LocalStorageContext);

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();

    const _selectCheckedItems = (SaveDateItems: string[]) => {
        const shallowCopy: string[] = [...SaveDateItems];
        const selectCheckedItems = shallowCopy.map(SaveDateItem => {
            const getTargetImgNumbers: string = GetTargetImgNum(SaveDateItem, 'itemsOrigin');
            return getTargetImgNumbers;
        });
        setCheckItems((_prevCheckitems) => selectCheckedItems);

        /* setTimeout による（タスクキューの）疑似的な遅延・非同期処理 */
        setTimeout(() => {
            const items: NodeListOf<HTMLDivElement> = document.querySelectorAll('.defaults .items');
            items.forEach(item => {
                const itemImgAltTxt: string | null | undefined = item.querySelector('img')?.getAttribute('alt');
                selectCheckedItems.forEach(selectCheckedItem => {
                    if (itemImgAltTxt?.match(selectCheckedItem)) {
                        const itemsOrigin: HTMLDivElement | null = item.querySelector('.itemsOrigin');
                        if (itemsOrigin !== null) {
                            _pushLocalSaveBoxes(itemsOrigin?.innerHTML);
                            _localSaved('localSaveBoxes', localSaveBoxes);
                        }

                        /* 既存のお気に入りアイテムのキープを行いたい場合 */
                        const itemTargetInputEl = item.querySelector('input[type="checkbox"]');
                        itemTargetInputEl?.setAttribute('checked', 'true');
                    }
                });
            });
        }, 1);
    }

    const inUseEffect_act_selectCheckedItems = () => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            _selectCheckedItems(SaveDateItems);
        }
    }

    return { inUseEffect_act_selectCheckedItems }
}