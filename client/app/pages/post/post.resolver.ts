import { inject } from '@angular/core'
import { ResolveFn } from '@angular/router'
import { pipe } from 'fp-ts/function'
import { map } from 'rxjs/operators'
import { ResPostSingleData } from '../../models/api.model'
import { ApiService } from '../../services/api.service'

export const postResolver: ResolveFn<ResPostSingleData> = (route) => {
  const id = route.paramMap.get('id') ?? ''
  const apiService = inject(ApiService)
  return pipe(+id, (numId) => (Number.isNaN(numId) ? apiService.getPostByStrId(id) : apiService.getPost(numId))).pipe(
    map((post) => ({
      ...post,
      text: post.password ? '文章已加密' : post.text
    }))
  )
}
