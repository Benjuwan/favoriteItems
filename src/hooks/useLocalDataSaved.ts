import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useGetTargetImgNum } from "./useGetTargetImgNum";
import { useLocalSaved } from "./useLocalSaved";
import { usePushLocalSaveBoxes } from "./usePushLocalSaveBoxes";

export const useLocalDataSaved = () => {
    const { localSaveBoxes, checkedLists } = useContext(LocalStorageContext)
    const { isCheckItems } = useContext(CheckItemsContext);

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();


    const _setCheckedLists = () => {
        const checkedItems: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        if (checkedItems.length > 0) {
            checkedItems.forEach(checkedItem => {
                checkedLists.push(checkedItem.getAttribute('id') as string);
                localStorage.setItem('checkedLists', JSON.stringify(checkedLists));
            });
        }
    }

    const _getSpecificItems = (targetAry: string[]) => {
        const itemContents: NodeListOf<HTMLDivElement> = document.querySelectorAll('.itemsOrigin');
        targetAry.forEach(targetEl => {
            itemContents.forEach(itemContent => {
                const targetElId = targetEl.split('item-')[1];
                const itemOriginItemId: string | undefined = itemContent.getAttribute('id')?.split('itemsOrigin-')[1];
                if (targetElId === itemOriginItemId) {
                    const strItemContent: string = String(itemContent.innerHTML);
                    _pushLocalSaveBoxes(strItemContent);
                }
            });
        });
    }

    const LocalDataSave = () => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            if (SaveDateItems.length > 0) {
                const currCheckedItems = SaveDateItems.map(item => GetTargetImgNum(item, 'item'));
                const notSameItems = isCheckItems.filter(checkItem => {
                    return currCheckedItems.filter(currCheckedItem => checkItem !== currCheckedItem);
                });
                console.log(notSameItems);

                const checkedItems: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
                if (checkedItems.length > 0) {
                    const itemsOriginStrs: string[] = [];
                    checkedItems.forEach(checkedItem => {
                        const parentEl: HTMLDivElement | null = checkedItem.closest('.items');
                        const itemsOriginContent: string | undefined = parentEl?.querySelector('.itemsOrigin')?.innerHTML;
                        if (typeof itemsOriginContent !== "undefined") {
                            itemsOriginStrs.push(itemsOriginContent);
                        }
                    });
                    _pushLocalSaveBoxes(itemsOriginStrs);
                    _localSaved('localSaveBoxes', localSaveBoxes);
                }

                // _setCheckedLists();
            }
        }

        /* 初回時の処理 */
        else {
            _getSpecificItems(isCheckItems);
            _localSaved('localSaveBoxes', localSaveBoxes);
            // _setCheckedLists();
        }
    }

    return { LocalDataSave }
}