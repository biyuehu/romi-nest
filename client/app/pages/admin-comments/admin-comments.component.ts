import { DatePipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterLink } from '@angular/router'
import {
  AbstractAdminBaseListComponent,
  AdminBaseListComponent
} from '../../components/admin-base-list/admin-base-list.component'
import { WebComponentInputAccessorDirective } from '../../directives/web-component-input-accessor.directive'
import { ResCommentData } from '../../models/api.model'
import { ApiService } from '../../services/api.service'
import { CommentStatus, MessageBoxType } from '../../shared/types'
import { sortByCreatedTime } from '../../shared/utils'

@Component({
  selector: 'app-admin-comments',
  imports: [DatePipe, FormsModule, RouterLink, WebComponentInputAccessorDirective, AdminBaseListComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-comments.component.html'
})
export class AdminCommentsComponent extends AbstractAdminBaseListComponent<ResCommentData> implements OnInit {
  public constructor(private readonly apiService: ApiService) {
    super()
  }

  protected loadItems() {
    this.isLoading = true
    this.apiService.getComments().subscribe((data) => {
      this.items = sortByCreatedTime(data)
      this.isLoading = false
    })
  }

  protected searchPredicate(item: ResCommentData, query: string) {
    return item.text.toLowerCase().includes(query) || item.username.toLowerCase().includes(query)
  }

  public ngOnInit() {
    this.loadItems()
  }

  public deleteItem(id: number) {
    if (this.confirmDelete()) {
      this.apiService.deleteComment(id).subscribe(() => {
        this.notifyService.showMessage('删除成功', MessageBoxType.Secondary)
        this.items = this.items.filter((item) => item.cid !== id)
      })
    }
  }

  public remarkItem(id: number, status: CommentStatus) {
    this.apiService.remarkComment(id, status).subscribe(() => {
      this.notifyService.showMessage('操作成功', MessageBoxType.Secondary)
      this.items = this.items.map((item) => {
        if (item.cid === id) {
          item.status = CommentStatus.toNumber(status)
        }
        return item
      })
    })
  }

  public formatText(text: string) {
    return text.length > 100 ? `${text.slice(0, 100)}...` : text
  }

  protected readonly CommentStatus = CommentStatus
}
