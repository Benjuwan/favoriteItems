import { useContext } from "react";
import { ItemsContext } from "../provider/ItemsContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";

export const useResetAllFavorite = () => {
    const { setItems } = useContext(ItemsContext);
    const { setCheckItems } = useContext(CheckItemsContext);

    const ResetAllFavorite = () => {
        const getLocalStorageItems = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) localStorage.removeItem('localSaveBoxes');
        setItems((_prevItems) => []);

        setCheckItems((_prevCheckitems) => []);

        /* setTimeout による（タスクキューの）疑似的な遅延・非同期処理 */
        setTimeout(() => {
            const checkedItems: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
            checkedItems.forEach(checkedItem => {
                if (checkedItem.hasAttribute('checked')) checkedItem.removeAttribute('checked');
            });
        }, 1);
    }

    return { ResetAllFavorite }
}