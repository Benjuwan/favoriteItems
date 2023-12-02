import { useLocalSaved } from "./useLocalSaved";
import { usePushLocalSaveBoxes } from "./usePushLocalSaveBoxes";
import { useResetAllFavorite } from "./useResetAllFavorite";
import { useReturnTargetElsStr } from "./useReturnTargetElsStr";

/* ラベルクリックによる登録コンテンツ削除で既存の localStorage データが空になったけれどもチェックされているコンテンツがいくつかある時のコンテンツ再登録処理（基本的に useEffect で使用して、依存配列には localStorage データの State（isCheckSaveData）を指定）*/

export const useNolocalDataButChekedExist = () => {
    const { _returnTargetElsStr } = useReturnTargetElsStr();
    const { _pushLocalSaveBoxes } = usePushLocalSaveBoxes();
    const { _localSaved } = useLocalSaved();
    const { ResetAllFavorite } = useResetAllFavorite();

    const _nolocalDataButChekedExist = (
        isCheckSaveData: string[],
        FirstRenderSignal: boolean,
        setFirstRenderSignal: React.Dispatch<React.SetStateAction<boolean>>
    ) => {
        if (isCheckSaveData.length > 0) setFirstRenderSignal((_prevFirstRenderSignal) => true);

        const checkedContents: NodeListOf<HTMLElement> = document.querySelectorAll('[checked]');
        /* _returnTargetElsStr：条件に一致する複数要素が持つ「任意の子要素の中身（.itemsOrigin の中身）」を文字列として取得 */
        const targetElsStr = _returnTargetElsStr(checkedContents);

        /* 初回レンダリング後で、localStorage データが空で、一つもコンテンツが選択されていない場合は「（ラストワンが消えた時点で）選択されていたコンテンツ」が取り急ぎ localStorage データに保存される */
        if (
            FirstRenderSignal &&
            isCheckSaveData.length <= 0 &&
            checkedContents.length > 0
        ) {
            const getTargetItems: string[] = [...isCheckSaveData, ...targetElsStr];
            _pushLocalSaveBoxes(getTargetItems);
            _localSaved('localSaveBoxes', getTargetItems);
            setFirstRenderSignal((_prevFirstRenderSignal) => false);
            location.reload();
        } else if (
            FirstRenderSignal &&
            isCheckSaveData.length === 0 &&
            checkedContents.length === 0
        ) ResetAllFavorite(); // localStorage データの中身も、チェックされているコンテンツも全てが存在しない場合はリロード
    }

    return { _nolocalDataButChekedExist }
}