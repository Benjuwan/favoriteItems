# favoriteItems
- 20231125 - 20231130

## 概要 
`localstorage`を使ったお気に入りアイテム（画像）の登録機能

## FixTo
- 2023/12/01：対処 ~~削除と追加が同時に行えない（`localstorage`から削除した内容が更新時に復活してしまう）~~ <br />
既存の`localstorage`データをグローバル State で取り回して、使用する各コンポーネントで既存の`localstorage`データを個別の State に格納して使用（コンポーネント内で調整・加工して新たに`localstorage`データにセット）する。

```
/* 既存の localStorage データを State に格納 */
const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
useEffect(() => {
    const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
    if (getLocalStorageItems !== null) {
        const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
        setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
    }
}, [isCheckItems]); // localStorage データの「更新シグナル」にしたい値（State）を依存配列に指定

// isCheckSaveData を取り回して使用する
```

- 2023/12/01：対処 ~~選択中のコンテンツ（既存の`localStorage`データ）が無くなった場合のリセット処理の不具合~~ <br />
初回レンダリングを判定するための bool State を用意して、それと`isCheckSaveData`（既存の localStorage データ State）の配列数を条件にしたリセット処理実行に調整

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