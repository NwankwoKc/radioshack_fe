import { Socket, io } from "socket.io-client";
class Connectwebsocket {
  url: string;
  socket: Socket
  constructor(url: string) {
    this.url = url;
    this.socket = io(this.url, {
      transports: ['websocket'],
      withCredentials: false
    })
  }

  getuserId() {
    return localStorage.getItem('userId')
  }
  disconnect() {
    this.socket.on('disconnect', (reason) => {
      console.log(reason)
    })
  }

  async creategroup(roomname: string) {
    return this.socket.emit('createroom', { roomname }, (response: any) => {
      try {
        console.log(response)
        if (response.event === 'success')
          console.log(response.data)
      } catch (err: any) {
        if (response.event === 'error') {
          console.log(err)
        }
      }
    })
  }
  async joingroup(roomname: string, userid: string) {
    this.socket.emit('joinroom', { roomname, userid }, (response: any) => {
      try {
        if (response.event === 'success')
          console.log(response.data)
      } catch (err: any) {
        if (response.event === 'error') {
          console.log(err)
        }
      }
    })
  }
}
export default Connectwebsocket; 
