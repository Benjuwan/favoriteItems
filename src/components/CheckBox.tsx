import { memo, FC, ChangeEvent, useContext } from "react";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { ImgNameContext } from "../provider/ImgNameSrcContext";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { useRemoveItems } from "../hooks/useRemoveItems";

type checkBoxType = {
    index: number
}

export const CheckBox: FC<checkBoxType> = memo(({ index }) => {
    const { isCheckItems, setCheckItems } = useContext(CheckItemsContext);
    const { isImgNameSrc } = useContext(ImgNameContext);

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { RemoveItems } = useRemoveItems();

    /* 当該コンテンツの削除（及び localStorage への更新）*/
    const _removeItems = (inputEl: HTMLInputElement) => {
        const parentEl: HTMLDivElement | null = inputEl.closest('.items');
        const itemsOriginContent = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string;
        RemoveItems(GetTargetImgNum(itemsOriginContent, 'itemsOrigin'));
    }

    /* checked 属性の付与・解除及びコンテンツ削除処理（checked True の場合のみ）*/
    const _checkedJudge = (inputEl: HTMLInputElement) => {
        if (inputEl.hasAttribute('checked')) {
            _removeItems(inputEl);
            inputEl.removeAttribute('checked');
        } else {
            inputEl.setAttribute('checked', 'true');
        }
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
            if (inputEl !== null) _checkedJudge(inputEl);
            setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
        } else {
            /* チェックしたコンテンツがいくつか既に存在する場合はチェックボックス要素の id と既存の内容とを照合 */
            const findCheckedItemId: string | undefined = isCheckItems.find(checkItems => checkItems.match(checkedItemId));
            if (typeof findCheckedItemId !== "undefined") {
                /* 照合結果が陽性の場合は splice 処理の方へ進む */
                if (inputEl !== null) _checkedJudge(inputEl);
                _onTime_removeCheckItems(true, findCheckedItemId);
            } else {
                /* 照合結果が陰性の場合は State を更新（チェックされたコンテンツ認定）*/
                if (inputEl !== null) _checkedJudge(inputEl);
                _onTime_removeCheckItems(false, checkedItemId);
            }
        }
    }
    return (
        <label htmlFor={`item-${index + 1}`} onChange={(labelEl: ChangeEvent<HTMLLabelElement>) => {
            checkItems(labelEl.currentTarget);
        }}><input id={`item-${index + 1}`} type="checkbox" />{`No.${index + 1}：${isImgNameSrc[index]}の画像`}</label>
    );
});