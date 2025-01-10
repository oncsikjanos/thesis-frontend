import { inject, Injectable } from '@angular/core';
import { SignalingService } from './signaling.service';

const iceServers = [
  { urls: "stun:stun1.l.google.com:3478" },
  { urls: "stun:stun2.l.google.com:19302" },
];


@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private signalingService: SignalingService;

  configuration = {'iceServers': iceServers}

  peerConnection = new RTCPeerConnection(this.configuration);

  localID1: string = 'user1';
  localID2: string = 'user2';

  remoteUserId: string = '';

  otherUserSocketID : string = '';


  constructor() {
    this.signalingService = inject(SignalingService);
    this.initializeListeners();
  }

  async getConnectedDevices(callback: (arg0: MediaDeviceInfo[], arg1: MediaDeviceInfo[]) => void) {
    await navigator.mediaDevices.getUserMedia({video: true, audio: true});

    const devices = await navigator.mediaDevices.enumerateDevices();
    const cameras = devices.filter(device => device.kind === 'videoinput');
    const microphones = devices.filter(device => device.kind === 'audioinput');
    callback(cameras, microphones);
  }

  // Open camera with at least minWidth and minHeight capabilities
  openCamera(cameraId: string, minWidth: number, minHeight: number, callback: (arg0: MediaStream) => void) {
    const constraints = {
        'audio': {'echoCancellation': true},
        'video': {
            'deviceId': cameraId,
            'width': {'min': minWidth},
            'height': {'min': minHeight}
            }
        }
        navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            callback(stream);
        })
        .catch(error => {
            console.error(error);
        })
  }

  async joinRoom(roomID: string, userID: string, otherUserID: string){
   const joinRoomData = await this.signalingService.emitJoinRoom( roomID, userID);
   if(joinRoomData.success && joinRoomData.offer){
     await this.createOffer(otherUserID, roomID);
   }
   else{
     console.log("Waiting for others to join")
   }
  }

  async createAnswer(offer : any){
    console.log('Creating answer');
    this.otherUserSocketID = offer.fromId;
    await this.peerConnection.setRemoteDescription(new RTCSessionDescription(offer.offer));
    const answer = await this.peerConnection.createAnswer();
    await this.peerConnection.setLocalDescription(answer);
    await this.signalingService.emitAnswer(answer, offer.fromId)
    console.log("Sent answer: ", answer);
    console.log('ICE Gathering State:', this.peerConnection.iceGatheringState)
  }

  async createOffer(otherUserID: string, roomID: string){
    console.log("Sending offer to others")
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(offer);
    await this.signalingService.emitOffer(offer, otherUserID, roomID);
    console.log("Sent offer: ",offer)
  }

  async sendIceCandidate(candidate: any, targetSocketID: string){
    console.log("Sending ice candidate");
    const result = await this.signalingService.emitIceCandidate(candidate, targetSocketID);
    console.log("Sent ice candidate result: ",result);
  }

  async addIceCandidate(candidate: any){
    console.log('Adding ice candidate');
    try {
      await this.peerConnection.addIceCandidate(candidate);
      console.log('Successfully added ice candidate');
    } catch (e) {
      console.error(e);
    }
  }

  async addAnswer(answer: any){
    console.log('got answer: ', answer)
    console.log('Adding answer to peerConnection object');
    this.otherUserSocketID = answer.fromId;
    const remoteDesc = new RTCSessionDescription(answer.answer);
    await this.peerConnection.setRemoteDescription(remoteDesc);
  }

  initializeListeners(){
    //Listen for users offer
    this.signalingService.onOffer().then(offer => {
      console.log('got offer:', offer);
      const answerResult = this.createAnswer(offer)
    });

    //Listen for users answers
    this.signalingService.onAnswer().then(answer => {
      console.log('got answer:', answer);
      const arrivedAnswerResult = this.addAnswer(answer)
      console.log('answer got added to peer');
      console.log('ICE Gathering State:', this.peerConnection.iceGatheringState)
    });

    // Listen for local ICE candidates on the local RTCPeerConnection
    this.peerConnection.addEventListener('icecandidate', event => {
      console.log('Local ice candidate event:', event);
      if (event.candidate) {
        console.log('sending ice candidate', event.candidate);
        const result = this.sendIceCandidate(event.candidate, this.otherUserSocketID);
      }
    });

    // Listen for remote ICE candidates and add them to the local RTCPeerConnection
    this.signalingService.onIceCandidate().then(iceCandidate => {
      console.log('got remote ice candidate', iceCandidate);
      const iceResult = this.addIceCandidate(iceCandidate.candidate);
    });

    console.log('Initialized listeners');
  }

}
