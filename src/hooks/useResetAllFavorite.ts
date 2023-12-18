import { useContext } from "react";
import { ItemsContext } from "../provider/ItemsContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";

/* localStorage データの削除及び、現在登録済みのコンテンツ表記と登録予定コンテンツデータの中身を空（全削除）にして、ページを再読み込みする */

export const useResetAllFavorite = () => {
    const { setItems } = useContext(ItemsContext);
    const { setCheckItems } = useContext(CheckItemsContext);

    const ResetAllFavorite: () => void = () => {
        const getLocalStorageItems = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) localStorage.removeItem('localSaveBoxes');
        setItems((_prevItems) => []);
        setCheckItems((_prevCheckitems) => []);
        location.reload();
    }

    return { ResetAllFavorite }
}