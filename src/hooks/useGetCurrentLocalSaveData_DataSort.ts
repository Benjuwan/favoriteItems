import { useContext, useEffect } from "react";
import { ItemsContext } from "../provider/ItemsContext";

/* 既存の localStorage データをソートして引数で渡ってきた更新関数にセット（このカスタムフックを使用するコンポーネントで用意した「現在の localStorage データを活用する State 変数」に反映）*/

export const useGetCurrentLocalSaveData_DataSort = () => {
    const GetCurrentLocalSaveData_DataSort = (
        setCheckSaveData: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        const { isItems } = useContext(ItemsContext);

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
        }, [isItems]); // EffectHook 依存配列は isItems：登録（予定）コンテンツの中身（.itemsOrigin の中身）を管理する配列 State
    }

    return { GetCurrentLocalSaveData_DataSort }
}