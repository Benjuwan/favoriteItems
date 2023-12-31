# favoriteItems
- 制作期間：20231125 - 20231202

- 公開サイト：https://k2webservice.xsrv.jp/r0105/favoriteitems/

## 概要 
`localstorage`を使ったお気に入りアイテム（画像）の登録機能<br />

- コンテンツ情報と画像の用意<br />
`public/json/contents.json`の`contents.json`がコンテンツ情報（コンテンツ名、画像のナンバリング、詳細情報、YouTube 動画）を記載したファイル（デフォルト65件）です。<br />親階層`public`の静的アセットディレクトリに`imges`ディレクトリと画像（※ 画像数は`contents.json`記載のコンテンツ数と同じに）を用意することで使用できます。

- 画像ファイル名の調整<br />
画像ファイル名はデフォルトでは`img-xxx`という表記です。必要に応じて以下の調整を行ってください。<br />調整箇所は、`public/json/contents.json`の`contentNumber`（画像ファイルのナンバリングを管理する数値）と、`ItemContent.tsx`の`imgSrc_Prefix`変数（ファイル名の接頭辞を指定する文字列）です。つまり、デフォルトの`img-xxx`は`img-（imgSrc_Prefix）`と`xxx（contentNumber）`が結合した形になります。

- 詳細情報（`contentDetails`）での`HTML`使用<br />
[`html-react-parser`](https://www.npmjs.com/package/html-react-parser)を使用しているため`contents.json`内の`contentDetails`の値には`HTML`を使用できます。

- YouTube 動画の掲載<br />
`contents.json`内の`contentMovie`の値に`iframe`（YouTube 動画の`共有`から取得できる内容）を貼り付けてください。`width`属性・`height`属性は`CSS`で制御しているため削除し、各種属性値のダブルクォート（`""`）はシングルクォート（`''`）に変更してください。

- ホスティング時の注意<br />
1：`Items.tsx`と`ItemContent.tsx`の`isHostingMode`変数を`true`に切り替える。<br />
2：注意事項の項目に記載されている`vite.config.ts`の設定を変更。

## 注意事項
- `vite.config.ts`の設定
ホスティング先の都合上`vite.config.ts`でサブディレクトリを指定しているので、`vite.config.ts`内の下記記述を削除（またはコメントアウトで無効化）してください。

```
base: '/r0105/favoriteitems',
```

## LocalStorage
`Google Dev Tool`の`Application` - `Storage` - `Local Storage`で自身のユーザーエージェント（クライアント：サイト閲覧時のブラウザ）に保存されている`localStorage`データの確認・編集が可能

- 本ファイルで使用している`localStorage`データ名は`localSaveBoxes`です。

## 調整不足 ~~（仕様）~~
- 2023/12/15 修正 ~~チェックボックスの挙動~~<br />
~~`React`の`state`管理ではなく、`JavaScript`の`setAttribute`,`removeAttribute`メソッドで`checked`の付与・解除を行っているせいか「実挙動と見た目で差異（1）」がある（1：お気に入り登録済みコンテンツのラベルクリックで削除後に、もう一度同じコンテンツを登録しようと **クリックした際にチェックマークが付かない**）<br />分かりづらい（UXが悪い）のでチェックマークをアイコンか何かに変更する予定？<br />取り急ぎ`Items.tsx`で`input`要素のスタイル（CSS）を調整して応急処置。~~
 
```
/* 修正前：effectHook と StateHook を用いた方法 */
const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
useEffect(() => {
    const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
    if (getLocalStorageItems !== null) {
        const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
        setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
    }
}, [isCheckItems]);

/* 修正後：let：再定義可能な変数として（データの編集作業が行われた）localStorage データを取り回す */
let mutableLocalStorageData: string[] = [];
const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
if (getLocalStorageItems !== null) mutableLocalStorageData = JSON.parse(getLocalStorageItems);
```

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
初回レンダリングを判定するための bool State を用意して、それと`isCheckSaveData`（既存の`localStorage`データ State）の配列数を条件にしたリセット処理実行に調整

- 2023/12/01：対処 ~~チェックボックスによるコンテンツの削除（お気に入り登録の取り消し）~~ <br />
お気に入り登録済みコンテンツ（既存の`localStorage`データにあるコンテンツ）を再度選択（チェックを外す）することで、お気に入り登録の取り消しを行えますが当該コンテンツのチェックボックスを **2回クリック（チェックを付けて → チェックを外す）** しないと機能しない、ということへの対処。<br />
お気に入り登録済みコンテンツの任意の文字列とクリックした`input`要素の`id`属性名を照合して登録取り消しを行うメソッド（`CheckBox.tsx`内に記述した`_fetchContent_removeCheckedAttr_removeItems`）を制作して対応。

## ChatGPT
- `filter`メソッドの取扱方について質問（結局使用せず）
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

- `DefaultItemContent.tsx`にて使用する予定だった……
```
const { isCheckItems } = useContext(CheckItemsContext);

/* お気に入り登録されていない（登録されたコンテンツが除外された）コンテンツのみを表示するための State */
const [isAdjustItems, setAdjustItems] = useState<string[]>([]);

useEffect(() => {
    const favoritesItems: NodeListOf<HTMLDivElement> = document.querySelectorAll('.favorites .items');
    if (favoritesItems.length > 0) {
        const favoriteItemAltTxt: string[] = [];
        favoritesItems.forEach(favoritesItem => {
            const targetImgAltTxt: string | null | undefined = favoritesItem.querySelector('img')?.getAttribute('alt');
            const adjustAltTxt: string | undefined = targetImgAltTxt?.split('：')[1].split('の画像')[0];
            if (typeof adjustAltTxt !== "undefined") favoriteItemAltTxt.push(adjustAltTxt);
        });

        const adjustItems = [...isImgNameSrc].filter(item => {
            /*（![...favoriteItemAltTxt] ＝ boolean{ false } の配列）以下の処理で true の要素を返して、それに合致する item が返却される */
            return ![...favoriteItemAltTxt].some(favoriteItem => item.match(favoriteItem));
        });
        setAdjustItems((_prevAdjustItems) => [...isAdjustItems, ...adjustItems]);
    }
}, [isCheckItems]);
```