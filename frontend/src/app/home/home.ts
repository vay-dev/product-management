import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService, Product, Category } from '../services/api.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  loading = true;

  // Statistics
  totalProducts = 0;
  totalCategories = 0;
  totalValue = 0;
  lowStockCount = 0;

  // Chart configurations
  categoryChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
        ],
        borderColor: [
          'rgba(99, 102, 241, 1)',
          'rgba(139, 92, 246, 1)',
          'rgba(236, 72, 153, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  categoryChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgb(156, 163, 175)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
      },
    },
  };

  priceChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: 'Product Price',
        data: [],
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  priceChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'rgb(156, 163, 175)',
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.95)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: 'rgba(99, 102, 241, 0.5)',
        borderWidth: 1,
      },
    },
  };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;

    Promise.all([
      this.apiService.getProducts().toPromise(),
      this.apiService.getCategories().toPromise(),
    ])
      .then(([products, categories]) => {
        this.products = products || [];
        this.categories = categories || [];
        this.calculateStatistics();
        this.prepareChartData();
      })
      .catch((error) => {
        console.error('Error loading data:', error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  calculateStatistics(): void {
    this.totalProducts = this.products.length;
    this.totalCategories = this.categories.length;
    this.totalValue = this.products.reduce(
      (sum, product) => sum + Number(product.price) * product.quantity,
      0
    );
    this.lowStockCount = this.products.filter(
      (product) => product.quantity < 10
    ).length;
  }

  prepareChartData(): void {
    // Category distribution chart
    const categoryCount = new Map<string, number>();
    this.products.forEach((product) => {
      const category = this.categories.find((c) => c.id === product.category);
      if (category) {
        categoryCount.set(
          category.name,
          (categoryCount.get(category.name) || 0) + 1
        );
      }
    });

    this.categoryChartData.labels = Array.from(categoryCount.keys());
    this.categoryChartData.datasets[0].data = Array.from(
      categoryCount.values()
    );

    // Price distribution chart (top 10 products by price)
    const sortedProducts = [...this.products]
      .sort((a, b) => Number(b.price) - Number(a.price))
      .slice(0, 10);

    this.priceChartData.labels = sortedProducts.map((p) => p.name);
    this.priceChartData.datasets[0].data = sortedProducts.map((p) =>
      Number(p.price)
    );
  }
}
