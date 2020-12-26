const PERFIX = 'stocache'
const support = ((match) => {
    try {
        localStorage.setItem(PERFIX, match)
        return match === localStorage.getItem(PERFIX) && typeof JSON.parse === 'function' && typeof JSON.stringify === 'function'
    } catch (e) {
        return false
    }
})('support')
const stocache = (perfix = PERFIX) => {
    const keyGenerator = (key = '', length = 0) => {
        let code = 0

        for (let i = 0; i < key.length; i++) {
            code = (code << 5) - code + key.charCodeAt(i)
            code = code & code
        }

        return perfix + '-' + (code > 0 ? code : 'i' + Math.abs(code))
    }

    const encode = (value) => {
        try {
            return JSON.stringify(value)
        } catch (e) {
            return null
        }
    }

    const decode = (value) => {
        try {
            return JSON.parse(value)
        } catch (e) {
            return {}
        }
    }

    const set = (key, value, expiration) => {
        try {
            localStorage.setItem(keyGenerator(key), match)
            return true
        } catch (e) {
            return false
        }
    }
    const get = (key) => {}
    const unset = (key = []) => {}

    return {
        support,
        keyGenerator,
        set: support ? set : () => false,
        unset: support ? unset : () => false,
        get: support ? get : () => false,
    }
}

export default stocache
