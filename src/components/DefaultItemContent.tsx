import { FC, memo } from "react";
import { ItemContent } from "./ItemContent";
import { CheckBox } from "./CheckBox";
import { contentType } from "../ts/contentType";

type defaultItemContentType = {
    fetchContentData: contentType[];
}

export const DefaultItemContent: FC<defaultItemContentType> = memo(({ fetchContentData }) => {
    return (
        <div className="itemsWrapper defaultWrapper">
            <p id="explainTxt">各アイテムのラベルをクリックするとお気に入り登録できます。</p>
            {fetchContentData.map((fetchContenetEl, i) => (
                <div className="items" key={i}>
                    <ItemContent index={i} fetchContenetName={fetchContenetEl.contentName} />
                    <CheckBox index={i} imgNameSrc={fetchContenetEl.contentName} />
                </div>
            ))}
        </div>
    );
});