import { Routes } from '@angular/router';

const loadPortal = () => import('./pages/portal/portal.component').then(m => m.PortalPageComponent);

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'inicio' },
  { path: 'inicio', loadComponent: () => import('@/pages/home/home.component').then(m => m.HomePageComponent) },
  { path: 'home', redirectTo: 'inicio' },
  { path: 'services', loadComponent: () => import('./pages/services/services.component').then(m => m.ServicesPageComponent) },
  { path: 'products', loadComponent: () => import('./pages/products/products.component').then(m => m.ProductsPageComponent) },
  { path: 'about', loadComponent: () => import('./pages/about/about.component').then(m => m.AboutPageComponent) },
  { path: 'testimonials', loadComponent: () => import('./pages/testimonials/testimonials.component').then(m => m.TestimonialsPageComponent) },
  { path: 'contact', loadComponent: () => import('./pages/contact/contact.component').then(m => m.ContactPageComponent) },
  { path: 'legal', loadComponent: () => import('./pages/legal/legal.component').then(m => m.LegalPageComponent) },
  { path: 'evaluacion-privada', loadComponent: () => import('./pages/private-evaluation/private-evaluation.component').then(m => m.PrivateEvaluationPageComponent) },
  { path: 'portal', pathMatch: 'full', redirectTo: 'portal/login' },
  { path: 'portal/:section', loadComponent: loadPortal },
  { path: '**', redirectTo: 'inicio' },
];
