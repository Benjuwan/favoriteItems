import { createContext, FC, ReactNode, useState } from "react"

type defaultType = {
    isImgNameSrc: string[];
    setImgNameSrc: React.Dispatch<React.SetStateAction<string[]>>;
}
export const ImgNameContext = createContext({} as defaultType);

type defaultContext = {
    children: ReactNode
}
export const ImgNameFragment: FC<defaultContext> = ({ children }) => {
    const [isImgNameSrc, setImgNameSrc] = useState<string[]>([]);

    return (
        <ImgNameContext.Provider value={{ isImgNameSrc, setImgNameSrc }}>
            {children}
        </ImgNameContext.Provider>
    );
}