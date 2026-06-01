import { io } from "socket.io-client"

class Webrtc {
  configuration = { 'iceServers': [{ 'urls': "stun:stun.l.google.com:19302" }] }
  peerConnetction = new RTCPeerConnection(this.configuration)
  socket = io('', {
    autoConnect: false
  })
  constructor() {
    this.icetirckle()
    this.icetrickle_recieve()
    this.connection()
    this.socket.connect()
  }
  async makeoffer() {
    const offer = await this.peerConnetction.createOffer()
    await this.peerConnetction.setLocalDescription(offer)
    //sendoffer using ws {offer:offer}
    this.socket.on('message', async data => {
      if (data.answer) {
        const remotdesc = new RTCSessionDescription(data.answer)
        await this.peerConnetction.setRemoteDescription(remotdesc)
      }
    })
    this.socket.emit('sendmessage', {
      to: 'targetuserid',
      from: 'currentuserid',
      text: { 'offer': offer }
    })
    //
  }

  async recieveoffer() {
    this.socket.on('message', async data => {
      if (data.offer) {
        this.peerConnetction.setRemoteDescription(new RTCSessionDescription(data.offer))
        const answer = await this.peerConnetction.createAnswer()
        await this.peerConnetction.setLocalDescription(answer)
        this.socket.emit('sendmessage', {
          to: 'targetuserid',
          from: 'currentuserid',
          text: { 'answer': answer }
        })
      }
    })
  }
  icetirckle() {
    this.peerConnetction.addEventListener('icecandidate', event => {

      if (event.candidate) {
        this.socket.emit('localicecandidate', {
          to: 'targetuserid',
          from: 'currentuserid',
          text: { 'new_ice_candidate': event.candidate }
        })
      }
    })
  }
  icetrickle_recieve() {
    this.socket.on('message', async data => {
      if (data.new_ice_candidate) {
        try {
          await this.peerConnetction.addIceCandidate(data.new_ice_candidate)
        } catch (error) {
          console.error('Error adding recieved ice candidate')
        }
      }
    })
  }
  connection() {
    this.peerConnetction.addEventListener('connection', () => {
      if (this.peerConnetction.connectionState === 'connected') {
        console.log('connection')
      }
    }
    )
  }
}
export default Webrtc
