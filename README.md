# favoriteItems
- 20231125 - 20231130

## 概要 
`localstorage`を使ったお気に入りアイテム（画像）の登録機能

## FixTo
- 削除と追加が同時に行えない（`localstorage`から削除した内容が更新時に復活してしまう）

## ChatGPT
- `filter`メソッドの取扱方について質問
    - 元コード

    ```
    const hoge = [...isImgNameSrc].filter(item => {
        return [...favoriteItemAltTxt].some(favoriteItem => {
            if (!item.match(favoriteItem)) {
                return item;
            }
        });
    });
    ```

    - ChatGPT の解答
    > filter メソッドは、与えられた関数が true を返す要素だけを新しい配列に含めるメソッドです。今回のコードでは、[ ...isImgNameSrc ] 配列の各要素に対して、内側の filter が適用されています。しかし、内側の filter では return される値が配列であり、その配列自体が true もしくは false ではないため、外側の filter が正しく機能していませんでした。
    > some メソッドは、与えられた関数が一度でも true を返せば、それ以降の要素のチェックを停止します。これにより、一致する要素が見つかった時点で処理を終了し、外側の filter が正しく動作します

    ```
    const hoge = [...isImgNameSrc].filter(item => {
        return ![...favoriteItemAltTxt].some(favoriteItem => item.match(favoriteItem));
    });
    ```