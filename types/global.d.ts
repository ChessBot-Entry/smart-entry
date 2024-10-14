/* eslint no-var: "off" */

import { IEntry } from "./entryjs/entry";

declare global {
    type Nullable<T> = T | null | undefined;

    var SmartEntry: SmartEntry
    var Entry: IEntry
    var Lang: any
    var Lang: any;
    var entrylms: any;
    var EntryStatic: any;
    var ImageCapture: any;
    var sendSync: any | undefined;
    var popupHelper: import('../src/class/popup_helper').default | undefined;
}

