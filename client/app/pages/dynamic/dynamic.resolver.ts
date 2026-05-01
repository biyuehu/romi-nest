import { inject } from '@angular/core'
import { ResolveFn, Router } from '@angular/router'
import { EMPTY, forkJoin, of } from 'rxjs'
import { ResPostSingleData, ResSettingsDataIndependentPage } from '../../../output'
import { ApiService } from '../../services/api.service'

export const dynamicResolver: ResolveFn<[ResSettingsDataIndependentPage, ResPostSingleData]> = (route) => {
  const apiService = inject(ApiService)
  const router = inject(Router)
  const slug = route.paramMap.get('slug')
  const data = apiService.settings().independentPages.find(({ name }) => name === slug)

  if (!data) {
    router.navigate(['/404'])
    return EMPTY
  }

  return forkJoin([of(data), apiService.getPost(Number(data.id))])
}
