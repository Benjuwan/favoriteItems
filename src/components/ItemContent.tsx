import { memo, FC, ReactNode } from "react";
import styled from "styled-components";
import { useViewDetails } from "../hooks/useViewDetails";

type itemContentType = {
    index: number;
    imgNameSrc?: string;
    children?: ReactNode;
}

export const ItemContent: FC<itemContentType> = memo(({
    imgNameSrc,
    index,
    children
}) => {
    const createImgNameSrc_alt: boolean = false; // 用意した画像を使用する場合は true に変更
    const setImgSrcPath = (imgNameSrc: string) => {
        if (createImgNameSrc_alt) {
            /* 本環境（デプロイ）時は /public を取る */
            return `${location.origin}/public/imges/${imgNameSrc}.jpg`;
            // return `${location.origin}/r0105/favoriteitems/imges/${imgNameSrc}.jpg`;
        } else {
            return `https://via.placeholder.com/640x360/333/fff?text=${imgNameSrc}`;
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
            <>{imgNameSrc ?
                <div className="itemsOrigin" id={`itemsOrigin-${index + 1}`}>
                    <p className="thumbnails"><img src={setImgSrcPath(imgNameSrc)} alt={`itemsOrigin-${index + 1}：${imgNameSrc}の画像`} /></p>
                    <div className="hiddenArea">
                        <img src={setImgSrcPath(imgNameSrc)} alt={`itemsOrigin-${index + 1}：${imgNameSrc}の画像`} />
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