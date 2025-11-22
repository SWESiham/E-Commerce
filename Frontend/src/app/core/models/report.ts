import { Iproduct } from "./product";
import { IUser } from "./user";

export interface ISalesSummary {
    overallStats: Array<{
        totalSalesAmount: number;
        totalQuantitySold: number;
        totalPurchases: number;
        averageOrderValue?: number; 
    }>;

    topProducts: Array<{
        _id: string;
        title: string;
        revenue: number;
        quantity: number;
        image?: string;
    }>;
    
    topUsers: Array<{
        _id: string;
        name: string;
        email: string;
        totalSpent: number;
        totalPurchases: number;
        totalQuantity?: number;
    }>;
    
    monthlySales: Array<{
        _id: { year: number; month: number };
        totalRevenue: number;
        quantity: number;
        orderCount: number;
    }>;
    
    dailySales: Array<{
        _id: string;
        revenue: number;
        orders: number;
    }>;
    
    categorySales: Array<{
        _id: string;
        revenue: number;
        quantity: number;
    }>;
}

export interface ISalesSummaryResponse {
    data: ISalesSummary;
    message: string;
    dateRange?: {
        start: string;
        end: string;
    };
}