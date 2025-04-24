export namespace CategoryModels {
    export interface CategoryRequest {
        category: string;
    }

    export interface AddCategoryRequest {
        category: string;
    }

    export interface AddCategoryResponse {
        message: string;
    }

    export interface UpdateCategoryRequest {
        id: number;
        name: string;
    }

    export interface UpdateCategoryResponse {
        message: string;
    }

    export interface GetCategoriesRequest {
        category: string;
    }

    export interface GetCategoriesResponse {
        id: number;
        name: string;
    }
}
