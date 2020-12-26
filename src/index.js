// perfix
const PERFIX = 'stocache'

// support
const support = ((key) => {
    try {
        localStorage.setItem(key, JSON.stringify(true))
        return JSON.parse(localStorage.getItem(key))
    } catch (e) {
        return false
    }
})(PERFIX + '-' + 'support')

// json
const json = (value) => ({
    encode: (fallback = '') => {
        try {
            return JSON.stringify(value)
        } catch (e) {
            return fallback
        }
    },
    decode: (fallback = {}) => {
        try {
            return JSON.parse(value)
        } catch (e) {
            return fallback
        }
    },
})

// generator
const generator = (perfix = PERFIX) => ({
    key: (value = perfix) => {
        let code = 0
        for (let i = 0; i < value.length; i++) {
            code = (code << 5) - code + value.charCodeAt(i)
            code = code & code
        }
        return perfix + '-' + (code > 0 ? code : 'i' + Math.abs(code))
    },
})

// stocache
const stocache = (perfix = PERFIX) => {
    const storage = (key = perfix) => {
        const set = (value = null, retry = false) => {
            try {
                localStorage.setItem(key, json(value).encode())
                return true
            } catch ({ message }) {
                return false
            }
        }

        const get = (fallback = false) => {
            return json(localStorage.getItem(key) || fallback).decode(fallback)
        }

        return { set, get }
    }

    const shadow = (key = perfix) => {
        const now = Math.floor(Date.now() / 1000)

        const keys = {
            shadow: generator(perfix).key(),
            storage: generator(perfix).key(key),
        }

        let context = storage(keys.shadow).get({})

        const set = (value, ttl) => {
            if (storage(keys.storage).set(value, true)) {
                return keep(ttl, true)
            }
            return false
        }

        const keep = (ttl, condition = context[keys.storage]) => {
            if (condition) {
                context[keys.storage] = now + parseInt(ttl)
                return storage(keys.shadow).set(context)
            }
            return false
        }

        const get = (fallback) => {
            // console.log(map[keys.storage])
            return storage(keys.storage).get(fallback)
        }

        return { set, keep, get }
    }

    return {
        support,
        set: (key, value = null, ttl = 300) => (support ? shadow(key).set(value, ttl) : false),
        keep: (key, ttl = 300) => (support ? shadow(key).keep(ttl) : false),
        get: (key, fallback = false) => (support ? shadow(key).get(fallback) : fallback),
    }
}

export default stocache
