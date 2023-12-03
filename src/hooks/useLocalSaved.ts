import { useContext } from "react";
import { ItemsContext } from "../provider/ItemsContext";

/* 現在登録済みのコンテンツ表記を調整・更新かつ localstorage を更新する */

export const useLocalSaved = () => {
    const { setItems } = useContext(ItemsContext);

    const _localSaved = (
        localSaveStr: string,
        localSaveBoxes: string[]
    ) => {
        localStorage.setItem(localSaveStr, JSON.stringify(localSaveBoxes));
        setItems((_prevItems) => localSaveBoxes);
    }

    return { _localSaved }
}