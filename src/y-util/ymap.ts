import { Map as YMap } from 'yjs';

interface YMap<T> {
	toJSON(): { [x: string]: T };
	keys(): IterableIterator<string>;
	values(): IterableIterator<T>;
	entries(): IterableIterator<T>;
	/**
   * Executes a provided function on once on overy key-value pair.
   *
   * @param {function(T,string,YMap<T>):void} f A function to execute on every element of this YArray.
   */
	forEach(f: (arg0: T, arg1: string, arg2: YMap<T>) => void);

	[Symbol.iterator](): IterableIterator<T>;

	/**
   * Remove a specified element from this YMap.
   *
   * @param {string} key The key of the element to remove.
   */
	delete(key: string);
	/**
   * Adds or updates an element with a specified key and value.
   *
   * @param {string} key The key of the element to add to this YMap
   * @param {T} value The value of the element to add
   */
	set(key: string, value: T);

	/**
   * Returns a specified element from this YMap.
   *
   * @param {string} key
   * @return {T|undefined}
   */
	get(key: string): T | undefined;

	/**
   * Returns a boolean indicating whether the specified key exists or not.
   *
   * @param {string} key The key to test.
   * @return {boolean}
   */
	has(key: string): boolean;
}

// export default YMap;
