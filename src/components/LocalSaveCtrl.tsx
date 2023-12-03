import { memo, FC, useContext, useEffect, useState } from "react";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useLocalDataSaved } from "../hooks/useLocalDataSaved";
import { useResetAllFavorite } from "../hooks/useResetAllFavorite";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { usePushLocalSaveBoxes } from "../hooks/usePushLocalSaveBoxes";
import { useLocalSaved } from "../hooks/useLocalSaved";
import { useReturnTargetElsStr } from "../hooks/useReturnTargetElsStr";
import { useNolocalDataButChekedExist } from "../hooks/useNolocalDataButChekedExist";

type localSaveCtrlType = {
    FirstRenderSignal: boolean;
    setFirstRenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LocalSaveCtrl: FC<localSaveCtrlType> = memo(({ FirstRenderSignal, setFirstRenderSignal }) => {
    const { isCheckItems } = useContext(CheckItemsContext);

    const { LocalDataSave } = useLocalDataSaved();
    const { ResetAllFavorite } = useResetAllFavorite();
    const { GetTargetImgNum } = useGetTargetImgNum();
    const { _nolocalDataButChekedExist } = useNolocalDataButChekedExist();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();
    const { _returnTargetElsStr } = useReturnTargetElsStr();

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            /* localStroage データを（itemsOrigin- のナンバーで）ソート */
            const SaveDataItemsSort: string[] = SaveDateItems.sort((aheadEl, behindEl) => {
                const itemsOriginNum_Ahead = aheadEl.split('itemsOrigin-')[1].split('：')[0];
                const itemsOriginNum_Behind = behindEl.split('itemsOrigin-')[1].split('：')[0];
                return Number(itemsOriginNum_Ahead) - Number(itemsOriginNum_Behind);
            })
            setCheckSaveData((_prevCheckSaveData) => SaveDataItemsSort);
        }
    }, [isCheckItems]);

    /* ラベルクリックによる登録コンテンツ削除で既存の localStorage データが空になった時の再登録処理（FavoriteItemContent.tsx でも使用）*/
    useEffect(() => _nolocalDataButChekedExist(isCheckSaveData, FirstRenderSignal, setFirstRenderSignal), [isCheckSaveData]);

    /* 現在 localstorage データに存在する子（たち）と選択された追加の子（たち）の選定及び localstorage データにセット */
    const _check_SelectedContents = () => {
        const checkedContents: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        if (checkedContents.length > 0) {
            /* _returnTargetElsStr：条件に一致する複数要素が持つ「任意の子要素の中身（.itemsOrigin の中身）」を文字列として取得 */
            const targetElsStr: string[] = _returnTargetElsStr(checkedContents);
            /* getTargetItems：現在 localstorage データに存在する子（たち）と選択された追加の子（たち）*/
            const getTargetItems: string[] = [...isCheckSaveData, ...targetElsStr];
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

    /* 現在選択しているコンテンツを任意の文字列に加工したリストを生成 */
    const currentCheckedItemLists = () => {
        return isCheckSaveData.map(checkSaveData => GetTargetImgNum(checkSaveData, 'itemsOrigin'));
    }

    return (
        <div className="localSaveInfos">
            {isCheckSaveData.length > 0 ?
                <>
                    <p>登録済みなのは「{currentCheckedItemLists().join(', ')}」です。</p>
                    {isCheckItems.length > 0 &&
                        <p>新たに選択しているのは「{isCheckItems.join(', ')}」です。</p>
                    }
                </> :
                <p>現在のお気に入りは「{isCheckItems.join(', ')}」です。</p>
            }
            <button type="button" className="localDataSave" onClick={localDataSave_Favorite}>お気に入りを{isCheckSaveData.length > 0 ? '更新' : '登録'}・表示</button>
            <button type="button" className="resetAllFavorite" disabled={isCheckSaveData.length <= 0} onClick={ResetAllFavorite}>お気に入りをリセット</button>
        </div>
    );
});