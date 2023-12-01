import { memo, useContext } from "react";
import { ImgNameContext } from "../provider/ImgNameSrcContext";
import { ItemContent } from "./ItemContent";
import { CheckBox } from "./CheckBox";

export const DefaultItemContent = memo(() => {
    const { isImgNameSrc } = useContext(ImgNameContext);

    return (
        <div className="itemsWrapper defaultWrapper">
            {isImgNameSrc.map((imgNameSrc, i) => (
                <div className="items" key={i}>
                    <ItemContent imgNameSrc={imgNameSrc} index={i} />
                    <CheckBox index={i} />
                </div>
            ))}
        </div>
    );
});