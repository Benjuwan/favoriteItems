import { memo, FC, useContext, useEffect, useState } from "react";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { LocalSaveBtn } from "./LocalSaveBtn";
import { useResetAllFavorite } from "../hooks/useResetAllFavorite";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { useGetCurrentLocalSaveData_DataSort } from "../hooks/useGetCurrentLocalSaveData_DataSort";
import { useNolocalDataButChekedExist } from "../hooks/useNolocalDataButChekedExist";

type localSaveCtrlType = {
    FirstRenderSignal: boolean;
    setFirstRenderSignal: React.Dispatch<React.SetStateAction<boolean>>;
}

export const LocalSaveCtrl: FC<localSaveCtrlType> = memo(({ FirstRenderSignal, setFirstRenderSignal }) => {
    const { isCheckItems } = useContext(CheckItemsContext);

    const { ResetAllFavorite } = useResetAllFavorite();
    const { GetTargetImgNum } = useGetTargetImgNum();
    const { GetCurrentLocalSaveData_DataSort } = useGetCurrentLocalSaveData_DataSort();
    const { _nolocalDataButChekedExist } = useNolocalDataButChekedExist();

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    /* 既存の localStorage データをソート（して isCheckSaveData に反映）*/
    GetCurrentLocalSaveData_DataSort(setCheckSaveData);

    /* ラベルクリックによる登録コンテンツ削除で既存の localStorage データが空になった時の再登録処理（FavoriteItemContent.tsx でも使用）*/
    useEffect(() => _nolocalDataButChekedExist(isCheckSaveData, FirstRenderSignal, setFirstRenderSignal), [isCheckSaveData]);

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
            <LocalSaveBtn />
            <button type="button" className="resetAllFavorite" disabled={isCheckSaveData.length <= 0} onClick={ResetAllFavorite}>お気に入りをリセット</button>
        </div>
    );
});