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
    const [isItems, setItems] = useState<string[]>([]);

    return (
        <ItemsContext.Provider value={{ isItems, setItems }}>
            {children}
        </ItemsContext.Provider>
    );
}