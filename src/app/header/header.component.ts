import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navigationItems = [
    { label: 'Musicos/Grupo', route: '/musicos' },
    { label: 'Productos', route: '/productos' },
    { label: 'Deudas', route: '/deudas' }
  ];
}
