import { useContext } from "react";
import { ItemsContext } from "../provider/ItemsContext";

/* 現在登録済みのコンテンツ表記を調整・更新かつ localstorage を更新する */

export const useLocalSaved = () => {
    const { setItems } = useContext(ItemsContext);

    const _localSaved = (
        localSaveStr: string,
        localSaveBoxes: string[]
    ) => {
        /* new Set で（登録予定のコンテンツたちの）重複分を排除及びソートし、Array.from で配列形式として処理を進めていく */
        const newSetLocalSaveBoxes: string[] = Array.from(new Set([...localSaveBoxes]));
        localStorage.setItem(localSaveStr, JSON.stringify(newSetLocalSaveBoxes));
        setItems((_prevItems) => newSetLocalSaveBoxes);
    }

    return { _localSaved }
}