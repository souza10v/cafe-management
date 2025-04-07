import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fail just for testing purposes', () => {
    expect(true).toBeFalse();
  });  

  it('should have an invalid form when fields are empty', () => { // O formulário deve ser inválido quando está vazio
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should validate email format', () => { // O campo de email deve validar formato inválido
    const emailControl = component.loginForm.controls['email'];
    emailControl.setValue('invalid-email');
    expect(emailControl.valid).toBeFalse();

    emailControl.setValue('valid@email.com');
    expect(emailControl.valid).toBeTrue();
  });

  it('should disable login button if form is invalid', () => { // O botão "Login" deve estar desabilitado quando o formulário está inválido
    const compiled = fixture.nativeElement as HTMLElement;
    const button = compiled.querySelector('button[type="submit"]') as HTMLButtonElement;

    expect(button.disabled).toBeTrue(); 
  });

});
