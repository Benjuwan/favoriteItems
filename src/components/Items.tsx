import { memo, useEffect, useContext, useState } from "react"
import styled from "styled-components";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { LocalSaveCtrl } from "./LocalSaveCtrl";
import { FavoriteItemContent } from "./FavoriteItemContent";
import { DefaultItemContent } from "./DefaultItemContent";
import { useCreateImgNameSrc } from "../hooks/useCreateImgNameSrc";

export const Items = memo(() => {
    const dammy___txtForImgesAry = () => {
        const txtElement = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
        return txtElement.split(' ');
    }

    const { isCheckItems } = useContext(CheckItemsContext);

    /* 既存の localStorage データ State */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);

    /* 初回レンダリングの判定有無用の State */
    const [FirstRenderSignal, setFirstRenderSignal] = useState<boolean>(false);

    const { createImgNameSrc } = useCreateImgNameSrc();
    useEffect(() => {
        /* dammy___txtForImgesAry メソッドを通じてダミー画像を生成 */
        const imgFileNames: string[] = dammy___txtForImgesAry();
        createImgNameSrc(15, imgFileNames);
        // createImgNameSrc_alt(65); // 引数には用意した画像の枚数を指定

        /* 既存の localStorage データを State に格納 */
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
        }

        setTimeout(() => window.scrollTo(0, 0), 500); // 疑似的な遅延・非同期処理で再読み込み時にスクロールトップする
    }, []);

    return (
        <ItemEls className="ItemEls">
            {(isCheckItems.length > 0 || isCheckSaveData.length > 0) &&
                <>
                    <LocalSaveCtrl FirstRenderSignal={FirstRenderSignal} setFirstRenderSignal={setFirstRenderSignal} />
                    <FavoriteItemContent FirstRenderSignal={FirstRenderSignal} setFirstRenderSignal={setFirstRenderSignal} />
                </>
            }
            <DefaultItemContent />
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
    min-height: 4.4rem;
    margin-bottom: .5em;
    
    @media screen and (min-width: 1025px) {
        min-height: 44px;
        margin-bottom: 0;
    }

    &.localDataSave {
        background-color: #0a2aa9;
    }

    &.removeItems,
    &.resetAllFavorite {
        background-color: #a90a0a;
    }

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
}

& .itemsWrapper {
    display: flex;
    flex-flow: row wrap;
    gap: 2%;

    & #explainTxt {
        width: 100%;
        margin-bottom: .5em;
    }

    &.favoriteWrapper {
        border-bottom: 1px dotted #333;
        margin-bottom: 5em;
    }

    & .items {
        width: 48%;
        margin-bottom: 2%;
        line-height: 1.8;
        padding: .5em;
        border-radius: 4px;
        background-color: #eaeaea;

        &.checkedContent {
            color: #fff;
            background-color: #666666;
        }

        & img {
            display: block;
        }

        & .thumbnails {
            overflow: hidden;

            & img {
                cursor: pointer;
                transition: transform .25s;
                
                &:hover {
                    transform: scale(1.1);
                }
            }
        }

        & label {
            cursor: pointer;
            line-height: 2;
            
            &:hover {
                font-weight: bold;
            }

            & input[type="checkbox"] {
                appearance: none;
                border-radius: 0;
                border: 1px solid transparent;
                background-color: transparent;

                &[checked] {
                    appearance: auto;
                }
            }
        }

        @media screen and (min-width: 700px) {
            width: 32%;
        }
    }
}
`;