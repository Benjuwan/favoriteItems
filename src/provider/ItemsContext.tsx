import { createContext, FC, ReactNode, useState } from "react"

type defaultType = {
    isItems: string[];
    setItems: React.Dispatch<React.SetStateAction<string[]>>;
}
export const ItemsContext = createContext({} as defaultType);

type defaultContext = {
    children: ReactNode
}
export const ItemsFragment: FC<defaultContext> = ({ children }) => {
    const [isItems, setItems] = useState<string[]>([]); // 登録（予定）コンテンツの中身（.itemsOrigin の中身）を管理する配列 State

    return (
        <ItemsContext.Provider value={{ isItems, setItems }}>
            {children}
        </ItemsContext.Provider>
    );
}