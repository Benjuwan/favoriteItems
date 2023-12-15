import { memo, FC, ReactNode } from "react";
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

import { contentType } from "../ts/contentType";
import { useViewDetails } from "../hooks/useViewDetails";

type itemContentType = {
    index: number;
    fetchContenetEl?: contentType;
    children?: ReactNode;
}

export const ItemContent: FC<itemContentType> = memo(({
    index,
    fetchContenetEl,
    children
}) => {
    const imgSrc_Prefix: string = 'img-'; // img 画像ファイル名の接頭辞

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

    /* 画像クリックでのモーダル表示 */
    const { viewDetails } = useViewDetails();

    /**
     * items- や itemsOrigin などのワードは各種カスタムフックで使用しているので変更時は注意
    */
    return (
        <ItemContents id={`items-${index + 1}`} className="itemContents" onClick={(itemEl) => {
            viewDetails(itemEl.currentTarget, 'OnView');
        }}>
            <>{fetchContenetEl ?
                <div className="itemsOrigin" id={`itemsOrigin-${index + 1}`}>
                    <p className="thumbnails"><img src={setImgSrcPath(`${imgSrc_Prefix}${fetchContenetEl.contentNumber}`)} alt={`itemsOrigin-${index + 1}：${fetchContenetEl.contentName}の画像`} /></p>
                    <div className="hiddenArea">
                        <div className="hiddenAreaContent">
                            <img src={setImgSrcPath(`${imgSrc_Prefix}${fetchContenetEl.contentNumber}`)} alt={`itemsOrigin-${index + 1}：${fetchContenetEl.contentName}の画像`} />
                            {fetchContenetEl.contentDetails &&
                                <div className="contentDetails">
                                    <p>{fetchContenetEl.contentDetails}</p>
                                </div>
                            }
                            {fetchContenetEl.contentMovie &&
                                <div className="movieEls">{parse(fetchContenetEl.contentMovie)}</div>
                            }
                        </div>
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
        overflow-x: scroll;
        /* z-index: 9; */

        & .hiddenAreaContent {
            color: #333;
            padding: 2em;
            width: clamp(16rem, 100%, 64rem);
            
            @media screen and (min-width: 1025px) {
                padding: 0;
                width: clamp(640px, calc(100vw/2), 960px);
            }

            & .contentDetails {
                line-height: 1.8;
                padding: 1em;
                background-color: #fff;
                border-radius: 4px;
                margin: 1em auto;
            }

            & .movieEls{
                & iframe {
                    width: 100%;
                    height: auto;
                    aspect-ratio: 16 / 9;
                    margin: 1em auto;
                }
            }
        }
    }

&.OnView{
    & .hiddenArea{
        visibility: visible;
        opacity: 1;
    }
}
`;