import { Component, OnInit, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService, ClientePayload } from '../api.service';
import { DataCardComponent } from '../data-card/data-card.component';

@Component({
  selector: 'app-musicos-grupo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DataCardComponent],
  templateUrl: './musicos-grupo.component.html',
  styleUrl: './musicos-grupo.component.css'
})
export class MusicosGrupoComponent implements OnInit {
  title = 'Músicos/Grupo';

  clientes: any[] = [];
  loading = signal(false);
  error = signal<string | null>(null);

  form: ReturnType<FormBuilder['group']>;

  constructor(private fb: FormBuilder, private api: ApiService) {
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      contacto: [''],
      clase: ['musico', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSearch(): void {
    this.error.set(null);
    this.loading.set(true);
    this.api.getClientes().subscribe({
      next: data => {
        this.clientes = data || [];
        this.loading.set(false);
      },
      error: err => {
        this.error.set('Error al cargar clientes');
        this.loading.set(false);
      }
    });
  }

  onCreate(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: ClientePayload = {
      nombre: this.form.value.nombre!,
      contacto: this.form.value.contacto || '',
      clase: this.form.value.clase || 'musico'
    };
    this.error.set(null);
    this.loading.set(true);
    this.api.createCliente(payload).subscribe({
      next: created => {
        this.loading.set(false);
        this.onSearch();
        this.form.reset({ clase: 'musico' });
      },
      error: err => {
        this.error.set('Error al crear cliente');
        this.loading.set(false);
      }
    });
  }
}
