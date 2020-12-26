module.exports = {
    port: 9550,
    watch: true,
    middlewares: [
        function rewriteIndex(context, next) {
            if (context.url === '/' || context.url === '/index.html') {
                context.url = '/example/index.html'
            }

            if (context.url === '/favicon.ico') {
                context.url = '/example/favicon.ico'
            }

            return next()
        },
    ],
}
