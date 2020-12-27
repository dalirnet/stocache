const config = {
    scope: 'stocache',
    ttl: 3600,
    exception: false,
}

const support = ((key) => {
    try {
        localStorage.setItem(key, JSON.stringify(true))
        return JSON.parse(localStorage.getItem(key))
    } catch (e) {
        return false
    }
})(config.scope + '-' + 'support')

const Stocache = (scope = config.scope, exception = config.exception) => {
    const generator = (scope) => ({
        key: (value = scope) => {
            let code = 0
            for (let i = 0; i < value.length; i++) {
                code = (code << 5) - code + value.charCodeAt(i)
                code = code & code
            }
            return scope + '-' + (code > 0 ? code : 'i' + Math.abs(code))
        },
        exception: (name = null, message = null) => ({
            scope,
            name,
            message,
        }),
    })

    const json = (value) => ({
        encode: (fallback = '') => {
            try {
                return JSON.stringify(value)
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('json.encode', message)
                return fallback
            }
        },
        decode: (fallback = {}) => {
            try {
                return JSON.parse(value)
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('json.decode', message)
                return fallback
            }
        },
    })

    const storage = (key = scope) => ({
        set: (value = null, retry = false) => {
            try {
                localStorage.setItem(key, json(value).encode())
                return true
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('storage.set', message)
                return false
            }
        },
        unset: () => {
            try {
                localStorage.removeItem(key)
                return true
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('storage.unset', message)
                return false
            }
        },
        get: (fallback = false) => {
            return json(localStorage.getItem(key)).decode(fallback)
        },
    })

    const middleware = (key = scope, now = Math.floor(Date.now() / 1000)) => {
        let keys = {
            shadow: generator(scope).key(),
            storage: generator(scope).key(key),
        }
        let context = storage(keys.shadow).get() || {}

        const commit = () => {
            if (support) {
                return storage(keys.shadow).set(context)
            }
            return false
        }

        const unset = (key) => {
            if (support) {
                delete context[key]
                return storage(key).unset()
            }
            return false
        }

        const clean = (flush = false) => {
            let unsetStatus = true
            for (let key of Object.keys(context)) {
                if (flush || context[key] < now) {
                    unsetStatus = unset(key)
                }
            }
            return unsetStatus && commit()
        }

        const set = (value, ttl) => {
            if (support) {
                if (scope !== key) {
                    return storage(keys.storage).set(value, true) ? keep(ttl, true) : false
                } else {
                    if (exception) throw generator(scope).exception('middleware.set', 'KeyConflict')
                }
            }

            return false
        }

        const keep = (ttl, condition = has(keys.storage)) => {
            if (support && condition) {
                context[keys.storage] = now + parseInt(ttl)
                return storage(keys.shadow).set(context)
            }
            return false
        }

        const has = (key) => {
            return clean() && support && context[key] && context[key] >= now
        }

        const get = (fallback) => {
            if (support && has(keys.storage)) {
                return storage(keys.storage).get(fallback)
            }
            return fallback
        }

        return { set, unset, has, keep, get }
    }

    return {
        support,
        keyGenerator: (key = config.scope) => generator(scope).key(key),
        set: (key = null, value = null, ttl = config.ttl) => middleware(key).set(value, ttl),
        unset: (key = null) => middleware(key).unset(),
        has: (key = null) => middleware(key).has(),
        keep: (key = null, ttl = config.ttl) => middleware(key).keep(ttl),
        get: (key = null, fallback = false) => middleware(key).get(fallback),
        flush: (scope = config.scope) => middleware(scope).clean(true),
        cleanExpired: (scope = config.scope) => middleware(scope).clean(),
    }
}

export default Stocache
