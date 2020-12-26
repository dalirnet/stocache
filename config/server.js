const path = require('path')
const liveServer = require('live-server')

liveServer.start({
    port: 9550,
    open: false,
    root: path.resolve('./example'),
    mount: [['/lib', path.resolve('./lib')]],
    watch: [path.resolve('./lib'), path.resolve('./example')],
    logLevel: 2,
})
