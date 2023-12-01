import { memo, FC, ChangeEvent, useContext, useState, useEffect } from "react";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { useRemoveItems } from "../hooks/useRemoveItems";

type checkBoxType = {
    index: number;
    imgNameSrc: string;
}

export const CheckBox: FC<checkBoxType> = memo(({ index, imgNameSrc }) => {
    const { isCheckItems, setCheckItems } = useContext(CheckItemsContext);

    /* 既存の localStorage データを State に格納 */
    const [isCheckSaveData, setCheckSaveData] = useState<string[]>([]);
    useEffect(() => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            setCheckSaveData((_prevCheckSaveData) => SaveDateItems);
        }
    }, [isCheckItems]);

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { RemoveItems } = useRemoveItems();

    /* 当該コンテンツの削除（及び localStorage への更新）*/
    const _removeItems = (inputEl: HTMLInputElement) => {
        const parentEl: HTMLDivElement | null = inputEl.closest('.items');
        const itemsOriginContent = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string;
        RemoveItems(GetTargetImgNum(itemsOriginContent, 'itemsOrigin'));
    }

    /* お気に入り登録済み（localstorage データ内の）コンテンツの中身から【item-ナンバー】を（加工：GetTargetImgNum）取得し、クリックした input 要素の id属性と照合して陽性だった場合は localstorage データ及び表示画面から削除 */
    const _fetchContent_removeCheckedAttr_removeItems = (inputEl: HTMLInputElement) => {
        const targetInputEl_idAttr = inputEl.getAttribute('id') as string;
        const getTargetItemNumbers = Array.from(isCheckSaveData).map(checkSaveDataItem => GetTargetImgNum(checkSaveDataItem, 'item').split('：')[0]);
        getTargetItemNumbers.forEach(targetItemNumber => {
            /* if文が「targetItemNumber.match(targetInputEl_idAttr)」だと 10 や 11 を選択している時に 1 までもがマッチ対象となってしまって 1 を登録できなくなるので === で厳密に判定 */
            if (targetItemNumber === targetInputEl_idAttr) {
                const parentItemEl: HTMLDivElement | null = inputEl.closest('.items');
                parentItemEl?.classList.remove('checkedContent');
                inputEl.removeAttribute('checked'); // useLocalDataSaved.ts の LocalDataSave メソッド対策（[checked]要素の .itemsOrigin の中身を localstorage に保存する処理への対策）
                _removeItems(inputEl);
            }
        });
    }

    /* checked 属性の付与・解除及びコンテンツ削除処理（_fetchContent_removeCheckedAttr_removeItems メソッド）*/
    const _checkedJudge_fetchContent = (inputEl: HTMLInputElement) => {
        if (inputEl.hasAttribute('checked')) {
            inputEl.removeAttribute('checked');
        } else {
            inputEl.setAttribute('checked', 'true');
        }
        _fetchContent_removeCheckedAttr_removeItems(inputEl);
    }

    /* リアルタイムでコンテンツの削除更新を行う */
    const _onTime_removeCheckItems = (
        isFindCheckedItemId: boolean,
        find_checked_CheckedItemId: string
    ) => {
        if (isFindCheckedItemId === true) {
            const targetIndex: number = isCheckItems.indexOf(find_checked_CheckedItemId);
            const shallowCopy: string[] = [...isCheckItems];
            shallowCopy.splice(targetIndex, 1);
            setCheckItems((_prevCheckItems) => [...shallowCopy]);
        } else {
            if (find_checked_CheckedItemId !== undefined) setCheckItems((_prevCheckItems) => [...isCheckItems, find_checked_CheckedItemId]);
        }
    }

    /* チェックボックスのクリックイベント */
    const checkItems = (labelEl: HTMLLabelElement) => {
        const inputEl: HTMLInputElement | null = labelEl.querySelector('input[type="checkbox"]');
        const checkedItemId = inputEl?.getAttribute('id') as string; // 型アサーション：型推論の上書き

        if (isCheckItems.length <= 0) {
            /* チェックしたコンテンツがまだ無い場合は checked を付与して State を更新 */
            if (inputEl !== null) _checkedJudge_fetchContent(inputEl);
            setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
        } else {
            /* チェックしたコンテンツがいくつか既に存在する場合はチェックボックス要素の id と既存の内容とを照合 */
            const findCheckedItemId: string | undefined = isCheckItems.find(checkItems => checkItems.match(checkedItemId));
            if (typeof findCheckedItemId !== "undefined") {
                /* 照合結果が陽性の場合は splice 処理の方へ進む */
                if (inputEl !== null) _checkedJudge_fetchContent(inputEl);
                _onTime_removeCheckItems(true, findCheckedItemId);
            } else {
                /* 照合結果が陰性の場合は State を更新（チェックされたコンテンツ認定）*/
                if (inputEl !== null) _checkedJudge_fetchContent(inputEl);
                _onTime_removeCheckItems(false, checkedItemId);
            }
        }
    }
    return (
        <label htmlFor={`item-${index + 1}`} onChange={(labelEl: ChangeEvent<HTMLLabelElement>) => {
            checkItems(labelEl.currentTarget);
        }}><input id={`item-${index + 1}`} type="checkbox" />{`No.${index + 1}：${imgNameSrc}の画像`}</label>
    );
});