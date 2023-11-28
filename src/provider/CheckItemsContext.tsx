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
    const [isCheckItems, setCheckItems] = useState<string[]>([]);

    return (
        <CheckItemsContext.Provider value={{ isCheckItems, setCheckItems }}>
            {children}
        </CheckItemsContext.Provider>
    );
}