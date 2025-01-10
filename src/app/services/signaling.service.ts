import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
//import { environment } from '../../environments/environment';


const signalingServer = 'http://localhost:3000';

@Injectable({
  providedIn: 'root'
})
export class SignalingService {
  private socket: Socket;

  constructor() {
    this.socket = io(signalingServer); // Your WebSocket server URL

    this.socket.on('connect', () => {
      console.log('Connected to signaling server');
    });

    this.socket.on('error', (error: any) => {
      console.error(error);
    });
  }

  // Joining to our call room in socket
  emitJoinRoom(roomID: string,userID: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('join-room', {userID: userID, roomID: roomID}, (callback: any) => {
        if(callback.success){
          console.log('Got back on room join: ', callback);
          resolve(callback);
        }
        else {
          reject({
            success: false,
            message: "Join unsuccesfull",
          });
        }
      });
    });
  }

  // Sending offer to the other client
  emitOffer(offer: RTCSessionDescriptionInit, targetId: string, roomId: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('offer', {offer: offer, targetId: targetId, roomId: roomId}, (callback: any) => {
        if(callback.success){
          resolve(callback.offer);
        }
        else {
          reject({})
        }
      })
    })
  }

  // Listening to offer from the other client
  onOffer() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.on('offer', (data: any) => {
        if(data){
          resolve(data);
        }
        else {
          reject({
            success: false,
            message: "Offer didnt come through correctly"
          })
        }
      })
    })
  }

  // Send answer to the other client
  emitAnswer(answer: RTCSessionDescriptionInit, targetSocketId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('answer', {answer: answer, targetSocketId: targetSocketId}, (callback: any)=>{
        if(callback.success){
          resolve(callback.answer);
        }
        else {
          reject({
            success: false,
            message: "Answer didnt come through correctly emitAnswer"
          })
        }
      });
    })
  }

  // Listen for answers from other clients
  onAnswer() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.on('answer', (data: any) => {
        if(data){
          resolve(data);
        }
        else {
          reject({
            success: false,
            message: "Answer didnt come through correctly onAnswer"
          })
        }
      })
    })
  }

  // Emit ice candidate to the other client
  emitIceCandidate(iceCandidate: any, targetSocketId: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.emit('ice-candidate', {candidate: iceCandidate, targetSocketId: targetSocketId}, (callback: any) => {
        if(callback.success){
          resolve(callback.candidate);
        }
        else {
          reject({
            success: false,
            message: "Answer didnt come through correctly onIceCandidate"
          });
        }
      });
    });
  }

  // Listen for ice-candidate from the other client
  onIceCandidate() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.on('ice-candidate', (data: any) => {
        if(data){
          resolve(data);
        }
        else{
          reject({
            success: false,
            message: "Answer didnt come through correctly onIceCandidate"
          });
        }
      });
    });
  }

  emitMessage() {
    this.socket.emit('test', {message: 'message'});
  }

  onMessage() {
    this.socket.on('test', (data: any) => {
      console.log('message got: ', data);
    });
  }
}
