# Stocache
stocache is a Redis/Memcache like cache for browser. it use local storage OR session storage for saving data
  - no dependency
  - fast and small (about 1k in gzip)
  - auto manage storage limit

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

```javascript
const adminCache = stocache('Admin')
```

```javascript
const userCache = stocache('User')
```

Second arguments: Storage Type
default: localStorage

```javascript
const cache = stocache('admin','sessionStorage')
```

Third arguments: Exceptions
default: False

```javascript
const cache = stocache('admin','localStorage', True)
```

#### Methods

#### set
```javascript
cache.set(KEY, VALUE, TTL)
```
return True if saved data otherwise False
 - KEY must be String
 - TTL in second, default is 60

#### get
```javascript
cache.get(KEY, FALLBACK)
```
return corresponding VALUE if KEY exist and not expired otherwise FALLBACK
 - FALLBACK default is False

#### unset
```javascript
cache.unset(KEY)
```
return True on success otherwise False

#### has
```javascript
cache.has(KEY)
```
return True if KEY exist and not expired otherwise False

#### flush
```javascript
cache.flush(SCOPE)
```
return True on success otherwise False

#### keep
```javascript
cache.keep(KEY, TTL)
```
updating expire time

