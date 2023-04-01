import React from 'react';
import { IndexSignatureDeclaration } from 'typescript';

type KeyTypes = number|string

export class Dictionary<T extends KeyTypes , K> {
    private data:Record<KeyTypes, K> = {}

    constructor() {}

    push(key: T, value: K) {
        this.data[key] = value
    }

    getKeys():Array<T> {
        return Object.keys(this.data) as Array<T>
    }

    getValue(key: T, defaultValue=null): K {
        return this.data[key]
    }

    getValues():Array<K> {
        return this.getKeys().map((key)=> (this.data[key]))
    }

    getFirst():K | undefined {
        const values = this.getKeys().map((key)=> (this.data[key]))

        if (values.length > 0) {
            return values[0]
        }
    }

    contains(key: T): boolean {
        let result = false
        this.getKeys().map((k: T) => {
            if (k === key.toString()) {
                result = true
                return
            }
        })
        return result
    }

    count():number {
        return this.getKeys().length
    }

    getLast() {
        const values = this.getKeys().map((key)=> (this.data[key]))

        if (values.length > 0) {
            return values[values.length - 1]
        }
    }

    copy():Dictionary<T, K> {
        let newData = new Dictionary<T, K>()
        this.getKeys().map(key => {
            newData.push(key, this.data[key])
        })
        return newData
    }

    delete(key: T) {
        delete this.data[key]
    }
}