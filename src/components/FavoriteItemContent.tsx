import { memo, FC, useEffect } from "react";
import { ItemContent } from "./ItemContent";

import parse from 'html-react-parser';
/**
 * 【html-react-parser】HTML文字列をReact要素に変換するツール
 * https://www.npmjs.com/package/html-react-parser
 * 
 * npm i html-react-parser
 * 
 * 参考サイト：https://www.engilaboo.com/react-html-parse/
*/

type favoriteItemContentType = {
    localSaveBoxes: string[];
    isItems: string[];
    setCheckItems: React.Dispatch<React.SetStateAction<string[]>>;
}

export const FavoriteItemContent: FC<favoriteItemContentType> = memo(({ localSaveBoxes, isItems, setCheckItems }) => {
    const _localSaved = (localSaveStr: string, localSaveBoxes: string[]) => {
        const newSetLocalSaveBoxes = Array.from(new Set([...localSaveBoxes]));
        console.log(localSaveBoxes, newSetLocalSaveBoxes);
        localStorage.setItem(localSaveStr, JSON.stringify(newSetLocalSaveBoxes));
    }

    const _selectCheckedItems = (SaveDateItems: string[]) => {
        const shallowCopy: string[] = [...SaveDateItems];
        const selectCheckedItems = shallowCopy.map(SaveDateItem => {
            const getTargetImgNumbers: string = getTargetImgNum(SaveDateItem, 'itemsOrigin');
            return getTargetImgNumbers;
        });
        setCheckItems((_prevCheckitems) => selectCheckedItems);

        /* setTimeout による（タスクキューの）疑似的な遅延・非同期処理 */
        setTimeout(() => {
            const items: NodeListOf<HTMLDivElement> = document.querySelectorAll('.defaults .items');
            items.forEach(item => {
                const itemImgAltTxt: string | null | undefined = item.querySelector('img')?.getAttribute('alt');
                selectCheckedItems.forEach(selectCheckedItem => {
                    if (itemImgAltTxt?.match(selectCheckedItem)) {
                        const itemsOrigin: HTMLDivElement | null = item.querySelector('.itemsOrigin');
                        if (itemsOrigin !== null) {
                            const shallowCopy = [...localSaveBoxes];
                            localSaveBoxes.push(...shallowCopy, itemsOrigin?.innerHTML);
                            _localSaved('localSaveBoxes', localSaveBoxes);
                        }

                        /* 既存のお気に入りアイテムのキープを行いたい場合 */
                        const itemTargetInputEl = item.querySelector('input[type="checkbox"]');
                        itemTargetInputEl?.setAttribute('checked', 'true');
                    }
                });
            });
        }, 1);
    }

    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            _selectCheckedItems(SaveDateItems);
        }
    }, []);

    const getTargetImgNum = (
        item: string,
        prefix: string
    ) => {
        const targetNumber = item.split('itemsOrigin-')[1].split('">')[0];
        return `${prefix}-${targetNumber}`;
    }

    const removeItems = (item: string) => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            localSaveBoxes = SaveDateItems?.filter(isItem => !isItem.match(item));
            _localSaved('localSaveBoxes', localSaveBoxes);
        }
    }

    return (
        <div className="itemsWrapper favorites">
            {isItems?.map((item, i) => (
                <div className="items favorites" key={i}>
                    <ItemContent index={i} imgNameViewBool={true}>
                        {parse(item)}
                        <p>{getTargetImgNum(item, 'items')}の画像</p>
                        <button className="removeItems" onClick={(btnEl) => {
                            btnEl.stopPropagation(); // 親要素の click イベント（viewDetails）の実行防止
                            removeItems(getTargetImgNum(item, 'itemsOrigin'));
                        }}>お気に入り解除</button>
                    </ItemContent>
                </div>
            ))}
        </div>
    );
});