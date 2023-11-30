import { memo, useContext, useEffect, useState } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { ItemsContext } from "../provider/ItemsContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useLocalDataSaved } from "../hooks/useLocalDataSaved";
import { useResetAllFavorite } from "../hooks/useResetAllFavorite";
import { usePushLocalSaveBoxes } from "../hooks/usePushLocalSaveBoxes";
import { useLocalSaved } from "../hooks/useLocalSaved";

export const LocalSaveCtrl = memo(() => {
    const { localSaveBoxes } = useContext(LocalStorageContext);
    const { isItems } = useContext(ItemsContext);
    const { isCheckItems } = useContext(CheckItemsContext);

    const { LocalDataSave } = useLocalDataSaved();
    const { ResetAllFavorite } = useResetAllFavorite();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
        }
    }, [isCheckItems]);

    const _setLocalStorage_Favorite = () => {
        /* localStorage データがある場合は checked = 'true' の内容のみ localStorage に保存 */
        const checkedItems: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        checkedItems.forEach(checkedItem => {
            const parentEl: HTMLDivElement | null = checkedItem.closest('.items');
            const itemsOriginContent = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string; // 型アサーション：型推論の上書き
            _pushLocalSaveBoxes(itemsOriginContent);
            _localSaved('localSaveBoxes', localSaveBoxes);
        });
    }

    const localDataSave_Favorite = () => {
        if (isCheckSaveData.length >= 0) {
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