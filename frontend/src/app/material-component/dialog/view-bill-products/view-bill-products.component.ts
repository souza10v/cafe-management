import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-bill-products',
  imports: [MatToolbarModule, MatIconModule, MatDialogModule, ReactiveFormsModule, MatTableModule, CommonModule],
  templateUrl: './view-bill-products.component.html',
  styleUrl: './view-bill-products.component.scss'
})

export class ViewBillProductsComponent implements OnInit {
  displayedColumns: string[] = [
    'name',
    'category',
    'price',
    'quantity',
    'total',
  ];
  dataSource: any = [];
  data: any;

  constructor(
    @Inject(MAT_DIALOG_DATA) public dialogData: any,
    public dialogRef: MatDialogRef<ViewBillProductsComponent>,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.data = this.dialogData?.data || {};
    console.log('DATA:', this.data);
    console.log('productDetails:', this.data.productDetails);
    this.dataSource = Array.isArray(this.data.productDetails) ? this.data.productDetails : [];

    this.cdr.detectChanges();
  }
  
}
