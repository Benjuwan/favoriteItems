import { memo, useContext } from "react";
import { ImgNameContext } from "../provider/ImgNameSrcContext";
import { ItemContent } from "./ItemContent";
import { CheckBox } from "./CheckBox";

export const DefaultItemContent = memo(() => {
    const { isImgNameSrc } = useContext(ImgNameContext);

    return (
        <div className="itemsWrapper defaultWrapper">
            <p id="explainTxt">各アイテムのラベルをクリックするとお気に入り登録できます。</p>
            {isImgNameSrc.map((imgNameSrc, i) => (
                <div className="items" key={i}>
                    <ItemContent index={i} imgNameSrc={imgNameSrc} />
                    <CheckBox index={i} imgNameSrc={imgNameSrc} />
                </div>
            ))}
        </div>
    );
});