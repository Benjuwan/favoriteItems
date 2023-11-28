import { useContext } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";

export const usePushLocalSaveBoxes = () => {
    const { localSaveBoxes } = useContext(LocalStorageContext);

    const _pushLocalSaveBoxes = (specificEl: string | string[]) => {
        const shallowCopy = [...localSaveBoxes];
        if (typeof specificEl !== "string") {
            localSaveBoxes.push(...shallowCopy, ...specificEl);
        } else {
            localSaveBoxes.push(...shallowCopy, specificEl);
        }
    }

    return { _pushLocalSaveBoxes }
}