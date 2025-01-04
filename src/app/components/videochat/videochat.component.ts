import { Component, inject, ViewChild, ElementRef} from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { FormsModule } from '@angular/forms';
import { SignalingService } from '../../services/signaling.service';
import {user} from '@angular/fire/auth';

@Component({
  selector: 'app-videochat',
  imports: [FormsModule],
  templateUrl: './videochat.component.html',
  styleUrl: './videochat.component.scss'
})
export class VideochatComponent {
  @ViewChild('localVideo') localVideo: ElementRef | null = null;
  @ViewChild('remoteVideo') remoteVideo: ElementRef | null = null;


  localID1: string = 'user1';
  localID2: string = 'user2';

  remoteID: string = '';

  roomID: string = 'USDFWAE';

  connectedCameras: MediaDeviceInfo[] = [];
  connectedMicrophones: MediaDeviceInfo[] = [];

  selectedCamera: string  = '';
  selectedMicrophone: string  = '';

  private localStream: MediaStream | null = null;
  private remoteStream: MediaStream | null = null;

  isMuted: boolean = true;
  isCameraOn: boolean = false;

  private webrtcService: WebrtcService = inject(WebrtcService);
  private signalingService: SignalingService = inject(SignalingService);

  constructor() {}


  ngOnInit() {
    /*this.webrtcService.getConnectedDevices((cameras, microphones) => {
      this.connectedCameras = cameras;
      this.connectedMicrophones = microphones;
      console.log("videoinputs:", this.connectedCameras);
      console.log("audioinputs:", this.connectedMicrophones);
    });*/

    navigator.mediaDevices.getUserMedia({video: true, audio: true}).then( stream => {
      this.localStream = stream;
      stream.getTracks().forEach( track => {
        this.webrtcService.peerConnection.addTrack(track, stream);
      })
      if(this.localVideo){
        this.localVideo.nativeElement.srcObject = stream;
      }
    });

    // Listen if we get connected to our peer
    this.webrtcService.peerConnection.addEventListener('connectionstatechange', event => {
      if (this.webrtcService.peerConnection.connectionState === 'connected') {
        console.log("connected to the other peer");
      }
    });

    // Listenin to peer track changes
    this.webrtcService.peerConnection.addEventListener('track', async (event) => {
      const [remoteStream] = event.streams;
      if(this.remoteVideo){
        this.remoteVideo.nativeElement.srcObject = remoteStream;
      }
    });
  }

  startCamera() {
    this.webrtcService.openCamera(this.connectedCameras[0].deviceId, 600, 400, (stream) => {
      this.localStream = stream;
      console.log("stream:", stream);
      if(this.localVideo){
        this.localStream.getTracks().forEach(track => {
          if(this.localStream){
            this.webrtcService.peerConnection.addTrack(track, this.localStream);
          }
          console.log(track.getSettings());
        })
        this.localVideo.nativeElement.srcObject = stream;
        this.isCameraOn = !this.isCameraOn;
      }
    });
  }

  stopCamera() {
    this.localStream?.getTracks().forEach(track => {
      track.stop();
    });
    this.isCameraOn = !this.isCameraOn;
    if (this.localVideo) {
      this.localVideo.nativeElement.srcObject = null;
    }
  }

  muteToggle() {
    this.isMuted = !this.isMuted;
    if(this.localVideo){

    }
  }

  changeCamera(cameraId: any) {
    console.log("cameraId:", cameraId.target.value);
  }

  changeMicrophone(microphoneId: any) {
    console.log("cameraId:", microphoneId.target.value);
    //newMicrophone
  }
  async joinRoomUser(userID: string, otherUserID: string){
    await this.webrtcService.joinRoom(this.roomID, userID, otherUserID);
  }

  sendMessage(){
    this.signalingService.emitMessage();
  }
}
