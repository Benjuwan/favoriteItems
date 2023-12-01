import { memo, useContext, useEffect, useState } from "react";
import { ItemsContext } from "../provider/ItemsContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useLocalDataSaved } from "../hooks/useLocalDataSaved";
import { useResetAllFavorite } from "../hooks/useResetAllFavorite";
import { usePushLocalSaveBoxes } from "../hooks/usePushLocalSaveBoxes";
import { useLocalSaved } from "../hooks/useLocalSaved";

export const LocalSaveCtrl = memo(() => {
    const { isItems } = useContext(ItemsContext);
    const { isCheckItems } = useContext(CheckItemsContext);

    const { LocalDataSave } = useLocalDataSaved();
    const { ResetAllFavorite } = useResetAllFavorite();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();

    /* 初回レンダリングのシグナル */
    const [FirstRenderSignal, setFirstRenderSignal] = useState<boolean>(false);

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
        }
    }, [isCheckItems]);

    /* 初回レンダリング後、checkbox の操作で選択されているコンテンツ（既存の localStorage データの中身）が無くなった場合はリセット処理実行 */
    useEffect(() => {
        setFirstRenderSignal((_prevFirstRenderSignal) => true);
        if (FirstRenderSignal && isCheckSaveData.length <= 0) ResetAllFavorite();
    }, [isCheckSaveData]);

    /* 現在 localstorage データに存在する子（たち）と選択された追加の子（たち）の選定及び localstorage データにセット */
    const _check_SelectedContents = () => {
        const checkedContents: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        if (checkedContents.length > 0) {
            const checkedItems: string[] = Array.from(checkedContents).map(checkedContent => {
                const parentEl: HTMLDivElement | null = checkedContent.closest('.items');
                const itemsOriginStr = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string; // 型アサーション：型推論の上書き
                return itemsOriginStr;
            });
            /* getTargetItems：現在 localstorage データに存在する子（たち）と選択された追加の子（たち）*/
            const getTargetItems: string[] = [...isCheckSaveData, ...checkedItems];
            return getTargetItems;
        }
    }

    const _setLocalStorage_Favorite = () => {
        const getTargetItems = _check_SelectedContents();
        if (getTargetItems !== undefined) {
            _pushLocalSaveBoxes(getTargetItems);
            _localSaved('localSaveBoxes', getTargetItems);
        }
    }

    /* 既存の localStorage データの有無により「お気に入り登録・表示」ボタンクリック時の挙動を変更 */
    const localDataSave_Favorite = () => {
        if (isCheckSaveData.length > 0) {
            /* localStorage データがある場合は checked = 'true' の内容のみ localStorage に保存 */
            _setLocalStorage_Favorite();
            location.reload();
        } else {
            LocalDataSave();
            location.reload();
        }
    }

    return (
        <div className="localSaveInfos">
            <p>現在のお気に入りは「{isCheckItems.join(', ')}」です。</p>
            <button type="button" className="localDataSave" onClick={localDataSave_Favorite}>お気に入りを登録・表示</button>
            <button type="button" className="resetAllFavorite" disabled={isItems.length <= 0} onClick={ResetAllFavorite}>お気に入りをリセット</button>
        </div>
    );
});