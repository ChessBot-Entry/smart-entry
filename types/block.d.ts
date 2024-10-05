import { EntryBlock } from "./entryjs/index";

interface BlockExt extends Partial<EntryBlock> {
    errorHandler?: (sprite, script) => string | string[] | void
}