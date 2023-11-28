export const useViewDetails = () => {
    const viewDetails = (
        itemContent: HTMLDivElement | HTMLElement,
        className: string
    ) => {
        if (itemContent.classList.contains(className)) {
            itemContent.classList.remove(className);
        } else {
            itemContent.classList.add(className);
        }
    }

    return { viewDetails }
}