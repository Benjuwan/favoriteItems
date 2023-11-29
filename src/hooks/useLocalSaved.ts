import { useContext } from "react";
import { ItemsContext } from "../provider/ItemsContext";

export const useLocalSaved = () => {
    const { setItems } = useContext(ItemsContext);

    const _localSaved = (
        localSaveStr: string,
        localSaveBoxes: string[]
    ) => {
        const newSetLocalSaveBoxes = Array.from(new Set([...localSaveBoxes]));
        // console.log(localSaveBoxes, newSetLocalSaveBoxes);
        localStorage.setItem(localSaveStr, JSON.stringify(newSetLocalSaveBoxes));
        setItems((_prevItems) => newSetLocalSaveBoxes);
    }

    return { _localSaved }
}