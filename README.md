# Stocache

stocache is a Redis/Memcache like cache for browser. it use local storage OR session storage for saving data

-   no dependency
-   fast and small (about 1k in gzip)
-   auto manage storage limit

### Installation

```sh
$ npm install stocache
```

OR

```sh
$ yarn add stocache
```

### How to use

```javascript
const cache = stocache()
```

#### arguments

First arguments: Scope

-   default: stocache

```javascript
const adminCache = stocache("Admin")
```

```javascript
const userCache = stocache("User")
```

Second arguments: Storage Type

-   default: localStorage

```javascript
const cache = stocache("admin", "sessionStorage")
```

Third arguments: Exceptions

-   default: False

```javascript
const cache = stocache("admin", "localStorage", True)
```

#### Methods

#### set

return True if saved data otherwise False

```javascript
cache.set(KEY, VALUE, TTL)
```

-   KEY must be String
-   TTL in second
    -   default is 60

#### get

return corresponding VALUE if KEY exist and not expired otherwise FALLBACK

```javascript
cache.get(KEY, FALLBACK)
```

-   FALLBACK default is False

#### unset

return True on success otherwise False

```javascript
cache.unset(KEY)
```

#### has

return True if KEY exist and not expired otherwise False

```javascript
cache.has(KEY)
```

#### flush

return True on success otherwise False

```javascript
cache.flush(SCOPE)
```

#### keep

updating expire time

```javascript
cache.keep(KEY, TTL)
```
