import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useLocalSaved } from "./useLocalSaved";
import { usePushLocalSaveBoxes } from "./usePushLocalSaveBoxes";
import { useReturnTargetElsStr } from "./useReturnTargetElsStr";

/* localstorage への登録処理 */

export const useLocalDataSaved = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext)
    const { isCheckItems } = useContext(CheckItemsContext);

    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();
    const { _returnTargetElsStr } = useReturnTargetElsStr();

    /* 任意の配列から特定のデータ（対象コンテンツのid）を取得して 当該コンテンツの中身（itemContent.innerHTML）を localstorage の配列に格納 */
    const _getSpecificItems: (targetAry: string[]) => void = (targetAry: string[]) => {
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

    /* 既存の localStorage データの有無を確認して存在する場合は、チェックされているコンテンツの中身（itemsOriginContent）を localstorage の配列に格納及び localstorage を更新する */
    const LocalDataSave: () => void = () => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            if (SaveDateItems.length > 0) {
                const checkedItems: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
                if (checkedItems.length > 0) {
                    const itemsOriginStrs: string[] = _returnTargetElsStr(checkedItems); // 条件に一致する複数要素が持つ「任意の子要素の中身（.itemsOrigin の中身）」を文字列として取得
                    _pushLocalSaveBoxes(itemsOriginStrs);
                    _localSaved('localSaveBoxes', localSaveBoxes);
                }
            }
        }

        /* 初回時の処理 */
        else {
            _getSpecificItems(isCheckItems);
            _localSaved('localSaveBoxes', localSaveBoxes);
        }
    }

    return { LocalDataSave }
}