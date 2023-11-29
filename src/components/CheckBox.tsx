import { memo, FC, ChangeEvent, useContext, useCallback } from "react";
import { LocalStorageContext } from "../provider/LocalStorageContext";
import { CheckItemsContext } from "../provider/CheckItemsContext";
import { useGetTargetImgNum } from "../hooks/useGetTargetImgNum";
import { useRemoveItems } from "../hooks/useRemoveItems";
import { usePushLocalSaveBoxes } from "../hooks/usePushLocalSaveBoxes";
import { useLocalSaved } from "../hooks/useLocalSaved";

type checkBoxType = {
    index: number
}

export const CheckBox: FC<checkBoxType> = memo(({ index }) => {
    const { localSaveBoxes } = useContext(LocalStorageContext);
    const { isCheckItems, setCheckItems } = useContext(CheckItemsContext);

    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();

    const { GetTargetImgNum } = useGetTargetImgNum();
    const { RemoveItems } = useRemoveItems();
    const _removeItems = (inputEl: HTMLInputElement) => {
        const parentEl: HTMLDivElement | null = inputEl.closest('.items');
        const itemsOriginContent = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string;
        RemoveItems(GetTargetImgNum(itemsOriginContent, 'itemsOrigin'));


        
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            console.log(SaveDateItems);
        }
    }

    const foo = () => {
        // const checkedItemId = GetTargetImgNum(itemsOriginContent, 'item-');
        // console.log(checkedItemId);
        // const findCheckedItemId: string | undefined = isCheckItems.find(checkItems => checkItems.match(checkedItemId));
        // console.log(findCheckedItemId);
    }

    const _hoge = (
        SaveDateItems: string[],
        inputEl: HTMLInputElement
    ) => {
        const parentEl: HTMLDivElement | null = inputEl.closest('.items');
        const itemsOriginContent = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string;
        const findItems = SaveDateItems.find(SaveDateItem => SaveDateItem === itemsOriginContent) as string;
        const targetIndex = SaveDateItems.indexOf(findItems);
        const shallowCopy = [...SaveDateItems];
        shallowCopy.splice(targetIndex, 1);
        console.log(SaveDateItems, targetIndex, shallowCopy);

        _pushLocalSaveBoxes(shallowCopy);
        _localSaved('localSaveBoxes', localSaveBoxes);
    }

    const _checkedJudge = (inputEl: HTMLInputElement) => {
        if (inputEl.hasAttribute('checked')) {
            _removeItems(inputEl);
            inputEl.removeAttribute('checked');
        } else {
            inputEl.setAttribute('checked', 'true');
        }
    }

    const _onTime_removeCheckItems = (
        isFindCheckedItemId: boolean,
        findCheckedItemId: string,
        checkedItemId?: string
    ) => {
        if (isFindCheckedItemId === true) {
            const targetIndex: number = isCheckItems.indexOf(findCheckedItemId);
            const shallowCopy: string[] = [...isCheckItems];
            shallowCopy.splice(targetIndex, 1);
            setCheckItems((_prevCheckItems) => [...shallowCopy]);
        } else {
            if (checkedItemId !== undefined) setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
        }
    }

    const checkItems = useCallback((labelEl: HTMLLabelElement) => {
        const inputEl: HTMLInputElement | null = labelEl.querySelector('input[type="checkbox"]');
        const checkedItemId = inputEl?.getAttribute('id') as string; // 型アサーション：型推論の上書き

        if (isCheckItems.length <= 0) {
            if (inputEl !== null) _checkedJudge(inputEl);
            setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
        } else {
            const findCheckedItemId: string | undefined = isCheckItems.find(checkItems => checkItems.match(checkedItemId));
            if (typeof findCheckedItemId !== "undefined") {
                if (inputEl !== null) _checkedJudge(inputEl);
                _onTime_removeCheckItems(true, checkedItemId);
            } else {
                if (inputEl !== null) _checkedJudge(inputEl);
                _onTime_removeCheckItems(false, checkedItemId, checkedItemId);
            }
        }
    }, [isCheckItems]);

    return (
        <label htmlFor={`item-${index + 1}`} onChange={(labelEl: ChangeEvent<HTMLLabelElement>) => {
            checkItems(labelEl.currentTarget);
        }}><input id={`item-${index + 1}`} type="checkbox" />{`item-${index + 1}`}</label>
    );
});