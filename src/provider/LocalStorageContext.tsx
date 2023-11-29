import { createContext, FC, ReactNode, useState } from "react"

type defaultType = {
    localSaveBoxes: string[];
    checkedLists: string[];
}
export const LocalStorageContext = createContext({} as defaultType);

type defaultContext = {
    children: ReactNode
}
export const LocalStorageFragment: FC<defaultContext> = ({ children }) => {
    let [localSaveBoxes] = useState<string[]>([]); // LocalStorage 用のグローバル変数
    let [checkedLists] = useState<string[]>([]); // checked True の input 要素の ID属性名

    return (
        <LocalStorageContext.Provider value={{ localSaveBoxes, checkedLists }}>
            {children}
        </LocalStorageContext.Provider>
    );
}