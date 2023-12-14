/* 画像クリックでのモーダル表示 */

export const useViewDetails = () => {
    /* モーダル表示オフで、YouTube 動画リセット */
    const _modalOff_resetIframeSrc = (
        itemContent: HTMLDivElement | HTMLElement
    ) => {
        const movieEls: HTMLDivElement | null = itemContent.querySelector('.movieEls');
        if (movieEls !== null) {
            const targetIframe: HTMLIFrameElement | null | undefined = movieEls?.querySelector('iframe');
            const targetIframeSrc = targetIframe?.getAttribute('src') as string; // 型アサーション：型推論の上書き
            /* モーダル表示中の（コンテンツ内の）iframe の src 属性に同じ（src 属性の）内容：targetIframeSrc をセットする（セットし直して動画停止） */
            targetIframe?.setAttribute('src', targetIframeSrc);
        }
    }

    const viewDetails = (
        itemContent: HTMLDivElement | HTMLElement,
        className: string
    ) => {
        if (itemContent.classList.contains(className)) {
            itemContent.classList.remove(className);
            _modalOff_resetIframeSrc(itemContent);
        } else {
            itemContent.classList.add(className);
        }
    }

    return { viewDetails }
}