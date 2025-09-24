import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, ProductoPayload } from '../api.service';
import { DataCardComponent } from '../data-card/data-card.component';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataCardComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {
  title = 'Productos';
  productos: any[] = [];
  loading = signal(false);
  error = signal<string | null>(null);

  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      precio: [0, [Validators.required, Validators.min(0)]],
      notas: ['']
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    this.error.set(null);
    this.loading.set(true);
    this.api.getProductos().subscribe({
      next: data => {
        this.productos = data || [];
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar productos');
        this.loading.set(false);
      }
    });
  }

  onCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: ProductoPayload = {
      nombre: this.form.value.nombre!,
      stock: Number(this.form.value.stock ?? 0),
      precio: Number(this.form.value.precio ?? 0),
      notas: this.form.value.notas || ''
    };
    this.error.set(null);
    this.loading.set(true);
    this.api.createProducto(payload).subscribe({
      next: () => {
        this.loading.set(false);
        this.onSearch();
        this.form.reset({ stock: 0, precio: 0 });
      },
      error: () => {
        this.error.set('Error al crear producto');
        this.loading.set(false);
      }
    });
  }
}
