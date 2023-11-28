import { memo, useState, useEffect } from "react"
import styled from "styled-components";
import parse from 'html-react-parser';
/**
 * 【html-react-parser】HTML文字列をReact要素に変換するツール
 * https://www.npmjs.com/package/html-react-parser
 * 
 * npm i html-react-parser
 * 
 * 参考サイト：https://www.engilaboo.com/react-html-parse/
*/

import { ItemContent } from "./ItemContent";
import { CheckBox } from "./CheckBox";
import { useCreateImgNameSrc } from "../hooks/useCreateImgNameSrc";

export const Items = memo(() => {
    const dammy___txtForImgesAry = () => {
        const txtElement = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
        return txtElement.split(' ');
    }

    const [isImgNameSrc, setImgNameSrc] = useState<string[]>([]);
    const [isCheckItems, setCheckItems] = useState<string[]>([]);
    const [isItems, setItems] = useState<string[]>([]);

    const { createImgNameSrc } = useCreateImgNameSrc();
    useEffect(() => {
        const imgFileNames: string[] = dammy___txtForImgesAry();
        createImgNameSrc(15, imgFileNames, isImgNameSrc, setImgNameSrc);
    }, []);

    /* localStorage 関連 */
    let localSaveBoxes: string[] = []; // localStorage 用のグローバル変数

    const _localSaved = (localSaveStr: string, localSaveBoxes: string[]) => {
        const newSetLocalSaveBoxes = Array.from(new Set([...localSaveBoxes]));
        // console.log(localSaveBoxes, newSetLocalSaveBoxes);
        localStorage.setItem(localSaveStr, JSON.stringify(newSetLocalSaveBoxes));
        setItems((_prevItems) => newSetLocalSaveBoxes);
    }

    const _getSpecificItems = (targetAry: string[]) => {
        const itemContents: NodeListOf<HTMLDivElement> = document.querySelectorAll('.itemsOrigin');
        targetAry.forEach(targetEl => {
            itemContents.forEach(itemContent => {
                const targetElId = targetEl.split('item-')[1];
                const itemOriginItemId: string | undefined = itemContent.getAttribute('id')?.split('itemsOrigin-')[1];

                if (targetElId === itemOriginItemId) {
                    const strItemContent: string = String(itemContent.innerHTML);
                    // console.log(itemContent, strItemContent);
                    const shallowCopy = [...localSaveBoxes];
                    localSaveBoxes.push(...shallowCopy, strItemContent);
                }
            });
        });
    }

    const localDataSave = () => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            if (SaveDateItems.length > 0) {
                const currCheckedItems = SaveDateItems.map(item => getTargetImgNum(item, 'item'));
                const notSameItems = isCheckItems.filter(checkItem => {
                    return currCheckedItems.filter(currCheckedItem => checkItem !== currCheckedItem);
                });
                // console.log(notSameItems);
                _getSpecificItems(notSameItems);
                _localSaved('localSaveBoxes', localSaveBoxes);
            } else {
                _getSpecificItems(isCheckItems);
                _localSaved('localSaveBoxes', localSaveBoxes);
            }
        }

        else {
            _getSpecificItems(isCheckItems);
            _localSaved('localSaveBoxes', localSaveBoxes);
        }
    }

    const resetAllFavorite = () => {
        const checkedItems: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        checkedItems.forEach(checkedItem => {
            if (checkedItem.hasAttribute('checked')) checkedItem.removeAttribute('checked');
        });

        const getLocalStorageItems = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) localStorage.removeItem('localSaveBoxes');
        setItems((_prevItems) => []);
    }

    const _selectCheckedItems = (SaveDateItems: string[]) => {
        const selectCheckedItems = SaveDateItems.map(SaveDateItem => {
            return getTargetImgNum(SaveDateItem, 'itemsOrigin');
        });
        // console.log(selectCheckedItems);
        setCheckItems((_prevCheckitems) => selectCheckedItems);

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

        // checked true のものを isItems に入れる
        const checkedItems: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        if (checkedItems.length > 0) {
            checkedItems.forEach(checkedItem => {
                console.log(checkedItem);
                const parentEl: HTMLDivElement | null = checkedItem.closest('.items');
                const itemsOriginContent: string | undefined = parentEl?.querySelector('.itemsOrigin')?.innerHTML;
                console.log(itemsOriginContent);
                if (typeof itemsOriginContent !== "undefined") {
                    setItems((_prevItems) => [...isItems, itemsOriginContent]);
                }
            });
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
    // console.log(isItems);
    /* localStorage 関連 */

    return (
        <ItemEls className="ItemEls">
            {(isCheckItems.length > 0 || isItems.length > 0) &&
                <>
                    <div className="localSaveInfos">
                        <p>現在のお気に入りは「{isCheckItems.join(', ')}」です。</p>
                        <button type="button" className="localDataSave" onClick={localDataSave}>お気に入りを表示</button>
                        <button type="button" className="resetAllFavorite" disabled={isItems.length <= 0} onClick={resetAllFavorite}>お気に入りをリセット</button>
                    </div>
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
                </>
            }
            <div className="itemsWrapper defaults">
                {isImgNameSrc.map((imgNameSrc, i) => (
                    <div className="items" key={i}>
                        <ItemContent imgNameSrc={imgNameSrc} index={i} />
                        <CheckBox index={i} isCheckItems={isCheckItems} setCheckItems={setCheckItems} />
                    </div>
                ))}
            </div>
        </ItemEls>
    );
});

const ItemEls = styled.div`
font-size: 1.4rem;
padding: 0 2.5em;
@media screen and (min-width: 1025px) {
    padding: 0;
    font-size: 14px;
}

& .localSaveInfos {
    padding-bottom: 1em;
    display: flex;
    flex-flow: row wrap;
    gap: 2%;

    & p {
        width: 100%;
        line-height: 1.8;
    }
}

& button {
    appearance: none;
    cursor: pointer;
    background-color: #333;
    color: #fff;
    border: 1px solid transparent;
    border-radius: 4px;

    &[disabled] {
        cursor: default;
        background-color: #eaeaea;
        color: #dadada;
    }

    &:not([disabled]):hover {
        border-color: #333;
        color: #333;
        background-color: #fff;
    }

    /* &.localDataSave {
        background-color: #0a2aa9;
    }

    &.removeItems,
    &.resetAllFavorite {
        background-color: #a90a0a;
    } */
}

& .itemsWrapper {
    display: flex;
    flex-flow: row wrap;
    gap: 2%;

    &.favoriteWrapper {
        border-bottom: 1px dotted #333;
        margin-bottom: 5em;
    }

    & .items {
        width: 48%;
        margin-bottom: 2%;
        line-height: 1.8;

        @media screen and (min-width: 700px) {
            width: 32%;
        }

        & img {
            display: block;
        }
    }
}
`;