import http from 'node:http'

const server = http.createServer(async (req, res) => {
    return res.end('Hello world')
})

server.listen(3333)