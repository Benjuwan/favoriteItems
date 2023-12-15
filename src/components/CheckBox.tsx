import { memo, FC, ChangeEvent, useContext } from "react";
import styled from "styled-components";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { useRemoveItems } from "../hooks/useRemoveItems";

type checkBoxType = {
    index: number;
    imgNameSrc: string;
}

export const CheckBox: FC<checkBoxType> = memo(({ index, imgNameSrc }) => {
    const { isCheckItems, setCheckItems } = useContext(CheckItemsContext);

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { RemoveItems } = useRemoveItems();

    /* 登録済みコンテンツの【解除直後の登録】という処理を実現するための特例措置（effectHook や react 特有の再レンダリング処理の影響を受けない「let：再定義可能な変数」として（データの編集作業が行われた）localStorage データを取り回す）*/
    let mutableLocalStorageData: string[] = [];
    const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
    if (getLocalStorageItems !== null) mutableLocalStorageData = JSON.parse(getLocalStorageItems);

    /* 当該コンテンツの削除（及び localStorage への更新）*/
    const _removeItems = (inputEl: HTMLInputElement) => {
        const parentEl: HTMLDivElement | null = inputEl.closest('.items');
        const itemsOriginContent = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string;
        RemoveItems(GetTargetImgNum(itemsOriginContent, 'itemsOrigin'));
    }

    /* お気に入り登録済み（localstorage データ内の）コンテンツの中身から【item-ナンバー】を（加工：GetTargetImgNum）取得し、クリックした input 要素の id属性と照合して陽性だった場合は localstorage データ及び表示画面から削除 */
    const _fetchContent_removeCheckedAttr_removeItems = (inputEl: HTMLInputElement) => {
        const targetInputEl_idAttr = inputEl.getAttribute('id') as string;
        const getTargetItemNumbers = Array.from(mutableLocalStorageData).map(checkSaveDataItem => GetTargetImgNum(checkSaveDataItem, 'item').split('：')[0]);
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
        find_checked_ItemId: string,
        checkContentAlreadyExist: string[]
    ) => {
        if (isFindCheckedItemId === true) {
            const targetIndex: number = isCheckItems.indexOf(find_checked_ItemId);
            const shallowCopy: string[] = [...isCheckItems];
            shallowCopy.splice(targetIndex, 1);
            if (checkContentAlreadyExist.length <= 0) setCheckItems((_prevCheckItems) => [...shallowCopy]); // チェックしたコンテンツが登録済みの場合はコピーして splice 処理（当該IDコンテンツを削除）した配列（shallowCopy）で State 更新（登録作業に進める）
        } else {
            if (checkContentAlreadyExist.length <= 0) setCheckItems((_prevCheckItems) => [...isCheckItems, find_checked_ItemId]); // チェックしたコンテンツが未登録の場合は State 更新（登録作業に進める）
        }
    }

    /* 現在選択しているコンテンツを任意の文字列に加工したリストを生成し、さらに特定の文字列に加工したリストにして返す */
    const currentCheckedItemLists = () => {
        return mutableLocalStorageData.map(checkSaveData => {
            const getTargetStr: string = GetTargetImgNum(checkSaveData, 'item');
            return getTargetStr.split('：')[0];
        });
    }

    /* チェックボックスのクリックイベント */
    const checkItems = (labelEl: HTMLLabelElement) => {
        const inputEl: HTMLInputElement | null = labelEl.querySelector('input[type="checkbox"]');
        const checkedItemId = inputEl?.getAttribute('id') as string; // 型アサーション：型推論の上書き

        /* チェックしたコンテンツが登録済みか判定して、存在する場合は checkContentAlreadyExist に格納する */
        const checkedItemLists = currentCheckedItemLists();
        const checkContentAlreadyExist: string[] = checkedItemLists.filter(checkedItemList => checkedItemList === checkedItemId);

        if (isCheckItems.length <= 0) {
            /* チェックしたコンテンツが未登録の場合は checked を付与 */
            if (inputEl !== null) _checkedJudge_fetchContent(inputEl);
            /* チェックしたコンテンツが未登録の場合は State 更新（登録作業に進める）*/
            if (checkContentAlreadyExist.length <= 0) setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
        } else {
            /* チェックしたコンテンツがいくつか既に存在する場合はチェックボックス要素の id と既存の内容とを照合 */
            const findCheckedItemId: string | undefined = isCheckItems.find(checkItems => checkItems === checkedItemId); //（match のような一文字でも含んでいれば true ではなく）厳密なマッチング判定を行う
            if (typeof findCheckedItemId !== "undefined") {
                /* 照合結果が陽性の場合は splice 処理の方へ進む */
                if (inputEl !== null) _checkedJudge_fetchContent(inputEl);
                _onTime_removeCheckItems(true, findCheckedItemId, checkContentAlreadyExist);
            } else {
                /* 照合結果が陰性の場合は State を更新（チェックされたコンテンツ認定）*/
                if (inputEl !== null) _checkedJudge_fetchContent(inputEl);
                _onTime_removeCheckItems(false, checkedItemId, checkContentAlreadyExist);
            }
        }
    }

    return (
        <LabelEls htmlFor={`item-${index + 1}`} onChange={(labelEl: ChangeEvent<HTMLLabelElement>) => {
            checkItems(labelEl.currentTarget);
        }}>
            <input id={`item-${index + 1}`} type="checkbox" />{`No.${index + 1}：${imgNameSrc}の画像`}
        </LabelEls>
    );
});


const LabelEls = styled.label`
cursor: pointer;
line-height: 2;
display: flex;
align-items: center;

&:hover {
    color: #fa04d9;
}

& input[type="checkbox"] {
    appearance: none;
    border-radius: 0;
    border: 1px solid transparent;
    background-color: transparent;

    &[checked] {
        &::before{
            content: "♥";
            display: grid;
            place-content: center;
            color: #fa04d9;
            font-size: 1.25em;
            line-height: 1;
            margin-right: .25em;
            background-color: #f8baf0;
            border-radius: 50%;
            width: 1.25em;
            height: 1.25em;
        }
    }
}
`