const config = {
    scope: 'stocache',
    ttl: 60,
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
    storageType = storageType == 'localStorage' || storageType == 'sessionStorage' ? storageType : config.storageType

    const generator = (scope) => {
        const key = (value = scope) => {
            let input = value === null ? scope : value
            let code = 0
            for (let i = 0; i < input.length; i++) {
                code = (code << 5) - code + input.charCodeAt(i)
                code = code & code
            }
            return scope + '-' + (code > 0 ? code : 'i' + Math.abs(code))
        }

        const exception = (name = null, message = null) => {
            return {
                scope,
                name,
                message,
            }
        }

        return { key, exception }
    }

    const json = (value) => {
        const encode = (fallback = '') => {
            try {
                return JSON.stringify(value)
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('json.encode', message)
                return fallback
            }
        }

        const decode = (fallback = {}) => {
            try {
                return JSON.parse(value)
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('json.decode', message)
                return fallback
            }
        }

        return { encode, decode }
    }

    const storage = (key = scope) => {
        const set = (value = null) => {
            try {
                window[storageType].setItem(key, json(value).encode())
                return true
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('storage.set', message)
                return false
            }
        }

        const unset = () => {
            try {
                window[storageType].removeItem(key)
                return true
            } catch ({ message }) {
                if (exception) throw generator(scope).exception('storage.unset', message)
                return false
            }
        }

        const get = (fallback = false) => {
            return json(window[storageType].getItem(key)).decode(fallback)
        }

        return { set, unset, get }
    }

    const middleware = (key = scope, now = Math.floor(Date.now() / 1000)) => {
        let keys = {
            shadow: generator(scope).key(),
            storage: generator(scope).key(key),
        }

        let context = {
            object: storage(keys.shadow).get() || {},
            remove: (key) => {
                delete context.object[key]
                return true
            },
            add: (key, value) => {
                context.object[key] = value
                return true
            },
        }

        const commit = () => {
            if (support) {
                return storage(keys.shadow).set(context.object)
            }
            return false
        }

        const unset = (key = keys.storage) => {
            if (support) {
                return context.remove(key) && commit() && storage(key).unset()
            }
            return false
        }

        const keep = (ttl, condition = has(keys.storage)) => {
            if (support && condition) {
                return context.add(keys.storage, now + parseInt(ttl)) && commit()
            }
            return false
        }

        const has = (key = keys.storage) => {
            if (clean() && context.object[key]) {
                return context.object[key] - now
            }
            return false
        }

        const get = (fallback) => {
            if (has(keys.storage)) {
                return storage(keys.storage).get(fallback)
            } else {
                return fallback
            }
        }

        const clean = (flush = false, expireSoon = false) => {
            let changed = false
            let expireSoonKey = null
            let expireSoonKTime = 0
            for (let key of Object.keys(context.object)) {
                if (flush || context.object[key] < now) {
                    changed = true
                    context.remove(key)
                    storage(key).unset()
                } else if (expireSoon && (expireSoonKTime === 0 || closestItem.value > context.object[key])) {
                    changed = true
                    expireSoonKey = key
                    expireSoonKTime = context.object[key]
                }
            }
            return changed ? unset(expireSoonKey) : true
        }

        const set = (value, ttl) => {
            if (support) {
                if (scope === key) {
                    if (exception) throw generator(scope).exception('middleware.set', 'KeyConflict')
                } else {
                    let writed = storage(keys.storage).set(value)
                    if (!writed) {
                        clean()
                        writed = storage(keys.storage).set(value)
                    }
                    if (!writed) {
                        clean(false, true)
                        writed = storage(keys.storage).set(value)
                    }
                    if (!writed) {
                        clean(true)
                        writed = storage(keys.storage).set(value)
                    }
                    return writed ? keep(ttl, true) : false
                }
            }
            return false
        }

        return { set, unset, has, keep, get }
    }

    return {
        set: (key = null, value = null, ttl = config.ttl) => middleware(key).set(value, ttl),
        unset: (key = null) => middleware(key).unset(),
        has: (key = null) => middleware(key).has(),
        keep: (key = null, ttl = config.ttl) => middleware(key).keep(ttl),
        get: (key = null, fallback = false) => middleware(key).get(fallback),
        flush: (scope = config.scope) => middleware(scope).clean(true),
    }
}

export default Stocache
