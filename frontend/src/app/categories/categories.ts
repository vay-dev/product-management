import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService, Category } from '../services/api.service';
import { SharedModule } from '../shared/shared-module';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedModule],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  categories: Category[] = [];
  loading = false;
  showModal = false;
  editMode = false;
  selectedCategory: Category | null = null;

  categoryForm: FormGroup;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder
  ) {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.apiService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.loading = false;
      },
    });
  }

  openCreateModal(): void {
    this.editMode = false;
    this.selectedCategory = null;
    this.categoryForm.reset();
    this.showModal = true;
  }

  openEditModal(category: Category): void {
    this.editMode = true;
    this.selectedCategory = category;
    this.categoryForm.patchValue({
      name: category.name,
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.categoryForm.reset();
    this.selectedCategory = null;
  }

  saveCategory(): void {
    if (this.categoryForm.invalid) {
      return;
    }

    const categoryData: Category = {
      name: this.categoryForm.value.name,
    };

    if (this.editMode && this.selectedCategory) {
      this.apiService.updateCategory(this.selectedCategory.id!, categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (error) => console.error('Error updating category:', error),
      });
    } else {
      this.apiService.createCategory(categoryData).subscribe({
        next: () => {
          this.loadCategories();
          this.closeModal();
        },
        error: (error) => console.error('Error creating category:', error),
      });
    }
  }

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete "${category.name}"?`)) {
      this.apiService.deleteCategory(category.id!).subscribe({
        next: () => this.loadCategories(),
        error: (error) => console.error('Error deleting category:', error),
      });
    }
  }
}
