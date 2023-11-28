import { memo, FC, useCallback, ChangeEvent } from "react";

type checkBoxType = {
    index: number,
    isCheckItems: string[],
    setCheckItems: React.Dispatch<React.SetStateAction<string[]>>
}

export const CheckBox: FC<checkBoxType> = memo(({ index, isCheckItems, setCheckItems }) => {
    const _checkedJudge = (inputEl: HTMLInputElement) => {
        if (inputEl.hasAttribute('checked')) {
            inputEl.removeAttribute('checked');
        } else {
            inputEl.setAttribute('checked', 'true');
        }
    }

    const checkItems = useCallback((labelEl: HTMLLabelElement) => {
        const inputEl: HTMLInputElement | null = labelEl.querySelector('input[type="checkbox"]');
        const checkedItemId: string | null | undefined = inputEl?.getAttribute('id');
        if (checkedItemId) {
            if (isCheckItems.length <= 0) {
                setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
                if (inputEl !== null) _checkedJudge(inputEl);
            } else {
                const findCheckedItemId: string | undefined = isCheckItems.find(checkItems => checkItems.match(checkedItemId));
                if (typeof findCheckedItemId !== "undefined") {
                    const targetIndex: number = isCheckItems.indexOf(findCheckedItemId);
                    const shallowCopy: string[] = [...isCheckItems];
                    shallowCopy.splice(targetIndex, 1);
                    setCheckItems((_prevCheckItems) => [...shallowCopy]);
                    if (inputEl !== null) _checkedJudge(inputEl);
                } else {
                    setCheckItems((_prevCheckItems) => [...isCheckItems, checkedItemId]);
                    if (inputEl !== null) _checkedJudge(inputEl);
                }
            }
        }
    }, [isCheckItems]);

    // console.log(isCheckItems);

    return (
        <label htmlFor={`item-${index + 1}`} onChange={(labelEl: ChangeEvent<HTMLLabelElement>) => {
            checkItems(labelEl.currentTarget);
        }}><input id={`item-${index + 1}`} type="checkbox" />{`item-${index + 1}`}</label>
    );
});