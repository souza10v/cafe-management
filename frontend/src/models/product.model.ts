export namespace ProductModels {

    export interface AddProductRequest {
      name: string;
      categoryID: number;
      description: string;
      price: number;
    }
  
    export interface AddProductResponse {
      category: string;
    }
  
    export interface UpdateProductRequest {
      ID: number;
      name: string;
      categoryID: number;
      description: string;
      price: number;
    }
  
    export interface UpdateProductResponse {
      data: Product[];
    }
  
    export interface GetProductsRequest {}
  
    export interface GetProductsResponse {
      data: Product[];
    }
  
    export interface GetCategoryByIdRequest {}
  
    export interface GetCategoryByIdResponse {
      data: SimpleProduct[];
    }
  
    export interface GetProductByIdRequest {}
  
    export interface GetProductByIdResponse {
      data: Product;
    }
  
    export interface UpdateStatusRequest {
      productID: string;
      status: string; 
    }
  
    export interface UpdateStatusResponse {
      message: string;
      status: string;
    }
  
    export interface DeleteProductRequest {}
  
    export interface DeleteProductResponse {
      message: string;
    }
    
    interface Category {
      id: number;
      name: string;
    }
  
    interface Product {
      id: number;
      name: string;
      description: string;
      price: number;
      status: boolean; 
      category: Category;
    }
  
    interface SimpleProduct {
      id: number;
      name: string;
    }
  }
  