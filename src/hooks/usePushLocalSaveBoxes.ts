import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";

export const usePushLocalSaveBoxes = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext);

    const _pushLocalSaveBoxes = (specificEl: string | string[]) => {
        if (typeof specificEl !== "string") {
            localSaveBoxes.push(...specificEl);
        } else {
            localSaveBoxes.push(specificEl);
        }
    }

    return { _pushLocalSaveBoxes }
}