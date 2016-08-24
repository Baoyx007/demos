/**
 * Created by haven on 16/8/24.
 */

function LRUCache(limite) {
    this.size = 0
    this.limite = limite
    this.head = this.tail = undefined

    this._keymap = {}
}

/*
 * Returns the entry which was removed to make room for
 * the new entry. Otherwise undefined is returned.
 * */
LRUCache.prototype.put = function (key, value) {
    console.log(`before put ${key} :`)
    this.toString()
    let ret = this.get(key)
    if (!ret) {
        if (this.size >= this.limite) {
            ret = this.shift()
        } else {
            this.size++
        }

        const node = ret = {
            'key': key,
            'value': value
        }

        this._keymap[key] = node
        if (this.tail) {
            this.tail.newer = node
            node.older = this.tail
            node.newer = undefined

        } else {
            this.head = node
        }
        this.tail = node
    } else {
        ret.value = value
        this._keymap[key].value=value
    }

    console.log(`after put :`)
    this.toString()
    return ret.value
}

LRUCache.prototype.get = function (key) {
    const ret = this._keymap[key]
    // hit c   a->b->c->d->e
    if (ret) {
        console.log(`before get ${key}`)
        this.toString()
        // head
        if (ret === this.tail) {
            //
        } else if (ret === this.head) {
            let b = ret.newer

            ret.newer = b.newer
            ret.older = b

            b.older = undefined
            b.newer = ret
            this.head = b

        } else {

            ret.older.newer = ret.newer
            ret.newer.older = ret.older


            ret.older = ret.newer

            if (ret.newer.newer) {
                ret.newer = ret.newer.newer
                ret.newer.older = ret
            } else {
                ret.newer = undefined
                this.tail = ret
            }


            ret.older.newer = ret

        }
        console.log(`after get ${key}`)
        this.toString()
        return ret.value
    } else {
        return undefined
    }
}

LRUCache.prototype.shift = function () {
    const ret = this.head
    if (this.head && this.head.newer) {
        this.head = this.head.newer
        this.head.older = undefined
        ret.newer = undefined
        ret.older = undefined
        delete this._keymap[ret.key]
        this.size--
    }
    return ret
}

LRUCache.prototype.toString = function () {
    let p = this.head
    let str = ''
    while (p) {
        str += `${p.key}<-->`
        p = p.newer
    }
    console.log(str)
    console.log()
}

module.exports = LRUCache