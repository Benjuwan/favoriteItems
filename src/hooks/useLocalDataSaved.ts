import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useLocalSaved } from "./useLocalSaved";
import { usePushLocalSaveBoxes } from "./usePushLocalSaveBoxes";

/* localstorage への登録処理 */

export const useLocalDataSaved = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext)
    const { isCheckItems } = useContext(CheckItemsContext);

    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();

    /* 任意の配列から特定のデータ（対象コンテンツのid）を取得して 当該コンテンツの中身（itemContent.innerHTML）を localstorage の配列に格納 */
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

    /* 既存の localStorage データの有無を確認して存在する場合は、チェックされているコンテンツの中身（itemsOriginContent）を localstorage の配列に格納及び、現在登録済みのコンテンツ表記を調整・更新かつ localstorage を更新する */
    const LocalDataSave = () => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            if (SaveDateItems.length > 0) {
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
            }
        }

        /* 初回時の処理 */
        else {
            _getSpecificItems(isCheckItems);
            /* 現在登録済みのコンテンツ表記を調整・更新かつ localstorage を更新する */
            _localSaved('localSaveBoxes', localSaveBoxes);
        }
    }

    return { LocalDataSave }
}