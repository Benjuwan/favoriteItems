export const useInterSecObs = () => {
    /* IntersectionObserver のオプションに対する型指定 */
    type defaultOptionsType = {
        root: null | HTMLElement,
        rootMargin: string,
        once: boolean,  // 効果効果の制限に使用
        threshold?: number
    }

    const InterSecObs: (
        entryElements: string,
        entryClassName: string,
        entryOptions?: object,
        anotherTarget?: string
    ) => void = (
        entryElements: string, // 交差対象
        entryClassName: string, // 付与・解除したいクラス名
        entryOptions?: object, // 交差機能に必要なオブジェクト
        anotherTarget?: string // 着火対象を別にしたい場合に使用
    ) => {
            // 交差対象
            const entryEls: NodeListOf<HTMLElement> = document.querySelectorAll(entryElements);

            // 交差機能に必要なオブジェクト(デフォルト設定)
            const defaultOptionsContent: defaultOptionsType = {
                root: null,
                rootMargin: '0px',
                once: true
            }

            // 交差機能に必要なオブジェクト(使用時に別途オプションを指定した場合に上記デフォルトを上書きした設定にする)
            const defaultOptions: defaultOptionsType = Object.assign(defaultOptionsContent, entryOptions);

            // コールバック関数に必要な引数(配列)の型
            type entriesType = {
                isIntersecting: boolean;
                target: {
                    classList: {
                        add: (arg0: string) => void;
                        remove: (arg0: string) => void;
                    }
                }
            }

            // 交差効果の制限(一度きりの実行にしたい場合)に対する型
            type observerType = {
                unobserve(
                    target: {
                        classList: {
                            add: (arg0: string) => void;
                            remove: (arg0: string) => void;
                        };
                    }
                ): void;
            }

            const callbackFunc = (
                // コールバック関数に必要な引数(配列)の型
                entries: Array<entriesType>,
                observer: observerType
            ) => {
                // * entries(or entry)には交差(着火)対象が指定される
                entries.forEach(entry => {
                    // 着火対象を別にした場合の処理ver
                    if (anotherTarget !== undefined) {
                        // 着火対象に応じて、指定した処理（クラスの付与・解除）を交差対象に行う
                        if (entry.isIntersecting) {
                            entryEls.forEach(entryEl => {
                                entryEl.classList.add(entryClassName);
                            });
                        } else {
                            entryEls.forEach(entryEl => {
                                entryEl.classList.remove(entryClassName);
                            });
                        }
                    }

                    // (着火対象を指定しない場合の)通常の処理ver
                    else {
                        if (entry.isIntersecting) {
                            entry.target.classList.add(entryClassName);
                            // trueの場合は交差効果の制限を実行
                            if (defaultOptions.once) {
                                observer.unobserve(entry.target);
                            }
                        } else {
                            entry.target.classList.remove(entryClassName);
                        }
                    }
                });
            }

            // IntersectionObserverを読込
            const Observer = new IntersectionObserver(callbackFunc, defaultOptions);

            // 着火対象を別にした場合の処理ver
            if (anotherTarget !== undefined) {
                const anotherTargets: NodeListOf<HTMLElement> = document.querySelectorAll(anotherTarget);
                anotherTargets.forEach(anotherTarget => Observer.observe(anotherTarget));
            }
            // (着火対象を指定しない場合の)通常の処理ver
            else entryEls.forEach(entryEl => Observer.observe(entryEl));
        }

    return { InterSecObs }
}