import {
  Component,
  inject,
  ViewChild,
  ElementRef,
  OnInit,
  ChangeDetectorRef, OnDestroy
} from '@angular/core';
import { WebrtcService } from '../../services/webrtc.service';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {AuthService} from '../../services/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import { CommonModule } from '@angular/common';
import {ShowVideoComponent} from './show-video/show-video.component';
import {DatabaseService} from '../../services/database.service';

@Component({
  selector: 'app-videochat',
  imports: [
    FormsModule,
    MatButtonModule,
    CommonModule,
    ShowVideoComponent,
  ],
  templateUrl: './videochat.component.html',
  styleUrl: './videochat.component.scss'
})
export class VideochatComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo: ElementRef | null = null;
  @ViewChild('remoteVideo') remoteVideo: ElementRef | null = null;

  remoteUserName: string| null = null;
  remoteSocket: string| null = null;

  activatedRoute= inject(ActivatedRoute);
  databaseService = inject(DatabaseService);
  router = inject(Router);
  authService = inject(AuthService);

  room: any;

  alreadyConnected = false;

  connectedCameras: MediaDeviceInfo[] = [];
  connectedMicrophones: MediaDeviceInfo[] = [];

  localStream: MediaStream | null = null;

  isMuted: boolean = true;
  isCameraOn: boolean = false;

  message: string | null = null;

  webrtcService: WebrtcService = inject(WebrtcService);

  constructor() {}


  ngOnInit() {
    this.room = this.activatedRoute.snapshot.paramMap.get('id');

    this.databaseService.canTakeTest(this.room).subscribe({
      next: () => {
        navigator.mediaDevices.getUserMedia({video: true, audio: true}).then( stream => {
          this.localStream = stream;
          this.webrtcService.localStream = stream;
          console.log('LocalStream: ', stream);
          this.webrtcService.joinRoom(this.room, this.authService.currentUserSignal()!.name);
          /*stream.getTracks().forEach( track => {
            this.webrtcService.localTrack = track;
            this.webrtcService.peerConnection.addTrack(track, stream);
          })*/
          if(this.localVideo){
            this.localVideo.nativeElement.srcObject = stream;
          }
          if(this.authService.currentUserSignal()?.role.toLowerCase() === 'student'){
            this.databaseService.attendVideoCall(this.room).subscribe({})
          }
        });
      },
      error: err => {
        this.stopCamera();
        this.localStream = null;
        alert(err.error.error);
        this.router.navigate(['/']);
      }
    })



    this.webrtcService.userDisconnected$.subscribe((disconnectedSocketId) => {
      // You can also remove their video stream or update the UI as needed
      this.handleUserDisconnection(disconnectedSocketId);
    });

    this.webrtcService.userConnected$.subscribe((state) => {
      this.alreadyConnected = state;
    })
  }

  ngOnDestroy() {
    this.webrtcService.destroyPeerConnections();
    this.stopCamera();
    this.localStream = null;
  }

  handleUserDisconnection(socketId: string): void {
    // Logic to remove user's video or update UI
    console.log(`Handling disconnection for user: ${socketId}`);
    if(this.remoteSocket === socketId){
      this.remoteSocket = null;
      this.remoteUserName = null;
    }

    if(this.remoteVideo){
      this.remoteVideo.nativeElement.srcObject = null;
    }
  }

  startCamera() {
    this.webrtcService.openCamera(this.connectedCameras[0].deviceId, 1920, 1080, (stream) => {
      this.localStream = stream;
      console.log("stream:", stream);
      if(this.localVideo){
        this.localStream.getTracks().forEach(track => {
          if(this.localStream){
            //this.webrtcService.peerConnection.addTrack(track, this.localStream);
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

  makeMainStream(idStreamArray: any) {
    if(this.remoteVideo){
      this.remoteVideo.nativeElement.srcObject = idStreamArray[1];
    }
    this.remoteUserName = this.webrtcService.userNames.get(idStreamArray[0]) ?? '' ;
    this.remoteSocket = idStreamArray[0];

  }

  sendMessage() {
    console.log(this.message);
    if(this.message && this.message.length > 0) {
      this.webrtcService.sendMessage(this.message, this.room, this.authService.currentUserSignal()!.name);
    }

    this.message = '';
  }

  generateRandomColor(username: string): string {
    // Hash the username to get a deterministic value
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Generate a hex color based on the hash
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).slice(-2);
    }

    return color;
  }

  get remoteMedias() {
    return Array.from(this.webrtcService.remoteStreams.entries());
  }
}
