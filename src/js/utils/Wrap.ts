
type FuncArgs<F extends Function> = F extends (...args: infer P) => any ? P : any
type FuncRet<F extends Function> = F extends (...args: any) => infer P ? P : any
type FuncThis<F extends Function> = F extends (this: infer P, ...args: any) => any ? P : any

export type Wrapper<F extends Function> = (this: FuncThis<F>, callNext: (...args: FuncArgs<F>) => FuncRet<F>, ...args: FuncArgs<F>) => FuncRet<F>

interface WrapChainContext<F extends Function> {
    wrapper: Wrapper<F>, enabled: boolean
}
type WrapChain<F extends Function> = Array<WrapChainContext<F>>;


interface WrapData<F extends Function> {
    wrapChain: WrapChain<F>,
    wrapDest: F
}

interface IWrappedFunc<F extends Function> extends Function {
    [wrapperSymbol]: WrapData<F>,
    unwrap: (wrapper: Wrapper<F>) => void,
    wrap: (wrapper: Wrapper<F>) => void,
    toggleWrapper: (wrapper: Wrapper<F>, enabled: boolean) => void
}

export type WrappedFunc<F extends Function> = IWrappedFunc<F> & F;

const wrapperSymbol = Symbol("MultiWrapper")


const callNextGen = function* <F extends Function>(wrapChain: WrapChain<F>) {
    for (const {wrapper, enabled} of wrapChain)
        if (enabled) yield wrapper
}

export const makeWrap = <F extends Function>(dest: F, wrapper: Wrapper<F>): WrappedFunc<F> => {
    const wrapperData:WrapData<F> = {
        wrapChain: [{wrapper, enabled: true}],
        wrapDest: dest
    }

    if (wrapperSymbol in dest) {
        wrapperData.wrapChain.concat((dest as unknown as WrappedFunc<F>)[wrapperSymbol].wrapChain)
    }
    
    const wrappedFunc = function(this: FuncThis<F>, ...args: FuncArgs<F>): FuncRet<F> {
        const {wrapChain, wrapDest} = wrappedFunc[wrapperSymbol]
        if (wrapChain.length === 0)
            return wrapDest.call(this, ...args)

        const callee = callNextGen(wrapChain)
        const callNext = (...args: FuncArgs<F>) => {
            const {value, done} = callee.next()
            if (done)
                return wrapDest.call(this, ...args)
            else
                return value.call(this, callNext, ...args)
        }

        return callNext(...args)
    }

    wrappedFunc[wrapperSymbol] = wrapperData
    wrappedFunc.toggleWrapper = toggleWrapper.bind(null, wrapperData.wrapChain)
    wrappedFunc.wrap = wrap.bind(null, wrapperData.wrapChain)
    wrappedFunc.unwrap = unwrap.bind(null, wrapperData.wrapChain)

    return (wrappedFunc as unknown as WrappedFunc<F>)
}

const toggleWrapper = <F extends Function>(wrapChain: WrapChain<F>, wrapper: Wrapper<F>, enabled: boolean) => {
    for (let i = 0; i < wrapChain.length; i++) {
        if (wrapChain[i].wrapper === wrapper) {
            wrapChain[i].enabled = enabled
            return
        }
    }
}

const wrap = <F extends Function>(wrapChain: WrapChain<F>, wrapper: Wrapper<F>) => {
    wrapChain.unshift({wrapper, enabled: true})
}

const unwrap = <F extends Function>(wrapChain: WrapChain<F>, wrapper: Wrapper<F>) => {
    for (let i = 0; i < wrapChain.length; i++) {
        if (wrapChain[i].wrapper === wrapper) {
            wrapChain.splice(i, 1)
            return
        }
    }
}

