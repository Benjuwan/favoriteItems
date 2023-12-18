import { FC, memo, useState } from "react";
import { useLocalDataSaved } from "../hooks/useLocalDataSaved";
import { usePushLocalSaveBoxes } from "../hooks/usePushLocalSaveBoxes";
import { useLocalSaved } from "../hooks/useLocalSaved";
import { useReturnTargetElsStr } from "../hooks/useReturnTargetElsStr";
import styled from "styled-components";
import { useGetCurrentLocalSaveData_DataSort } from "../hooks/useGetCurrentLocalSaveData_DataSort";

type localSaveBtnType = {
    addFixed?: boolean;
}

export const LocalSaveBtn: FC<localSaveBtnType> = memo(({ addFixed }) => {
    const { LocalDataSave } = useLocalDataSaved();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();
    const { _returnTargetElsStr } = useReturnTargetElsStr();
    const { GetCurrentLocalSaveData_DataSort } = useGetCurrentLocalSaveData_DataSort();

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    /* 既存の localStorage データをソート（して isCheckSaveData に反映）*/
    GetCurrentLocalSaveData_DataSort(setCheckSaveData);

    /* 現在 localstorage データに存在する子（たち）と選択された追加の子（たち）の選定及び localstorage データにセット */
    const _check_SelectedContents: () => string[] | undefined = () => {
        const checkedContents: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        if (checkedContents.length > 0) {
            /* _returnTargetElsStr：条件に一致する複数要素が持つ「任意の子要素の中身（.itemsOrigin の中身）」を文字列として取得 */
            const targetElsStr: string[] = _returnTargetElsStr(checkedContents);
            /* getTargetItems：現在 localstorage データに存在する子（たち）と選択された追加の子（たち）*/
            const getTargetItems: string[] = [...isCheckSaveData, ...targetElsStr];
            return getTargetItems;
        }
    }

    const _setLocalStorage_Favorite: () => void = () => {
        const getTargetItems = _check_SelectedContents();
        if (getTargetItems !== undefined) {
            _pushLocalSaveBoxes(getTargetItems);
            _localSaved('localSaveBoxes', getTargetItems);
        }
    }

    /* 既存の localStorage データの有無により「お気に入り登録・表示」ボタンクリック時の挙動を変更 */
    const localDataSave_Favorite: () => void = () => {
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
        <LocalDataSaveBtn type="button" className={addFixed ? "localDataSave addFixed" : "localDataSave"} onClick={localDataSave_Favorite}>
            {addFixed ? '♡' : `お気に入りを${isCheckSaveData.length > 0 ? '更新' : '登録'}・表示`}
        </LocalDataSaveBtn>
    );
});

const LocalDataSaveBtn = styled.button`
&.addFixed{
    font-size: 2rem;
    position: fixed;
    bottom: 3rem;
    right: 3rem;
    width: 4.4rem;
    height: 4.4rem;
    border-radius: 50%;
    display: grid;
    place-content: center;
    line-height: 1;
    z-index: 9;

    @media screen and (min-width: 1025px) {
        width: 44px;
        height: 44px;
        bottom: 30px;
        right: 30px;
        font-size: 20px;
    }
}
`