import { Server, Socket } from 'socket.io'
import logger from '../../lib/logger'
import { verify } from 'jsonwebtoken'
import config from 'config'
import ISocket from '../interfaces/socket.interface'

export default class SocketIO {
  private io: Server
  private clients: ISocket[]

  constructor( server: Server ) {
    this.clients = []
    this.io = server
    this.io.use((socket, next) => {
        const token = (socket.handshake.headers.authorization ? socket.handshake.headers.authorization : '')
        verify(token, config.get('jwt.accessTokenSecret'), ( err: any, decoded: any ) => {
            if ( err ) {
                const err = new Error("token error")
                socket.disconnect
                return next(err)
            }

            decoded.user.socket = socket
            let client: ISocket = decoded.user

            const clientFound = this.getClientByEmail(client.email)

            if(clientFound){
              const err = new Error("Currently logged in user")
              socket.disconnect
              return next (err)
            }

            this.clients.push(client)
            next()
        })
    })
    this.listenSockets()
  }

  private listenSockets() {
    this.io.on('connection', ( client: Socket ) => {
        const clientFound = this.getDataClient(client.id)

        clientFound && logger.info(`el cliente ${clientFound.email} se ha conectado`)

        client.emit('clientOnLine', {clients: this.clients.length})

        this.clientWritting(client.id)
        
        this.disconnectClient(clientFound)

        this.receiveMessage(client)
    })
  }

  private getDataClient( socketId: string ): ISocket | undefined {
    const clientFound = this.clients.find( client => client.socket.id === socketId )
    return clientFound
  }

    private getClientByEmail(email:string): Boolean{
    const clientFound = this.clients.find ( client => client.email === email )
  
    if(clientFound){
      return true
    }else{
      return false  
    }
  }

  private removeClientFromList( socketId: string ) {
    const clientFound = this.clients.findIndex( client => client.socket.id === socketId )
    return this.clients.splice(clientFound, 1)
  }

  private disconnectClient( client: any ) {
    return client.socket.on('disconnect', () => {
      this.removeClientFromList(client.socket.id)
      console.log(this.clients)
        logger.info(`el cliente ${client.email} se fue`)
    })
  }

  private clientWritting(socketId: string) {
    this.io.on('clientWritting', () => {
      const client = this.getClientByEmail(socketId)
      this.io.emit('clientWritting', ({
        email:""
      }))
    })
  }

  private receiveMessage(client: Socket) { 
    client.on('sendMessage', (message: string) => {
      const clientData = this.getDataClient(client.id)
      if (clientData) {
        //this.io.emit('receiveMessage', { sender: clientData.email, message: message })  
        client.broadcast.emit('receiveMessage', { sender: clientData.email, message: message })
      
      }
    });
  }
}