import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Service } from '../../services/services.service';

@Component({
  selector: 'app-service-card',
  templateUrl: './service-card.component.html',
  standalone: false
})
export class ServiceCardComponent implements OnChanges {
  @Input() service!: Service;

  mediaUrls: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['service'] && this.service.mediaUrlsJson) {
      try {
        this.mediaUrls = JSON.parse(this.service.mediaUrlsJson);
      } catch {
        this.mediaUrls = [];
      }
    }
  }
}
