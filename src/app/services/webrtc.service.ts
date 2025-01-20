import { Injectable } from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Subject} from 'rxjs';

const iceServers = [
  { urls: "stun:stun1.l.google.com:3478" },
  { urls: "stun:stun1.l.google.com:19302" },
];

const signalingServer = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class WebrtcService {
  private socket: Socket;

  private userDisconnectedSubject = new Subject<string>();
  userDisconnected$ = this.userDisconnectedSubject.asObservable();

  private userConnectedSubject = new Subject<boolean>();
  userConnected$ = this.userConnectedSubject.asObservable();

  configuration = {'iceServers': iceServers}

  peerConnections = new Map<string, RTCPeerConnection>();
  public userNames = new Map<string, string>();
  remoteStreams = new Map<string, MediaStream>();

  localStream: any;
  localTrack: any;

  messages : any[] = [];


  constructor() {
    this.socket = io(signalingServer); // Your WebSocket server URL

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('error', (error: any) => {
      console.error(error);
    });

    this.socket.on('user-joined', async (joinedSocketId, joinedUserName) => {
      console.log(joinedUserName+' joined.');
      const peerConnection = await this.createNewPeerConnection(joinedSocketId);

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(new RTCSessionDescription(offer))
      this.socket.emit('offer' , offer, joinedSocketId);

      this.userNames.set(joinedSocketId, joinedUserName);
    });

    this.socket.on('offer', async (offer, fromId, fromUserName) => {
      console.log('Got offer: ', offer);
      const peerConnection = await this.createNewPeerConnection(fromId);
      this.peerConnections.set(fromId, peerConnection);
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peerConnection.createAnswer();

      await peerConnection.setLocalDescription(new RTCSessionDescription(answer))

      this.socket.emit('answer', answer, fromId);

      this.userNames.set(fromId,fromUserName);
    });

    this.socket.on('answer', async (answer, fromId) => {
      console.log('Got asnwer: ', answer);
      const pc = this.peerConnections.get(fromId);

      if (!pc) {
        console.error('no peerconnection')
        return
      }

      if(pc.signalingState !== 'stable'){
        console.log('Setting remote description on answer');
        await pc.setRemoteDescription(new RTCSessionDescription(answer));
      }
    });

    this.socket.on('ice-candidate', async (candidate, fromId) => {
      console.log('got ice candidate', candidate);
      const pc = this.peerConnections.get(fromId);

      if (!pc) {
        console.error('no peerconnection')
        return
      }

      if (!candidate.candidate) {
        await pc.addIceCandidate(undefined)
      } else {
        console.log('Adding Ice Candidate', candidate)
        await pc.addIceCandidate(candidate)
      }

      console.log('ADDING ICE: ',candidate);
      await pc!.addIceCandidate(candidate);

    });

    this.socket.on('user-disconnected', async (disconnectedSocketId) => {
      const pc = this.peerConnections.get(disconnectedSocketId);
      pc!.close();
      this.userNames.delete(disconnectedSocketId);
      this.remoteStreams.delete(disconnectedSocketId);
      this.peerConnections.delete(disconnectedSocketId);

      this.userDisconnectedSubject.next(disconnectedSocketId);
    });

    this.socket.on('message', async (message, user) => {
      this.messages.push({user, message});
    });

    this.socket.on('username-taken', () => {
      this.userConnectedSubject.next(true);
    });

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

  async createNewPeerConnection(targetSocketId: any): Promise<RTCPeerConnection>{
    let pc = new RTCPeerConnection(this.configuration);
    this.peerConnections.set(targetSocketId, pc);

    if(this.localStream){
      this.localStream.getTracks().forEach((track: any) => {
        console.log('Adding track to peer', pc)
        pc.addTrack(track, this.localStream)
      })
      console.log('added local streams');
      console.log('local stream', this.localStream);
    }

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      console.log('Remote stream received onTrack:', remoteStream);
      this.remoteStreams.set(targetSocketId, remoteStream);
    }

    pc.onicecandidate = (event) => {
      //console.log('pc.onicecandidate', event);
      if(event.candidate){
        console.log('emitting icecandidate', event.candidate);
        this.socket.emit('ice-candidate', event.candidate, targetSocketId);
      }
    }

    pc.oniceconnectionstatechange = () => {
      console.log('ICE connection state: ', pc.iceConnectionState);
      console.log('ICE gathering state: ', pc.iceGatheringState);
    };

    return pc;
  }

  joinRoom(room: string, name:string){
    this.socket.emit('join-room', room, name);
  }

  sendMessage(message: any, room:string, name: string) {
    this.socket.emit('message', message, room, name);
  }


  destroyPeerConnections() {
    for(let peerConnection of this.peerConnections.values()){
      peerConnection.close();
      this.socket.close();
    }
  }
}
