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
        console.log(shallowCopy);
        const selectCheckedItems = shallowCopy.map(SaveDateItem => {
            const getTargetImgNumbers: string = GetTargetImgNum(SaveDateItem, 'itemsOrigin');
            return getTargetImgNumbers;
        });
        setCheckItems((_prevCheckitems) => selectCheckedItems);

        setTimeout(() => {
            const items: NodeListOf<HTMLDivElement> = document.querySelectorAll('.defaults .items');
            const itemsContent: string[][] = [];
            items.forEach(item => {
                const itemsOrigin: HTMLDivElement | null = item.querySelector('.itemsOrigin');
                const itemImgAltTxt: string | null | undefined = item.querySelector('img')?.getAttribute('alt');
                if (itemsOrigin && itemImgAltTxt) {
                    itemsContent.push([itemsOrigin?.innerHTML, itemImgAltTxt]);
                }
            });

            const getTarget_itemsContent: string[][] = [...itemsContent].filter(item => {
                return ![...selectCheckedItems].some(selectCheckedItem => !item[1].match(selectCheckedItem));
            });

            getTarget_itemsContent.forEach(getTarget_itemsContent => {
                console.log(getTarget_itemsContent);
                _pushLocalSaveBoxes(getTarget_itemsContent[0]);
                _localSaved('localSaveBoxes', localSaveBoxes);
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