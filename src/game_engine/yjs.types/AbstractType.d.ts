export function callTypeObservers<EventType>(type: AbstractType<EventType>, transaction: Transaction, event: EventType): void;
/**
 * @template EventType
 * Abstract Yjs Type class
 */
export class AbstractType<EventType> {
    /**
     * @type {Item|null}
     */
    _item: Item | null;
    /**
     * @private
     * @type {Map<string,Item>}
     */
    _map: Map<string, Item>;
    /**
     * @private
     * @type {Item|null}
     */
    _start: Item | null;
    /**
     * @private
     * @type {Doc|null}
     */
    doc: Doc | null;
    _length: number;
    /**
     * Event handlers
     * @type {EventHandler<EventType,Transaction>}
     */
    _eH: EventHandler<EventType, Transaction>;
    /**
     * Deep event handlers
     * @type {EventHandler<Array<YEvent>,Transaction>}
     */
    _dEH: EventHandler<Array<YEvent>, Transaction>;
    /**
     * Integrate this type into the Yjs instance.
     *
     * * Save this struct in the os
     * * This type is sent to other client
     * * Observer functions are fired
     *
     * @param {Doc} y The Yjs instance
     * @param {Item|null} item
     * @private
     */
    _integrate(y: Doc, item: Item): void;
    /**
     * @return {AbstractType<EventType>}
     * @private
     */
    _copy(): AbstractType<EventType>;
    /**
     * @param {encoding.Encoder} encoder
     * @private
     */
    _write(encoder: any): void;
    /**
     * The first non-deleted item
     */
    get _first(): Item;
    /**
     * Creates YEvent and calls all type observers.
     * Must be implemented by each type.
     *
     * @param {Transaction} transaction
     * @param {Set<null|string>} parentSubs Keys changed on this type. `null` if list was modified.
     *
     * @private
     */
    _callObserver(transaction: Transaction, parentSubs: Set<string>): void;
    /**
     * Observe all events that are created on this type.
     *
     * @param {function(EventType, Transaction):void} f Observer function
     */
    observe(f: (arg0: EventType, arg1: Transaction) => void): void;
    /**
     * Observe all events that are created by this type and its children.
     *
     * @param {function(Array<YEvent>,Transaction):void} f Observer function
     */
    observeDeep(f: (arg0: YEvent[], arg1: Transaction) => void): void;
    /**
     * Unregister an observer function.
     *
     * @param {function(EventType,Transaction):void} f Observer function
     */
    unobserve(f: (arg0: EventType, arg1: Transaction) => void): void;
    /**
     * Unregister an observer function.
     *
     * @param {function(Array<YEvent>,Transaction):void} f Observer function
     */
    unobserveDeep(f: (arg0: YEvent[], arg1: Transaction) => void): void;
    /**
     * @abstract
     * @return {Object | Array | number | string}
     */
    toJSON(): any;
}
export function typeListToArray(type: AbstractType<any>): any[];
export function typeListToArraySnapshot(type: AbstractType<any>, snapshot: Snapshot): any[];
export function typeListForEach(type: AbstractType<any>, f: (arg0: any, arg1: number, arg2: any) => void): void;
export function typeListMap<C, R>(type: AbstractType<any>, f: (arg0: C, arg1: number, arg2: AbstractType<any>) => R): R[];
export function typeListCreateIterator(type: AbstractType<any>): IterableIterator<any>;
export function typeListForEachSnapshot(type: AbstractType<any>, f: (arg0: any, arg1: number, arg2: AbstractType<any>) => void, snapshot: Snapshot): void;
export function typeListGet(type: AbstractType<any>, index: number): any;
export function typeListInsertGenericsAfter(transaction: Transaction, parent: AbstractType<any>, referenceItem: Item, content: (string | number | boolean | any[] | Uint8Array | {
    [x: string]: any;
})[]): void;
export function typeListInsertGenerics(transaction: Transaction, parent: AbstractType<any>, index: number, content: (string | number | any[] | Uint8Array | {
    [x: string]: any;
})[]): void;
export function typeListDelete(transaction: Transaction, parent: AbstractType<any>, index: number, length: number): void;
export function typeMapDelete(transaction: Transaction, parent: AbstractType<any>, key: string): void;
export function typeMapSet(transaction: Transaction, parent: AbstractType<any>, key: string, value: any): void;
export function typeMapGet(parent: AbstractType<any>, key: string): string | number | any[] | Uint8Array | AbstractType<any> | {
    [x: string]: any;
};
export function typeMapGetAll(parent: AbstractType<any>): {
    [x: string]: string | number | any[] | Uint8Array | AbstractType<any> | {
        [x: string]: any;
    };
};
export function typeMapHas(parent: AbstractType<any>, key: string): boolean;
export function typeMapGetSnapshot(parent: AbstractType<any>, key: string, snapshot: Snapshot): string | number | any[] | Uint8Array | AbstractType<any> | {
    [x: string]: any;
};
export function createMapIterator(map: Map<string, Item>): IterableIterator<any[]>;
import { Transaction } from "../utils/Transaction.js.js";
import { Item } from "../structs/Item.js.js";
import { Doc } from "../utils/Doc.js.js";
import { EventHandler } from "../utils/EventHandler.js.js";
import { YEvent } from "../utils/YEvent.js.js";
import { Snapshot } from "../utils/Snapshot.js.js";
