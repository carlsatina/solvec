import { createServer } from 'http'
import app from './app'
import { initSocket } from './socket'

const port = process.env.PORT ? Number(process.env.PORT) : 4000

const server = createServer(app)
initSocket(server)

server.listen(port, () => {
  console.log(`API listening on :${port}`)
})
