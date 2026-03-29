import type { Server as HttpServer } from 'http'
import { Server } from 'socket.io'

let io: Server | null = null

export function initSocket(server: HttpServer) {
  io = new Server(server, {
    cors: { origin: '*' }
  })

  io.on('connection', (socket) => {
    socket.on('join', ({ userId, rideId }) => {
      if (userId) socket.join(`user:${userId}`)
      if (rideId) socket.join(`ride:${rideId}`)
    })
  })

  return io
}

export function getIo(): Server {
  if (!io) throw new Error('Socket.io not initialized')
  return io
}
