import { FC, memo } from "react";
import { contentType } from "../ts/contentType";
import { ItemContent } from "./ItemContent";
import { CheckBox } from "./CheckBox";

type defaultItemContentType = {
    fetchContentData: contentType[];
}

export const DefaultItemContent: FC<defaultItemContentType> = memo(({ fetchContentData }) => {
    return (
        <div className="itemsWrapper defaultWrapper">
            <p id="explainTxt">各アイテムのラベルをクリックするとお気に入り登録できます。</p>
            {fetchContentData.map((fetchContenetEl, i) => (
                <div className="items" key={i}>
                    <ItemContent index={i} fetchContenetEl={fetchContenetEl} />
                    <CheckBox index={i} imgNameSrc={fetchContenetEl.contentName} />
                </div>
            ))}
        </div>
    );
});