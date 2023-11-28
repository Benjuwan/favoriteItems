import { useLocalSaved } from "./useLocalSaved";

export const useRemoveItems = () => {
    const { _localSaved } = useLocalSaved();

    const RemoveItems = (
        item: string
    ) => {
        const getLocalStorageItems: string | null = localStorage.getItem('localSaveBoxes');
        if (getLocalStorageItems !== null) {
            const SaveDateItems: string[] = JSON.parse(getLocalStorageItems);
            const filterItems: string[] = SaveDateItems?.filter(isItem => !isItem.match(item));
            _localSaved('localSaveBoxes', filterItems);
        }
    }

    return { RemoveItems }
}