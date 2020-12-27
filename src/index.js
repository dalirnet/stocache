const config = {
    scope: 'stocache',
    ttl: 3600,
    exception: false,
    storageType: 'localStorage',
}

const support = ((key) => {
    try {
        window[config.storageType].setItem(key, JSON.stringify(true))
        return JSON.parse(window[config.storageType].getItem(key))
    } catch (e) {
        return false
    }
})(config.scope + '-' + 'support')

const Stocache = (scope = config.scope, storageType = config.storageType, exception = config.exception) => {
    const generator = (scope) => ({
        key: (value = scope) => {
            let input = value === null ? scope : value
            let code = 0
            for (let i = 0; i < input.length; i++) {
                code = (code << 5) - code + input.charCodeAt(i)
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
        set: (value = null) => {
            try {
                window[storageType].setItem(key, json(value).encode())
                return true
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('storage.set', message)
                return false
            }
        },
        unset: () => {
            try {
                window[storageType].removeItem(key)
                return true
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('storage.unset', message)
                return false
            }
        },
        get: (fallback = false) => {
            return json(window[storageType].getItem(key)).decode(fallback)
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

        const clean = ({ flush = false, expireSoon = false } = {}) => {
            let changed = false
            let expireSoonKey = null
            let expireSoonKTime = 0
            for (let key of Object.keys(context)) {
                if (flush || context[key] < now) {
                    changed = true
                    unset(key)
                } else if (expireSoon && (expireSoonKTime === 0 || closestItem.value > context[key])) {
                    changed = true
                    expireSoonKey = key
                    expireSoonKTime = context[key]
                }
            }
            return changed ? unset(expireSoonKey) && commit() : true
        }

        const set = (value, ttl) => {
            if (support) {
                if (scope !== key) {
                    let writed = storage(keys.storage).set(value)
                    if (!writed) {
                        clean()
                        writed = storage(keys.storage).set(value)
                    }
                    if (!writed) {
                        clean({ expireSoon: true })
                        writed = storage(keys.storage).set(value)
                    }
                    if (!writed) {
                        clean({ flush: true })
                        writed = storage(keys.storage).set(value)
                    }
                    return writed ? keep(ttl, true) : false
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
            return clean() && context[key] && context[key] >= now
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
        set: (key = null, value = null, ttl = config.ttl) => middleware(key).set(value, ttl),
        unset: (key = null) => middleware(key).unset(),
        has: (key = null) => middleware(key).has(),
        keep: (key = null, ttl = config.ttl) => middleware(key).keep(ttl),
        get: (key = null, fallback = false) => middleware(key).get(fallback),
        flush: (scope = config.scope) => middleware(scope).clean({ flush: true }),
    }
}

export default Stocache
