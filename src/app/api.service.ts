import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientePayload {
  id?: number;
  nombre: string;
  contacto?: string;
  clase?: string; // musico | grupo
}

export interface ProductoPayload {
  id?: number;
  nombre: string;
  stock: number;
  precio: number;
  notas?: string;
}

export interface DeudaPayload {
  id?: number;
  id_cliente: number;
  concepto: string;
  valor: number;
  pago: number;
  devuelta: number;
  notas?: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  // Clientes
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/clientes`);
  }

  getClienteById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/clientes/${id}`);
  }

  createCliente(cliente: ClientePayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/clientes`, cliente);
  }

  // Productos
  getProductos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/productos`);
  }

  getProductoById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/productos/${id}`);
  }

  createProducto(producto: ProductoPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/productos`, producto);
  }

  // Deudas
  getDeudas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/deudas`);
  }

  getDeudaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/deudas/${id}`);
  }

  createDeuda(deuda: DeudaPayload): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/deudas`, deuda);
  }
}


