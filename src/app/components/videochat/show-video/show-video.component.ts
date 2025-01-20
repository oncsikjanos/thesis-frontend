import {AfterViewInit, Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from '@angular/core';

@Component({
  selector: 'app-show-video',
  imports: [],
  templateUrl: './show-video.component.html',
  styleUrl: './show-video.component.scss'
})
export class ShowVideoComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChild('videoElement') videoElement: ElementRef | null = null;
  @Input() videoStream: MediaStream | null = null;
  @Input() userName: string | null = null;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoStream'] && this.videoStream && this.videoElement) {
      this.setVideoStream();
    }
  }

  ngAfterViewInit() {
    if (this.videoStream && this.videoElement) {
      this.setVideoStream();
    }
  }

  private setVideoStream() {
    if (this.videoElement?.nativeElement && this.videoStream) {
      this.videoElement.nativeElement.srcObject = this.videoStream;
      console.log('Video stream set successfully');
      console.log('Show video: ', this.videoElement.nativeElement.srcObject);
    }
  }
}
