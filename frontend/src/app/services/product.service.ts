import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { ProductModels } from '../../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  url = environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  add(data: ProductModels.AddProductRequest) {
    return this.httpClient.post<ProductModels.AddProductResponse>(this.url + '/product/add', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    )
  }

  update(data: ProductModels.UpdateProductRequest) {
    return this.httpClient.patch<ProductModels.UpdateProductResponse>(this.url + '/product/update', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    )
  }

  getProducts() {
    return this.httpClient.get(this.url + '/product/get', {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  updateStatus(data: ProductModels.UpdateStatusRequest) {
    return this.httpClient.patch<ProductModels.UpdateStatusResponse>(this.url + '/product/updateStatus', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    )
  }

  delete(id: ProductModels.DeleteProductRequest) {
    return this.httpClient.delete<ProductModels.DeleteProductResponse>(this.url + '/product/delete/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    }
    )
  }

  getProductsByCategory(id: any) {
    return this.httpClient.get<ProductModels.GetCategoryByIdResponse>(this.url + '/product/getCategory/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }

  getProductById(id: any) {
    return this.httpClient.get<ProductModels.GetProductByIdResponse>(this.url + '/product/getProduct/' + id, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    })
  }
}
