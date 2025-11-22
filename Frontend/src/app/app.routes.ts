import { Routes } from '@angular/router';
import { Home } from './layout/home/home';
import { Layout } from './layout/layout';
import { Productslist } from './layout/productslist/productslist';
import { ProductDetails } from './layout/product-details/product-details';
import { Account } from './layout/account/account';
import { Login } from './login/login';
import { Register } from './register/register';
import { Dashboard } from './dashboard/dashboard';
import { adminGuard } from './core/guards/admin-guard';
import { Dashboardhome } from './dashboard/dashboardhome/dashboardhome';
import { Notfound } from './notfound/notfound';
import { DashboardHeader } from './dashboard/dashboard-header/dashboard-header';
import { DashboardOrders } from './dashboard/dashboard-orders/dashboard-orders';
import { DashboardUsers } from './dashboard/dashboard-users/dashboard-users';
import { DashboardReport } from './dashboard/dashboard-report/dashboard-report';
import { DashboardProducts } from './dashboard/dashboard-products/dashboard-products';
import { Cart } from './layout/cart/cart';
import { Orders } from './layout/orders/orders';
import { OrderDetails } from './layout/order-details/order-details';
import { DashboardSubCategory } from './dashboard/dashboard-sub-category/dashboard-sub-category';
import { DashboardCategory } from './dashboard/dashboard-category/dashboard-category';
import { Testimonal } from './layout/testimonal/testimonal';
import { DashboardTestimonal } from './dashboard/dashboard-testimonal/dashboard-testimonal';
import { About } from './layout/about/about';
import { FQA } from './layout/fqa/fqa';
import { DashboardFaq } from './dashboard/dashboard-faq/dashboard-faq';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: Home },
      { path: 'account', component: Account },
      { path: 'order', component: Orders },
      { path: 'products', component: Productslist },
      { path: 'product/:slug', component: ProductDetails },
      { path: 'testimonals', component: Testimonal },
      { path: 'cart', component: Cart },
      { path: 'about', component: About},
      { path: 'order/:id', component:OrderDetails},
    ]

  }, {
    path: 'dashboard', component: Dashboard, canActivate: [adminGuard], children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: DashboardReport },
      { path: 'order', component: DashboardOrders },
      { path: 'user', component: DashboardUsers },
      { path: 'product', component: DashboardProducts },
      // { path: 'report', component: DashboardReport },
      { path: 'subcategory', component: DashboardSubCategory },
      { path: 'category', component: DashboardCategory },
      { path: 'testimonals', component: DashboardTestimonal },
      { path: 'faq', component:DashboardFaq },
    ]
  },

  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: '**', component: Notfound }
];
