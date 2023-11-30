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
        location.reload();
    }

    return { ResetAllFavorite }
}