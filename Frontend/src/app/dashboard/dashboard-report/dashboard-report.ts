import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../core/service/report-service';
import { ISalesSummary } from '../../core/models/report';

@Component({
  selector: 'app-dashboard-report',
  imports: [CommonModule, FormsModule],
  templateUrl: './dashboard-report.html',
  styleUrl: './dashboard-report.css'
})
export class DashboardReport implements OnInit {
  salesSummary!: ISalesSummary;
  loading = false;
  error = '';
  
  startDate: string = '';
  endDate: string = '';

  chartData = {
    dailyRevenue: [] as any[],
    topProducts: [] as any[],
    monthlyRevenue: [] as any[],
    categories: [] as any[],
    topCustomers: [] as any[]
  };

  constructor(private reportService: ReportService,private  cdr:ChangeDetectorRef) {}

  ngOnInit(): void {
        const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);
    this.startDate = start.toISOString().split('T')[0];
    this.endDate = end.toISOString().split('T')[0];    
    this.loadSalesSummary();
  }

  loadSalesSummary(): void {
    this.reportService.getSalesSummary(this.startDate, this.endDate).subscribe({
      next: (res: any) => {
        console.log(res);
        this.salesSummary = res.data;
        this.prepareChartData();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  prepareChartData(): void {
    
    if (this.salesSummary.dailySales) {
      this.chartData.dailyRevenue = this.salesSummary.dailySales.map(item => ({
        date: new Date(item._id).toLocaleDateString(),
        revenue: item.revenue,
        orders: item.orders
      }));
    }

    if (this.salesSummary.topProducts) {
      this.chartData.topProducts = this.salesSummary.topProducts;
    }

    if (this.salesSummary.monthlySales) {
      this.chartData.monthlyRevenue = this.salesSummary.monthlySales.map(item => ({
        period: `${item._id.month}/${item._id.year}`,
        revenue: item.totalRevenue,
        orders: item.orderCount
      }));
    }

    if (this.salesSummary.categorySales) {
      this.chartData.categories = this.salesSummary.categorySales;
    }

    if (this.salesSummary.topUsers) {
      this.chartData.topCustomers = this.salesSummary.topUsers.map((user: any) => ({
        name: user.name,
        email: user.email,
        totalSpent: user.totalSpent || 0,
        totalPurchases: user.totalPurchases || 0
      }));
    }

    console.log('Chart data prepared:', this.chartData);
  }

  onDateRangeChange(): void {
    console.log('Date range changed:', { startDate: this.startDate, endDate: this.endDate });
    this.loadSalesSummary();
  }

  exportReport(): void {
    const csvContent = this.convertToCSV();
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${this.startDate}-to-${this.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  private convertToCSV(): string {
    if (!this.salesSummary) return '';
    let csv = 'Sales Analytics Report\n\n';

    if (this.salesSummary.overallStats && this.salesSummary.overallStats[0]) {
      const stats = this.salesSummary.overallStats[0];
      csv += 'OVERALL STATISTICS\n';
      csv += 'Metric,Value\n';
      csv += `Total Revenue,${stats.totalSalesAmount}\n`;
      csv += `Total Quantity Sold,${stats.totalQuantitySold}\n`;
      csv += `Total Purchases,${stats.totalPurchases}\n`;
      csv += `Average Order Value,${stats.averageOrderValue || 0}\n\n`;
    }
    
    if (this.salesSummary.topProducts && this.salesSummary.topProducts.length > 0) {
      csv += 'TOP PRODUCTS\n';
      csv += 'Product Name,Revenue,Quantity Sold\n';
      this.salesSummary.topProducts.forEach((product: any) => {
        csv += `"${product.title}",${product.revenue || 0},${product.quantity || 0}\n`;
      });
      csv += '\n';
    }
    
    if (this.salesSummary.topUsers && this.salesSummary.topUsers.length > 0) {
      csv += 'TOP CUSTOMERS\n';
      csv += 'Customer Name,Email,Total Spent,Total Orders\n';
      this.salesSummary.topUsers.forEach((customer: any) => {
        csv += `"${customer.name}","${customer.email}",${customer.totalSpent || 0},${customer.totalPurchases || 0}\n`;
      });
      csv += '\n';
    }
    
    if (this.salesSummary.dailySales && this.salesSummary.dailySales.length > 0) {
      csv += 'DAILY SALES\n';
      csv += 'Date,Revenue,Orders\n';
      this.salesSummary.dailySales.forEach((day: any) => {
        csv += `${day._id},${day.revenue},${day.orders}\n`;
      });
    }
    
    return csv;
  }

  

  getAverageOrderValue(): number {
    if (!this.salesSummary?.overallStats?.[0]?.averageOrderValue) return 0;
    return this.salesSummary.overallStats[0].averageOrderValue;
  }
}