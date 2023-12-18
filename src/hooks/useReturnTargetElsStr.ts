/* 条件に一致する複数要素が持つ「任意の子要素の中身（.itemsOrigin の中身）」を文字列として取得 */

export const useReturnTargetElsStr = () => {
    const _returnTargetElsStr: (checkedContents: NodeListOf<HTMLElement>) => string[] = (checkedContents: NodeListOf<HTMLElement>) => {
        return Array.from(checkedContents).map(checkedContent => {
            const parentEl: HTMLDivElement | null = checkedContent.closest('.items');
            const itemsOriginStr = parentEl?.querySelector('.itemsOrigin')?.innerHTML as string; // 型アサーション：型推論の上書き
            return itemsOriginStr;
        });
    }

    return { _returnTargetElsStr }
}