import { makeWrap } from "src/common/utils/wrap"

export class DropdownSearchManager {
    private static _instance?: DropdownSearchManager

    static get instance() {
        return DropdownSearchManager._instance
    }

    static init() {
        if (!DropdownSearchManager._instance)
            DropdownSearchManager._instance = new DropdownSearchManager()
    }

    private constructor() {
        const dropdownDynamicCtor = Entry.FieldDropdownDynamic.prototype
        dropdownDynamicCtor.renderOptions = makeWrap(dropdownDynamicCtor.renderOptions, (callNext, ...args) => {
            callNext(...args)
            
        })
    }
}

class DropdownSearch {
    private target: HTMLElement
    private scrollbar: Nullable<HTMLElement>
    private input: HTMLInputElement

    private queryElemList: HTMLElement[] = []
    private isQuery: boolean = false
    
    private selectedItem: Nullable<HTMLElement>
    private selectedIdx:number = -1

    constructor(target: HTMLElement) {
        this.target = target
        this.scrollbar = this.target.querySelector<HTMLElement>('div > div')

        if (!this.scrollbar || this.scrollbar.className.includes('scrollbar'))
            this.scrollbar = null

        this.input = document.createElement('input')

        // @ts-expect-error 스타일 그냥 쓸 수 있게 좀 해줘라 제발
        this.input.style = `
            margin: 8px;
            width: 150px;
            height: 24px;
            font-size: 14px;
            border-radius: 12px;
            outline: none;
            border: 0;
            background-color: rgb(220, 220, 220);
            padding: 0 9px;
            font-weight: bold;
            color: #2c313d;
            `

        this.input.addEventListener('input', () => this.onInput())
        this.input.addEventListener('keydown', (ev) => this.onKeydown(ev))
    }

    query(value: string, query: string): boolean {
        function splitKorean(text: string) {
            const CHO = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ"
            const JUNG = "ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ"
            const JONG = "　ㄱㄲㄳㄴㄵㄶㄷㄹㄺㄻㄼㄽㄾㄿㅀㅁㅂㅄㅅㅆㅇㅈㅊㅋㅌㅍㅎ"
      
            const splitedArr = text.split('')
      
            for (let i = splitedArr.length - 1; i >= 0; i--) {
              let num = text.charCodeAt(i)
              if (num >= 0xAC00 && num <= 0xD7A3) {
                num -= 0xAC00
                const curCho = Math.floor(num / JONG.length / JUNG.length)
                const curJung = Math.floor(num / JONG.length % JUNG.length)
                const curJong = num % JONG.length
      
                let splitedChr
      
                if (curJong !== 0)
                  splitedChr = [CHO[curCho], JUNG[curJung], JONG[curJong]]
                else
                splitedChr = [CHO[curCho], JUNG[curJung]]
      
                splitedArr.splice(i, 1, ...splitedChr)
              }
            }
      
            return splitedArr.join('')
          }
          return splitKorean(value.toLowerCase()).includes(splitKorean(query.toLowerCase()))
    }

    changeSelectedItem(elem: HTMLElement | null) {
        if (elem === this.selectedItem)
            return

        if (this.selectedItem)
            this.fakeElemNoHover(this.selectedItem)

        this.selectedItem = elem
        this.selectedIdx = -1

        if (this.selectedItem) {
            this.fakeElemHover(this.selectedItem)
            this.selectedIdx = this.queryElemList.indexOf(this.selectedItem)
        }
    }

    fakeElemNoHover(elem: HTMLElement) {
        elem.style.color = '#2c313d'
        elem.style.backgroundColor = '#fff'
        elem.style.borderBottomColor = '#000'
    }
    
    fakeElemHover(elem: HTMLElement) {
        elem.style.color = '#4f80ff'
        elem.style.backgroundColor = '#ecf8ff'
        elem.style.borderBottomColor = '#4f80ff'
    }

    getListContainer() {
        return this.scrollbar ? this.target.querySelector<HTMLElement>(".rcs-inner-container") : this.target
    }

    getListElem() {
        return this.getListContainer()?.querySelector<HTMLElement>('div')
    }

    applyQuery(query: Nullable<string>) {
        const listElem = this.getListElem()

        if (!listElem)
            throw ReferenceError("listElem이 존재하지 않습니다.")

        this.queryElemList = []

        let firstElement: HTMLElement | null = null

        for (const _item of listElem.childNodes) {
            const item = _item as HTMLElement // HTMLElement라고 가정
            const text = item.innerText ?? ""
            if (query == null || this.query(text, query)) {
                if (!firstElement)
                    firstElement = item
                
                this.queryElemList.push(item)

                item.style.display = ""
            }
            else {
                item.style.display = "none"
            }
        }

        this.changeSelectedItem(firstElement)
    }

    onInput() {
        const query = this.input.value

        const listContainer = this.getListContainer()
        const listElem = this.getListElem()

        if (!listContainer)
            throw ReferenceError("listContainer가 존재하지 않습니다.")

        if (!listElem)
            throw ReferenceError("listElem이 존재하지 않습니다.")

        this.applyQuery(query.length ? query : null)

        if (this.scrollbar) {
            const scrollbar = this.scrollbar

            if (this.queryElemList.length <= 5) { 
                scrollbar.style.height = ''
                listContainer.style.marginRight = '-20px'
                listElem.style.marginRight = ''

                for (const item of this.queryElemList)
                    item.style.marginRight = 'auto'
            }
            else {
                scrollbar.style.height = '260px'
                listContainer.style.marginRight = '-17px'
                listElem.style.marginRight = '0px'

                for (const item of this.queryElemList)
                    item.style.marginRight = ''
            }

            listContainer.dispatchEvent(new Event('scroll', { bubbles: true }))
        }
    }

    onKeydown(event: KeyboardEvent) {
        switch (event.code) {
            case 'Enter': {
                this.selectedItem?.click()
                break
            }

            case 'ArrowUp':
            case 'ArrowDown': {
                const destList = this.queryElemList
                const len = destList.length
                
                if (!len)
                    break

                const direction = event.code === 'ArrowUp' ? -1 : 1
                const nextIdx = ((this.selectedIdx + direction) % len + len) % len
                const nextItem = this.queryElemList[nextIdx]

                this.changeSelectedItem(nextItem)
                
                break
            }
        }
    }
}