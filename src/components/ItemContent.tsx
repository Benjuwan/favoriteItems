import { memo, FC, ReactNode, useContext } from "react";
import styled from "styled-components";
import { ImgNameContext } from "../provider/ImgNameSrcContext";
import { useViewDetails } from "../hooks/useViewDetails";

type itemContentType = {
    index: number;
    fetchContenetName?: string;
    children?: ReactNode;
}

export const ItemContent: FC<itemContentType> = memo(({
    fetchContenetName,
    index,
    children
}) => {
    const { isImgNameSrc } = useContext(ImgNameContext);

    const isHostingMode: boolean = false; // ホスティング時は true に変更
    const setImgSrcPath = (imgNameSrc: string | undefined) => {
        if (imgNameSrc === undefined) return; // SWR の非同期処理で undefined.jpg （undefined の画像が一つ生まれてしまうので当該条件の場合は早期終了して処理をスキップ）

        if (isHostingMode) {
            /* サブディレクトリ（/r0105/favoriteitems）を指定した ver */
            return `${location.origin}/r0105/favoriteitems/imges/${imgNameSrc}.jpg`;
        } else {
            return `${location.origin}/public/imges/${imgNameSrc}.jpg`;
        }
    }

    const { viewDetails } = useViewDetails();

    /**
     * items- や itemsOrigin などのワードは各種カスタムフックで使用しているので変更時は注意
    */
    return (
        <ItemContents id={`items-${index + 1}`} className="itemContents" onClick={(itemEl) => {
            viewDetails(itemEl.currentTarget, 'OnView');
        }}>
            <>{fetchContenetName ?
                <div className="itemsOrigin" id={`itemsOrigin-${index + 1}`}>
                    <p className="thumbnails"><img src={setImgSrcPath(isImgNameSrc[index])} alt={`itemsOrigin-${index + 1}：${fetchContenetName}の画像`} /></p>
                    <div className="hiddenArea">
                        <img src={setImgSrcPath(isImgNameSrc[index])} alt={`itemsOrigin-${index + 1}：${fetchContenetName}の画像`} />
                    </div>
                </div> :
                <>{children}</>
            }</>
        </ItemContents>
    );
});

const ItemContents = styled.div`
    & .hiddenArea{
        position: fixed;
        width: 100%;
        height: 100%;
        margin: auto;
        inset: 0;
        display: grid;
        place-items: center;
        padding: 1em;
        background-color: rgba(0,0,0,.85);
        visibility: hidden;
        opacity: 0;
        transition: all .25s;
        /* z-index: 9; */

        & img {
            width: clamp(160px, 100%, 640px);
        }
    }

&.OnView{
    & .hiddenArea{
        visibility: visible;
        opacity: 1;
    }
}
`;