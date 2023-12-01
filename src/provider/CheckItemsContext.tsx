import { createContext, FC, ReactNode, useState } from "react"

type defaultType = {
    isCheckItems: string[];
    setCheckItems: React.Dispatch<React.SetStateAction<string[]>>;
}
export const CheckItemsContext = createContext({} as defaultType);

type defaultContext = {
    children: ReactNode
}
export const CheckItemsFragment: FC<defaultContext> = ({ children }) => {
    const [isCheckItems, setCheckItems] = useState<string[]>([]); // チェック（選択）されたコンテンツのナンバー（及び画像の altテキスト）を管理する配列 State

    return (
        <CheckItemsContext.Provider value={{ isCheckItems, setCheckItems }}>
            {children}
        </CheckItemsContext.Provider>
    );
}