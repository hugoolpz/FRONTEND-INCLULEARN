import AgoraRTC from 'agora-rtc-sdk-ng';

export const appId = '647a49b4faa74c46aea89e933551dc23'
export const token = null
export const rtcUid = Math.floor(Math.random() * 2032)
export const rtmUid = String(Math.floor(Math.random() * 2032))

export let audioTracks = {
  localAudioTrack: null,
  remoteAudioTracks: {}
}
