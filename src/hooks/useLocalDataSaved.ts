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

    const LocalDataSave: () => void = () => {
        /* 任意の配列から特定のデータ（対象コンテンツのid）を取得して 当該コンテンツの中身（itemContent.innerHTML）を localstorage の配列に格納 */
        const itemContents: NodeListOf<HTMLDivElement> = document.querySelectorAll('.itemsOrigin');
        isCheckItems.forEach(checkItem => {
            itemContents.forEach(itemContent => {
                const checkItemId = checkItem.split('item-')[1];
                const itemOriginItemId: string | undefined = itemContent.getAttribute('id')?.split('itemsOrigin-')[1];
                if (checkItemId === itemOriginItemId) {
                    const strItemContent: string = String(itemContent.innerHTML);
                    _pushLocalSaveBoxes(strItemContent);
                }
            });
        });
        _localSaved('localSaveBoxes', localSaveBoxes);
    }

    return { LocalDataSave }
}