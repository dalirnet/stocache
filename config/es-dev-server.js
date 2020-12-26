module.exports = {
    port: 9550,
    watch: true,
    middlewares: [
        function rewriteIndex(context, next) {
            if (context.url === '/' || context.url === '/index.html') {
                context.url = '/example/index.html'
            }

            return next()
        },
    ],
}
