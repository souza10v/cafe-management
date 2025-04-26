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
import { saveAs } from 'file-saver';
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
  responseMessage: any;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private productService: ProductService,
    private snackBar: SnackbarService,
    private billService: BillService,
    private ngxService: NgxUiLoaderService,
  ){ }

  ngOnInit(): void {

    if (this.manageOrderForm.invalid) {
      this.markFormGroupTouched(this.manageOrderForm);
      return;
    }

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
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    })
  }

  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe({
      next: (response: any) => {
        this.products = response.data;
        this.manageOrderForm.controls['price'].setValue('');
        this.manageOrderForm.controls['quantity'].setValue('');
        this.manageOrderForm.controls['total'].setValue(0);
      },
      error: (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    })
  }

  getProductDetails(value:any){
    this.productService.getProductById(value.id).subscribe({
      next: (response: any) => {
        this.price = response.data.price;
        this.manageOrderForm.controls['price'].setValue(response.data.price);
        this.manageOrderForm.controls['quantity'].setValue(1);
        this.manageOrderForm.controls['total'].setValue(this.price * 1);
      },
      error: (error: any) => {
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    })
  }

  setQuantity(value: any) {
    let temp = this.manageOrderForm.controls['quantity'].value;
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    } else if (temp != '') {
      this.manageOrderForm.controls['quantity'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(
        this.manageOrderForm.controls['quantity'].value *
          this.manageOrderForm.controls['price'].value
      );
    }
  }

  validateProductAdd() {
    if (
      this.manageOrderForm.controls.total.value === 0 ||
      this.manageOrderForm.controls.total.value === null ||
      this.manageOrderForm.controls.quantity.value <= 0
    ) {
      return true;
    } else {
      return false;
    }
  }

   validateSubmit() {
    if (
      this.totalAmount === 0 ||
      this.manageOrderForm.controls.name.value === null ||
      this.manageOrderForm.controls.email.value === null ||
      this.manageOrderForm.controls.contactNumber.value === null ||
      this.manageOrderForm.controls.paymentMethod.value === null ||
      !this.manageOrderForm.controls.contactNumber.valid ||
      !this.manageOrderForm.controls.email.valid
    ) {
      return true;
    } else {
      return false;
    }
  }

  add() {
    let formData = this.manageOrderForm.value;
    let productName = this.dataSource.find(
      (e: { id: number; }) => e.id == formData.product.id
    );
    if (productName === undefined) {
      this.totalAmount += formData.total;
      this.dataSource.push({
        id: formData.product.id,
        name: formData.product.name,
        category: formData.category.name,
        quantity: formData.quantity,
        price: formData.price,
        total: formData.total,
      });

      this.dataSource = [...this.dataSource];
      this.snackBar.openSnackBar(GlobalConstants.productAdded, 'success');
    } else {
      this.snackBar.openSnackBar(
        GlobalConstants.productExistError,
        GlobalConstants.error
      );
    }
  }

  handleDeletAction(value: any, element: any) {
    this.totalAmount -= element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction() {

    if (this.manageOrderForm.invalid) {
      this.markFormGroupTouched(this.manageOrderForm);
      return;
    }

    this.ngxService.start();
    let formData = this.manageOrderForm.value;
    let data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount,
      productDetails: JSON.stringify(this.dataSource),
    };

    this.billService.generateReport(data).subscribe(
      (resp: any) => {
        this.downloadFile(resp?.uuid);
        this.manageOrderForm.reset();
        this.dataSource = [];
        this.totalAmount = 0;
      },
      (error) => {
        this.ngxService.stop();
        if (error.error?.message) {
          this.responseMessage = error.error?.message;
        } else {
          this.responseMessage = GlobalConstants.genericError;
        }
        this.snackBar.openSnackBar(this.responseMessage, GlobalConstants.error);
      }
    );
  }

  downloadFile(fileName: any) {
    console.log(fileName)
    let data = {
      uuid: fileName,
    };

    this.billService.getPDF(data).subscribe((resp: any) => {
      saveAs(resp, fileName + '.pdf');
      this.ngxService.stop();
    });
  }

  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if ((control as FormGroup).controls) {
        this.markFormGroupTouched(control as FormGroup);
      }
    });
  }
}
