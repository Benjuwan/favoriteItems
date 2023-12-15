import { Suspense, memo, useEffect, useContext, useState, useMemo } from "react"
import styled from "styled-components";
import useSWR from "swr"; // npm i swr
import { contentType } from "../ts/contentType";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { LocalSaveCtrl } from "./LocalSaveCtrl";
import { LocalSaveBtn } from "./LocalSaveBtn";
import { FavoriteItemContent } from "./FavoriteItemContent";
import { DefaultItemContent } from "./DefaultItemContent";
import { LoadingEl } from "./LoadingEl";
import { useFetchData } from "../hooks/useFetchData";

/* Suspense の対象コンポーネント */
const SuspenseItems = memo(() => {
    const isHostingMode: boolean = false; // ホスティング時は true に変更
    let fetchDataKey: string = '';
    if (isHostingMode) {
        /* サブディレクトリ（/r0105/favoriteitems）を指定した ver */
        fetchDataKey = `${location.origin}/r0105/favoriteitems/json/contents.json`;
    } else {
        fetchDataKey = `${location.origin}/public/json/contents.json`;
    }

    /* 各種 Context */
    const { isCheckItems } = useContext(CheckItemsContext);

    /* 既存の localStorage データ State */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);

    /* 初回レンダリングの判定有無用の State */
    const [FirstRenderSignal, setFirstRenderSignal] = useState<boolean>(false);

    /* コンテンツデータを取得 */
    const { FetchData } = useFetchData();

    useEffect(() => {
        /* 既存の localStorage データを State に格納 */
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
        }

        setTimeout(() => window.scrollTo(0, 0), 500); // 疑似的な遅延・非同期処理で再読み込み時にスクロールトップする
    }, []);

    /* コンテンツデータを取得して配列（getFetchContentData）に格納 */
    const { data: fetchContents = [] } = useSWR(
        /* 第1引数 key は 第2引数の fetcher 関数の引数として渡される */
        fetchDataKey,
        (urlAsKey) => FetchData(urlAsKey),
        {
            suspense: true
        }
    );
    const [getFetchContentData, setFetchContentData] = useState<contentType[]>([]);
    useEffect(() => setFetchContentData((_prevgetFetchContentData) => fetchContents), [getFetchContentData]); // EffectHook：依存配列は取得したコンテンツデータを格納した配列
    const fetchContentData: contentType[] = useMemo(() => getFetchContentData, [getFetchContentData]); // 変数のメモ化：依存配列は取得したコンテンツデータを格納した配列

    return (
        <ItemEls className="ItemEls">
            {(isCheckItems.length > 0 || isCheckSaveData.length > 0) &&
                <>
                    <LocalSaveCtrl FirstRenderSignal={FirstRenderSignal} setFirstRenderSignal={setFirstRenderSignal} />
                    <FavoriteItemContent FirstRenderSignal={FirstRenderSignal} setFirstRenderSignal={setFirstRenderSignal} />
                    <LocalSaveBtn addFixed />
                </>
            }
            <DefaultItemContent fetchContentData={fetchContentData} />
        </ItemEls>
    );
});

/* Suspense を実行するエクスポート用コンポーネント */
export const Items = () => {
    return (
        <Suspense fallback={<LoadingEl />}>
            <SuspenseItems />
        </Suspense>
    );
}

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

        @media screen and (min-width: 700px) {
            width: 32%;
        }
    }
}
`;