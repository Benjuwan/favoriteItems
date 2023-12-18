import { useGetTargetImgNum } from "./useGetTargetImgNum";

/* 登録されている localStorage データを呼び出して、.defaultWrapper の登録済みコンテンツには特定のスタイルをあてる（見た目に反映させる）処理 */

export const useSelectCheckedItems = () => {
    const { GetTargetImgNum } = useGetTargetImgNum();

    const _selectCheckedItems: (SaveDateItems: string[]) => void = (SaveDateItems: string[]) => {
        /* 登録済みのコンテンツから任意の文字列を抽出したリストを生成 */
        const shallowCopy: string[] = [...SaveDateItems];
        const selectCheckedItems = shallowCopy.map(SaveDateItem => {
            const getTargetImgNumbers: string = GetTargetImgNum(SaveDateItem, 'itemsOrigin');
            return getTargetImgNumbers;
        });

        /* .defaultWrapper のコンテンツ（.itemsOrigin の子要素たち）を対象に、登録済みコンテンツには特定のスタイルをあてる（見た目に反映させる）*/
        const items: NodeListOf<HTMLDivElement> = document.querySelectorAll('.defaultWrapper .items');
        items.forEach(item => {
            item.classList.remove('checkedContent'); // 初期化（checkedContent クラスを削除）
            const itemImgAltTxt: string | null | undefined = item.querySelector('img')?.getAttribute('alt');

            selectCheckedItems.forEach(selectCheckedItem => {
                if (itemImgAltTxt === selectCheckedItem) item.classList.add('checkedContent'); // 選択されたコンテンツにシグナル用の class を付与
            });
        });
    }

    /* 登録されている localStorage データを呼び出して、_selectCheckedItems メソッドに渡す処理 */
    const ActionSelectCheckedItems: () => void = () => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            _selectCheckedItems(SaveDateItems);
        }
    }

    return { ActionSelectCheckedItems }
}