export const appId = '37df001e0dc64c40ac4844eb148502c1'
export const token = null
export const rtcUid = Math.floor(Math.random() * 2032)
export const rtmUid = String(Math.floor(Math.random() * 2032))

export let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {}
}

export let videoTracks = {
  localVideoTrack: null,
  remoteVideoTracks: {}
}
