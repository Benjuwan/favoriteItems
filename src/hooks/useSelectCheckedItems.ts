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
                    const itemTargetInputEl = item.querySelector('input[type="checkbox"]');
                    itemTargetInputEl?.setAttribute('checked', 'true');
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