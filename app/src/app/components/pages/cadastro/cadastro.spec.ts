import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { UsuarioService } from '../../../services/usuario.service';
import { Cadastro } from './cadastro';

describe('Cadastro', () => {
  let component: Cadastro;
  let fixture: ComponentFixture<Cadastro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cadastro],
      providers: [
        provideRouter([]),
        {
          provide: UsuarioService,
          useValue: {
            criar: vi.fn(() =>
              of({
                id: 1,
                nome: 'Usuario Teste',
                email: 'usuario@teste.com',
                cpf: '12345678901',
              }),
            ),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cadastro);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
