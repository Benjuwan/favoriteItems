import { memo, FC, ReactNode } from "react";
import styled from "styled-components";
import { useViewDetails } from "../hooks/useViewDetails";

type itemContentType = {
    index: number,
    imgNameSrc?: string,
    children?: ReactNode,
    imgNameViewBool?: boolean
}

export const ItemContent: FC<itemContentType> = memo(({
    imgNameSrc,
    index,
    children,
    imgNameViewBool = false
}) => {
    const dammy___imgSrcPath = (item: string) => `https://via.placeholder.com/640x360/333/fff?text=${item}`;

    const { viewDetails } = useViewDetails();

    return (
        <ItemContents id={`items-${index + 1}`} className="itemContents" onClick={(itemEl) => {
            viewDetails(itemEl.currentTarget, 'OnView');
        }}>
            <>{imgNameViewBool === false ?
                <>{imgNameSrc &&
                    <div className="itemsOrigin" id={`itemsOrigin-${index + 1}`}>
                        <img src={dammy___imgSrcPath(imgNameSrc)} alt={`itemsOrigin-${index + 1}：${imgNameSrc}の画像`} />
                        <div className="hiddenArea">
                            <img src={dammy___imgSrcPath(imgNameSrc)} alt={`itemsOrigin-${index + 1}：${imgNameSrc}の画像`} />
                        </div>
                    </div>
                }</> :
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