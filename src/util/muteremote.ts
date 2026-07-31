import instance from "./axios";


async function muteremote(roomname: string, identity: string, tracksid: string, mute: boolean) {
  const req = await instance.post("url", {
    roomname,
    identity,
    tracksid,
    mute
  })
  return req
}


export default muteremote;
