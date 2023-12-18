import { useLocalSaved } from "./useLocalSaved";

/* 当該コンテンツの削除及び localStorage への更新 */

export const useRemoveItems = () => {
    const { _localSaved } = useLocalSaved();

    const RemoveItems: (item: string) => void = (
        item: string
    ) => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            const filterItems: string[] = SaveDateItems?.filter(isItem => !isItem.match(item)); // マッチされないコンテンツデータを返す（例：A, B, C が localStorage データに存在しており、今回 B が削除対象だとするとマッチしないのは A, C なので A, C が（返されて）filterItems となる）
            _localSaved('localSaveBoxes', filterItems);
        }
    }

    return { RemoveItems }
}