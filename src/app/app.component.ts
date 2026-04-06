import { Component, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  segundos = 0;
  corriendo = false;

  private subscription: Subscription | null = null;

  // ✅ Observable FRÍO: se crea cada vez que se suscribe
  private crearCronometroObservable(): Observable<number> {
    return new Observable<number>((observer) => {
      let contador = this.segundos;

      const intervalo = setInterval(() => {
        contador++;
        observer.next(contador);
      }, 1000);

      // Función de limpieza que se llama al desuscribirse
      return () => {
        clearInterval(intervalo);
      };
    });
  }

  iniciar(): void {
    if (this.corriendo) return;
    this.corriendo = true;

    const cronometro$ = this.crearCronometroObservable();

    this.subscription = cronometro$.subscribe({
      next: (valor) => {
        this.segundos = valor;
      },
      error: (err) => console.error('Error en cronómetro:', err),
    });
  }

  pausar(): void {
    if (!this.corriendo) return;
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.corriendo = false;
  }

  reiniciar(): void {
    this.subscription?.unsubscribe();
    this.subscription = null;
    this.corriendo = false;
    this.segundos = 0;
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
