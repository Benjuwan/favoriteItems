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

    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);

    const { createImgNameSrc } = useCreateImgNameSrc();
    useEffect(() => {
        const imgFileNames: string[] = dammy___txtForImgesAry();
        createImgNameSrc(15, imgFileNames);

        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
        }
    }, []);

    return (
        <ItemEls className="ItemEls">
            {(isCheckItems.length > 0 || isCheckSaveData.length > 0) &&
                <>
                    <LocalSaveCtrl />
                    <FavoriteItemContent />
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