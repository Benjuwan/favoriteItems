import { createContext, FC, ReactNode, useState } from "react"

type defaultType = {
    localSaveBoxes: string[];
}
export const LocalStorageContext = createContext({} as defaultType);

type defaultContext = {
    children: ReactNode
}
export const LocalStorageFragment: FC<defaultContext> = ({ children }) => {
    const [localSaveBoxes] = useState<string[]>([]); // LocalStorage 用のグローバル変数

    return (
        <LocalStorageContext.Provider value={{ localSaveBoxes }}>
            {children}
        </LocalStorageContext.Provider>
    );
}