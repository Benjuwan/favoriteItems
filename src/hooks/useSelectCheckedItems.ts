import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useGetTargetImgNum } from "./useGetTargetImgNum";
import { usePushLocalSaveBoxes } from "./usePushLocalSaveBoxes";
import { useLocalSaved } from "./useLocalSaved";

export const useSelectCheckedItems = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext);
    const { setCheckItems } = useContext(CheckItemsContext);

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

        const items: NodeListOf<HTMLDivElement> = document.querySelectorAll('.defaultWrapper .items');
        items.forEach(item => {
            item.classList.remove('checkedContent'); // 初期化（checkedContent を削除）
            const itemImgAltTxt: string | null | undefined = item.querySelector('img')?.getAttribute('alt');
            selectCheckedItems.forEach(selectCheckedItem => {
                if (itemImgAltTxt?.match(selectCheckedItem)) {
                    const itemsOrigin: HTMLDivElement | null = item.querySelector('.itemsOrigin');
                    if (itemsOrigin !== null) {
                        _pushLocalSaveBoxes(itemsOrigin?.innerHTML);
                        _localSaved('localSaveBoxes', localSaveBoxes);
                    }
                    item.classList.toggle('checkedContent');
                }
            });
        });
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