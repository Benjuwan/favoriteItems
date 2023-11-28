import { memo, useContext } from "react";
import { ItemsContext } from "../provider/ItemsContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useLocalDataSaved } from "../hooks/useLocalDataSaved";
import { useResetAllFavorite } from "../hooks/useResetAllFavorite";

export const LocalSaveCtrl = memo(() => {
    const { isItems } = useContext(ItemsContext);
    const { isCheckItems } = useContext(CheckItemsContext);
    const { LocalDataSave } = useLocalDataSaved();
    const { ResetAllFavorite } = useResetAllFavorite();

    return (
        <div className="localSaveInfos">
            <p>現在のお気に入りは「{isCheckItems.join(', ')}」です。</p>
            <button type="button" className="localDataSave" onClick={LocalDataSave}>お気に入りを表示</button>
            <button type="button" className="resetAllFavorite" disabled={isItems.length <= 0} onClick={ResetAllFavorite}>お気に入りをリセット</button>
        </div>
    );
});