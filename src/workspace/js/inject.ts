interface ElementWaitCallback<T extends HTMLElement> {
    (mutations: MutationRecord[], observer: MutationObserver): Nullable<T>
}

export const waitForElement = async <T extends HTMLElement> (targetNode: Node, callback: ElementWaitCallback<T>, config?: MutationObserverInit, timeout?: number): Promise<T> => {
    return new Promise((resolve, reject) => {
        let timeoutID: number | undefined;

        const observerCallback = (mutations: MutationRecord[], observer: MutationObserver): void => {
            const ret = callback(mutations, observer)

            if (ret != null) {
                resolve(ret)
                observer.disconnect()
                if (timeoutID)
                    clearTimeout(timeoutID)
            } 
        }
        
        const observer = new MutationObserver(observerCallback);
        observer.observe(targetNode, config);

        if (timeout != null)
            setTimeout(() => {
                reject(new TypeError("시간 초과"))
                observer.disconnect()
            }, timeout)
    })
}