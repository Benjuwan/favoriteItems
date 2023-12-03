import { useContext } from "react";
import { ItemsContext } from "../provider/ItemsContext";

/* localstorage を更新する */

export const useLocalSaved = () => {
    const { setItems } = useContext(ItemsContext);

    const _localSaved = (
        localSaveStr: string,
        localSaveBoxes: string[]
    ) => {
        localStorage.setItem(localSaveStr, JSON.stringify(localSaveBoxes));
        setItems((_prevItems) => localSaveBoxes); // 登録（予定）コンテンツの中身（.itemsOrigin の中身）を更新
    }

    return { _localSaved }
}