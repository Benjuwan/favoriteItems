import { memo } from "react";
import styled from "styled-components";

export const FirtsViewArea = memo(() => {
    return (
        <FirstViewAreaEl>
            <h1>favorite items<span>- 好きなアイテムのお気に入り登録 -</span></h1>
            <div className="txtBox">
                <p>サービス提供側が用意したコンテンツ（情報）を閲覧ユーザーのブラウザに記録できます。</p>
                <ol>
                    <li>ユーザーが気になったコンテンツのラベルをクリックすることでお気に入り登録が行えます。</li>
                    <li>登録解除はコンテンツの「お気に入り解除」ボタン、または登録済みコンテンツ（色付きのもの）のラベルを再クリックで行えます。</li>
                    <li>「お気に入りをリセット」ボタンをクリックすると全件解除されます。</li>
                </ol>
            </div>
        </FirstViewAreaEl>
    );
});

const FirstViewAreaEl = styled.section`
line-height: 1.8;
background-color: #eaeaea;
box-shadow: 0 0 8px rgba(0,0,0,.25);
border-radius: 4px;
padding: 1em;
margin-bottom: 16rem;

& h1 {
    text-align: center;
    font-weight: normal;
    font-size: 2.4rem;
    margin-bottom: 1em;

    & span {
        display: block;
        font-size: 1.4rem;
    }
}

& ol {
    margin-top: 2.5em;
    padding-left: 1em;

    & li {
        &:not(:last-of-type){
            margin-bottom: 1em;
        }
    }
}

@media screen and (min-width: 1025px) {
    margin-bottom: 160px;

    & h1 {
        font-size: 24px;

        & span {
            font-size: 14px;
        }
    }
}
`;