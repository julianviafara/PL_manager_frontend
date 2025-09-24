import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { filter } from 'rxjs/operators';

interface Cliente {
  id?: number;
  id_cliente?: number;
  nombre: string;
  contacto?: string;
  clase?: string;
}

interface Producto {
  id?: number;
  nombre: string;
  stock: number;
  precio: number;
  notas?: string;
}

interface Deuda {
  id?: number;
  id_cliente: number;
  concepto: string;
  valor: number;
  pago: number;
  devuelta: number;
  notas?: string;
}

type DataType = Cliente[] | Producto[] | Deuda[];

@Component({
  selector: 'app-data-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-card.component.html',
  styleUrl: './data-card.component.css'
})
export class DataCardComponent implements OnInit {
  private readonly baseUrl = 'http://localhost:8080/api';
  
  data = signal<DataType>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  currentRoute = signal<string>('');

  // Computed properties for different data types
  clientes = computed(() => this.data() as Cliente[]);
  productos = computed(() => this.data() as Producto[]);
  deudas = computed(() => this.data() as Deuda[]);

  // Computed property to determine current data type
  dataType = computed(() => {
    const route = this.currentRoute();
    if (route.includes('musicos')) return 'clientes';
    if (route.includes('productos')) return 'productos';
    if (route.includes('deudas')) return 'deudas';
    return 'unknown';
  });

  // Computed property for card title
  cardTitle = computed(() => {
    const type = this.dataType();
    switch (type) {
      case 'clientes': return 'Lista de Clientes';
      case 'productos': return 'Lista de Productos';
      case 'deudas': return 'Lista de Deudas';
      default: return 'Datos';
    }
  });

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // Listen to route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentRoute.set(event.url);
        this.loadData();
      });

    // Load initial data
    this.currentRoute.set(this.router.url);
    this.loadData();
  }

  private loadData(): void {
    const type = this.dataType();
    if (type === 'unknown') return;

    this.loading.set(true);
    this.error.set(null);

    const endpoint = `${this.baseUrl}/${type}`;
    
    this.http.get<DataType>(endpoint).subscribe({
      next: (data) => {
        this.data.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(`Error al cargar ${type}`);
        this.loading.set(false);
      }
    });
  }

  refreshData(): void {
    this.loadData();
  }
}
