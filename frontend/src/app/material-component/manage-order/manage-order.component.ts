import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { ProductService } from '../../services/product.service';
import { SnackbarService } from '../../services/snackbar.service';
import { BillService } from '../../services/bill.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { GlobalConstants } from '../../shared/global-constants';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-manage-order',
  imports: [MatCardModule, MatFormFieldModule, MatTableModule, MatIconModule, MatInputModule, CommonModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './manage-order.component.html',
  styleUrl: './manage-order.component.scss'
})
export class ManageOrderComponent {
  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;
  categories: any = [];
  products: any = [];
  price: any;
  totalAmount: number = 0;
  respondeMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackbarService: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
  ){ }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategories();
    this.manageOrderForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
      email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
      contactNumber: [null, [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
      paymentMethod: [null, [Validators.required]],
      product: [null, [Validators.required]],
      category: [null , [Validators.required]],
      quantity: [null, [Validators.required]],
      price: [null, [Validators.required]],
      total: [0, [Validators.required]]
    })
  }

  getCategories() {
    this.categoryService.getCategories().subscribe({
      next: (response: any) => {
        this.ngxService.stop();
        this.categories = response;
      },
      error: (error: any) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.respondeMessage = error.error?.message;
        } else {
          this.respondeMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.respondeMessage, GlobalConstants.error);
      }
    })
  }

  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe({
      next: (response: any) => {
        this.products = response;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
      },
      error: (error: any) => {
        if (error.error?.message) {
          this.respondeMessage = error.error?.message;
        } else {
          this.respondeMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.respondeMessage, GlobalConstants.error);
      }
    })
  }

  getProductDetails(value:any){
    this.productService.getProductById(value.id).subscribe({
      next: (response: any) => {
        this.price = response.price;
        this.manageOrderForm.controls['price'].setValue(response.price);
        this.manageOrderForm.controls['quantity'].setValue(1);
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      error: (error: any) => {
        if (error.error?.message) {
          this.respondeMessage = error.error?.message;
        } else {
          this.respondeMessage = GlobalConstants.genericError;
        }
        this.snackbarService.openSnackBar(this.respondeMessage, GlobalConstants.error);
      }
    })
  }

  setQuantity(value: any) {
    let temp = this.manageOrderForm.controls.quantity.value;
    if (temp > 0) {
      this.manageOrderForm.controls.total.setValue(
        this.manageOrderForm.controls.quantity.value *
          this.manageOrderForm.controls.price.value
      );
    } else if (temp != '') {
      this.manageOrderForm.controls.quantity.setValue('1');
      this.manageOrderForm.controls.total.setValue(
        this.manageOrderForm.controls.quantity.value *
          this.manageOrderForm.controls.price.value
      );
    }
  }

  validateProductAdd() {}

  validateSubmit() {}

  add() {}

  handleDeletAction(value: any, element: any) {
  }

  submitAction() {}

  downloadFile(fileName: any) {}
}
