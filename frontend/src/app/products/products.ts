import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Product, Category } from '../services/api.service';
import { SharedModule } from '../shared/shared-module';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = false;
  showModal = false;
  editMode = false;
  selectedProduct: Product | null = null;

  productForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: [''],
      price: ['', [Validators.required, Validators.min(0)]],
      quantity: ['', [Validators.required, Validators.min(0)]],
      main_image: [null],
    });
  }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.loading = true;
    this.apiService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.loading = false;
      },
    });
  }

  loadCategories(): void {
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
      },
    });
  }

  get categoryOptions() {
    return this.categories.map(cat => ({
      label: cat.name,
      value: cat.id!.toString(),
      disabled: false
    }));
  }

  getCategoryName(categoryId: number): string {
    return this.categories.find(c => c.id === categoryId)?.name || 'Unknown';
  }

  openCreateModal(): void {
    this.editMode = false;
    this.selectedProduct = null;
    this.productForm.reset();
    this.showModal = true;
  }

  openEditModal(product: Product): void {
    this.editMode = true;
    this.selectedProduct = product;
    this.productForm.patchValue({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      quantity: product.quantity,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.productForm.reset();
    this.selectedProduct = null;
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.productForm.patchValue({ main_image: file });
    }
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      return;
    }

    const formData = {
      ...this.productForm.value,
      category: Number(this.productForm.value.category)
    };

    if (this.editMode && this.selectedProduct) {
      this.apiService.updateProduct(this.selectedProduct.id!, formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => console.error('Error updating product:', error),
      });
    } else {
      this.apiService.createProduct(formData).subscribe({
        next: () => {
          this.loadProducts();
          this.closeModal();
        },
        error: (error) => console.error('Error creating product:', error),
      });
    }
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.apiService.deleteProduct(product.id!).subscribe({
        next: () => this.loadProducts(),
        error: (error) => console.error('Error deleting product:', error),
      });
    }
  }

  getStockStatus(quantity: number): string {
    if (quantity === 0) return 'out-of-stock';
    if (quantity < 10) return 'low-stock';
    return 'in-stock';
  }

  getStockLabel(quantity: number): string {
    if (quantity === 0) return 'Out of Stock';
    if (quantity < 10) return 'Low Stock';
    return 'In Stock';
  }
}
