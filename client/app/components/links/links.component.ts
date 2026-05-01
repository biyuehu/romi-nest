import { NgOptimizedImage } from '@angular/common'
import { Component, Input } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { ResPostSingleData } from '../../../output'
import { ApiService } from '../../services/api.service'
import { CardComponent } from '../card/card.component'
import { PostContentComponent } from '../post-content/post-content.component'

@Component({
  selector: 'app-links',
  imports: [FormsModule, PostContentComponent, CardComponent, NgOptimizedImage],
  templateUrl: './links.component.html'
})
export class LinksComponent {
  @Input({ required: true }) public post!: ResPostSingleData

  public constructor(public readonly apiService: ApiService) {}
}
