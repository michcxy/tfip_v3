import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  playlistId = '37i9dQZF1DZ06evO1X6Ic8';
  embedUrl!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.embedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://open.spotify.com/embed/playlist/37i9dQZF1DZ06evO1X6Ic8?utm_source=generator`
    );
  }
  
}
