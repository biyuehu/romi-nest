import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { Router } from '@angular/router'
import { MessageBoxType } from '../../components/message/message.component'
import { WebComponentCheckboxAccessorDirective } from '../../directives/web-component-checkbox-accessor.directive'
import { WebComponentInputAccessorDirective } from '../../directives/web-component-input-accessor.directive'
import type {
  ResSettingsData,
  ResSettingsDataDependentPage,
  ResSettingsDataFriendLink,
  ResSettingsDataHomeLink
} from '../../models/api.model'
import { ApiService } from '../../services/api.service'
import { NotifyService } from '../../services/notify.service'

@Component({
  selector: 'app-admin-settings',
  imports: [FormsModule, WebComponentInputAccessorDirective, WebComponentCheckboxAccessorDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './admin-settings.component.html'
})
export class AdminSettingsComponent implements OnInit {
  public isLoading = true
  public settingsForm!: ResSettingsData

  public keywordsInput = ''

  public editingHomeLinkIndex: number | null = null
  public homeLinkForm: ResSettingsDataHomeLink = ['', '', '']

  public editingDependentPageId: number | null = null
  public dependentPageForm: ResSettingsDataDependentPage = {
    name: '',
    title: '',
    id: 0n,
    routine: false,
    hide_toc: false,
    hide_comments: false
  }

  public editingFriendLinkIndex: number | null = null
  public friendLinkForm: ResSettingsDataFriendLink = {
    name: '',
    link: '',
    avatar: '',
    description: ''
  }

  constructor(
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly notifyService: NotifyService
  ) {}

  public ngOnInit(): void {
    this.loadSettings()
  }

  private loadSettings(): void {
    this.isLoading = true
    this.apiService.getSettings().subscribe((data) => {
      this.settingsForm = data
      this.keywordsInput = data.site_keywords.join(', ')
      this.isLoading = false
    })
  }

  public onKeywordsInputChange(): void {
    this.settingsForm.site_keywords = this.keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k !== '')
  }

  public startEditHomeLink(index: number): void {
    this.editingHomeLinkIndex = index
    this.homeLinkForm = [...this.settingsForm.home_links[index]]
  }

  public cancelEditHomeLink(): void {
    this.editingHomeLinkIndex = null
    this.homeLinkForm = ['', '', '']
  }

  public saveHomeLink(): void {
    if (!this.homeLinkForm[1] || !this.homeLinkForm[2]) {
      this.notifyService.showMessage('文字和链接不能为空', MessageBoxType.Warning)
      return
    }
    if (this.editingHomeLinkIndex !== null) {
      this.settingsForm.home_links[this.editingHomeLinkIndex] = [...this.homeLinkForm]
    } else {
      this.settingsForm.home_links.push([...this.homeLinkForm])
    }
    this.cancelEditHomeLink()
  }

  public removeHomeLink(index: number): void {
    this.settingsForm.home_links.splice(index, 1)
    if (this.editingHomeLinkIndex === index) this.cancelEditHomeLink()
  }

  // ========== DependentPage 相关 ==========
  public startEditDependentPage(page: ResSettingsDataDependentPage): void {
    this.editingDependentPageId = Number(page.id)
    this.dependentPageForm = { ...page }
  }

  public cancelEditDependentPage(): void {
    this.editingDependentPageId = null
    this.dependentPageForm = {
      name: '',
      title: '',
      id: 0n,
      routine: false,
      hide_toc: false,
      hide_comments: false
    }
  }

  public saveDependentPage(): void {
    if (!this.dependentPageForm.name || !this.dependentPageForm.title || !this.dependentPageForm.id) {
      this.notifyService.showMessage('标识名、标题和文章ID都不能为空', MessageBoxType.Warning)
      return
    }
    const targetId = Number(this.dependentPageForm.id)
    if (this.editingDependentPageId !== null) {
      const index = this.settingsForm.dependent_pages.findIndex((p) => Number(p.id) === this.editingDependentPageId)
      if (index !== -1) {
        this.settingsForm.dependent_pages[index] = { ...this.dependentPageForm, id: BigInt(targetId) }
      }
    } else {
      if (this.settingsForm.dependent_pages.some((p) => Number(p.id) === targetId)) {
        this.notifyService.showMessage('文章ID已存在', MessageBoxType.Error)
        return
      }
      this.settingsForm.dependent_pages.push({ ...this.dependentPageForm, id: BigInt(targetId) })
    }
    this.cancelEditDependentPage()
  }

  public removeDependentPage(id: bigint): void {
    this.settingsForm.dependent_pages = this.settingsForm.dependent_pages.filter((p) => p.id !== id)
    if (this.editingDependentPageId === Number(id)) this.cancelEditDependentPage()
  }

  // ========== FriendLink 相关 ==========
  public startEditFriendLink(index: number): void {
    this.editingFriendLinkIndex = index
    this.friendLinkForm = { ...this.settingsForm.links[index] }
  }

  public cancelEditFriendLink(): void {
    this.editingFriendLinkIndex = null
    this.friendLinkForm = { name: '', link: '', avatar: '', description: '' }
  }

  public saveFriendLink(): void {
    if (!this.friendLinkForm.name || !this.friendLinkForm.link) {
      this.notifyService.showMessage('名称和链接不能为空', MessageBoxType.Warning)
      return
    }
    if (this.editingFriendLinkIndex !== null) {
      this.settingsForm.links[this.editingFriendLinkIndex] = { ...this.friendLinkForm }
    } else {
      this.settingsForm.links.push({ ...this.friendLinkForm })
    }
    this.cancelEditFriendLink()
  }

  public removeFriendLink(index: number): void {
    this.settingsForm.links.splice(index, 1)
    if (this.editingFriendLinkIndex === index) this.cancelEditFriendLink()
  }

  public saveSettings(): void {
    this.onKeywordsInputChange()
    this.apiService
      .updateSettings(this.settingsForm)
      .subscribe(() => this.notifyService.showMessage('保存成功', MessageBoxType.Success))
  }

  public goBack(): void {
    this.router.navigate(['/admin'])
  }
}
