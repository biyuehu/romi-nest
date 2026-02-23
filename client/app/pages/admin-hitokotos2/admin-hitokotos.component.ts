import { DatePipe } from '@angular/common'
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import {
  AbstractAdminBaseListComponent,
  AdminBaseListComponent
} from '../../components/admin-base-list/admin-base-list.component'
import { MessageBoxType } from '../../components/message/message.component'
import { WebComponentInputAccessorDirective } from '../../directives/web-component-input-accessor.directive'
import { WebComponentSwitchAccessorDirective } from '../../directives/web-component-switch-accessor.directive'
import { ReqHitokoto2Data, ResHitokoto2Data } from '../../models/api.model'
import { ApiService } from '../../services/api.service'

@Component({
  selector: 'app-admin-hitokotos2',
  imports: [
    FormsModule,
    WebComponentInputAccessorDirective,
    WebComponentSwitchAccessorDirective,
    AdminBaseListComponent,
    DatePipe
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-hitokotos.component.html'
})
export class AdminHitokotosComponent extends AbstractAdminBaseListComponent<ResHitokoto2Data> implements OnInit {
  public filterType = 0
  public editingHitokoto: ResHitokoto2Data | null = null

  public newHitokoto: ReqHitokoto2Data = {
    msg: '',
    msg_origin: null,
    from: null,
    from_who: null,
    type: 1,
    is_public: false
  }

  public readonly types = Object.entries({
    1: '动漫',
    2: '游戏',
    3: '文学',
    4: '哲学',
    5: '歌词',
    6: '诗词',
    7: '网络',
    8: '其它'
  })

  public constructor(private readonly apiService: ApiService) {
    super()
  }

  protected loadItems(): void {
    this.isLoading = true
    this.apiService.getHitokotos2(/*false*/).subscribe((data) => {
      this.items = data.reverse()
      this.isLoading = false
    })
  }

  protected searchPredicate(hitokoto: ResHitokoto2Data, query: string): boolean {
    const filterType = Number(this.filterType)
    const matchesSearch =
      hitokoto.msg.toLowerCase().includes(query) ||
      !!hitokoto.msg_origin?.toLowerCase().includes(query) ||
      !!hitokoto.from?.toLowerCase().includes(query) ||
      !!hitokoto.from_who?.toLowerCase().includes(query)
    return filterType ? hitokoto.type === filterType && matchesSearch : matchesSearch
  }

  protected deleteItem(uuid: string) {
    if (!this.confirmDelete()) return
    this.apiService.deleteHitokoto2(uuid).subscribe(() => {
      this.notifyService.showMessage('一言删除成功', MessageBoxType.Secondary)
      this.items = this.items.filter((h) => h.uuid !== uuid)
    })
  }

  public ngOnInit() {
    this.loadItems()
  }

  public createHitokoto() {
    if (!this.newHitokoto.msg.trim()) {
      this.notifyService.showMessage('请输入一言内容', MessageBoxType.Warning)
      return
    }
    const { msg, msg_origin, is_public, from, from_who } = this.newHitokoto

    // TODO: better handle msg and check msg format
    this.apiService
      .createHitokoto2({
        msg: msg.trim(),
        msg_origin: msg_origin?.trim() || null,
        from: from?.trim() || null,
        from_who: from_who?.trim() || null,
        type: Number(this.newHitokoto.type),
        is_public
      })
      .subscribe(() => {
        this.loadItems()
        this.cancelEdit()
        this.notifyService.showMessage('一言创建成功', MessageBoxType.Success)
      })
  }

  public startEdit(hitokoto: ResHitokoto2Data) {
    this.editingHitokoto = hitokoto
    this.newHitokoto = {
      msg: hitokoto.msg,
      msg_origin: hitokoto.msg_origin,
      from: hitokoto.from,
      from_who: hitokoto.from_who,
      type: hitokoto.type,
      is_public: hitokoto.is_public
    }
  }

  public cancelEdit() {
    this.editingHitokoto = null
    this.newHitokoto = { msg: '', msg_origin: null, from: null, from_who: null, type: 1, is_public: false }
  }

  public updateHitokoto() {
    if (!this.editingHitokoto) return

    this.apiService
      .updateHitokoto2(this.editingHitokoto.uuid, { ...this.newHitokoto, type: Number(this.newHitokoto.type) })
      .subscribe(() => {
        this.loadItems()
        this.cancelEdit()
        this.notifyService.showMessage('一言更新成功', MessageBoxType.Success)
      })
  }
}
