import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, DeudaPayload } from '../api.service';

@Component({
  selector: 'app-deudas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './deudas.component.html',
  styleUrl: './deudas.component.css'
})
export class DeudasComponent implements OnInit {
  title = 'Deudas';
  deudas: any[] = [];
  loading = signal(false);
  error = signal<string | null>(null);

  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      nombreCliente: ['', Validators.required],
      concepto: ['', Validators.required],
      valor: [0, [Validators.required, Validators.min(0)]],
      pago: [0, [Validators.required, Validators.min(0)]],
      notas: ['']
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    this.error.set(null);
    this.loading.set(true);
    this.api.getDeudas().subscribe({
      next: data => {
        this.deudas = data || [];
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Error al cargar deudas');
        this.loading.set(false);
      }
    });
  }

  onCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const nombre = this.form.value.nombreCliente?.trim().toLowerCase();
    if (!nombre) {
      this.form.get('nombreCliente')?.setErrors({ required: true });
      return;
    }
    this.error.set(null);
    this.loading.set(true);
    this.api.getClientes().subscribe({
      next: clientes => {
        const match = (clientes || []).find((c: any) => (c.nombre || '').toLowerCase() === nombre);
        if (!match) {
          this.loading.set(false);
          this.error.set('Cliente no encontrado');
          return;
        }
        const valor = Number(this.form.value.valor ?? 0);
        const pago = Number(this.form.value.pago ?? 0);
        const devuelta = valor - pago;
        const payload: DeudaPayload = {
          id_cliente: match.id ?? match.id_cliente,
          concepto: this.form.value.concepto!,
          valor,
          pago,
          devuelta,
          notas: this.form.value.notas || ''
        };
        this.api.createDeuda(payload).subscribe({
          next: () => {
            this.loading.set(false);
            this.onSearch();
            this.form.reset({ valor: 0, pago: 0 });
          },
          error: () => {
            this.error.set('Error al crear deuda');
            this.loading.set(false);
          }
        });
      },
      error: () => {
        this.error.set('Error buscando cliente');
        this.loading.set(false);
      }
    });
  }
}
