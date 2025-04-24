import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryModels } from '../../models/category.models';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  url = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  add(data: CategoryModels.AddCategoryRequest) {
    return this.httpClient.post<CategoryModels.AddCategoryResponse>(this.url + '/category/add', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  update(data: CategoryModels.UpdateCategoryRequest) {
    return this.httpClient.patch<CategoryModels.UpdateCategoryResponse>(this.url + '/category/update', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getCategories() {
    return this.httpClient.get<CategoryModels.GetCategoriesResponse>(this.url + '/category/get')
  }
}
