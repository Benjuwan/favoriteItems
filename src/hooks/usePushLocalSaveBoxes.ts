import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";

/* 当該コンテンツまたは配列の中身（.itemsOrigin の中身）を localstorage の配列に格納 */

export const usePushLocalSaveBoxes = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext);

    const _pushLocalSaveBoxes: (specificEl: string | string[]) => void = (specificEl: string | string[]) => {
        if (typeof specificEl !== "string") {
            localSaveBoxes.push(...specificEl);
        } else {
            localSaveBoxes.push(specificEl);
        }
    }

    return { _pushLocalSaveBoxes }
}