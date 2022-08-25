import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function dialogSignUp() {
  const dialog = new CustomElement('dialog', { className: 'dialog' });
  const header = new CustomElement('h2', { className: 'dialog__header', textContent: 'Регистрация' });
  const form = new CustomElement('form', { className: 'dialog__form form', noValidate: true });

  const name = new CustomElement('div', { className: 'form__wrapper' });
  const nameInput = new CustomElement('input', {
    className: 'form__name',
    type: 'text',
    placeholder: 'Имя',
    required: true,
  });
  const nameError = new CustomElement('div', {
    className: 'form__error material-symbols-outlined',
    title: '',
    textContent: 'warning',
  });
  name.addChildren([nameInput.element, nameError.element]);

  const email = new CustomElement('div', { className: 'form__wrapper' });
  const emailInput = new CustomElement('input', {
    className: 'form__email',
    type: 'email',
    placeholder: 'Почта',
    required: true,
    pattern: '^([a-zA-Z0-9_\\-.]+)@([a-zA-Z0-9_\\-.]+).([a-zA-Z]{2,5})$',
  });
  const emailError = new CustomElement('div', {
    className: 'form__error material-symbols-outlined',
    title: '',
    textContent: 'warning',
  });
  email.addChildren([emailInput.element, emailError.element]);

  const password = new CustomElement('div', { className: 'form__wrapper' });
  const passwordInput = new CustomElement('input', {
    className: 'form__password',
    type: 'text',
    placeholder: 'Пароль',
    required: true,
    minLength: 8,
  });
  const passwordError = new CustomElement('div', {
    className: 'form__error material-symbols-outlined',
    title: '',
    textContent: 'warning',
  });
  password.addChildren([passwordInput.element, passwordError.element]);

  const btnSignUp = new CustomElement('button', {
    className: 'form__btn',
    textContent: 'Зарегистрироваться',
    type: 'submit',
  });
  const linkSignIn = new CustomElement('a', {
    className: 'dialog__link',
    href: '#/signIn',
    textContent: 'Уже есть аккаунт? Войти!',
  });

  form.addChildren([name.element, email.element, password.element, btnSignUp.element]);
  dialog.addChildren([header.element, form.element, linkSignIn.element]);

  linkSignIn.element.addEventListener('click', (e) => {
    e.preventDefault();
    state.router?.view('/signIn');
    dialog.element.close();
  });

  function showError(input: string) {
    switch (input) {
      case 'name':
        if (nameInput.element.validity.valueMissing) {
          nameError.element.title = 'Поле не должно быть пустым';
        }
        nameError.element.classList.add('form__error_active');
        break;

      case 'email':
        if (emailInput.element.validity.valueMissing) {
          emailError.element.title = 'Поле не должно быть пустым';
        } else if (emailInput.element.validity.patternMismatch) {
          emailError.element.title = 'Почта должна быть валидна';
        }
        emailError.element.classList.add('form__error_active');
        break;

      case 'password':
        if (passwordInput.element.validity.valueMissing) {
          passwordError.element.title = 'Поле не должно быть пустым';
        } else if (passwordInput.element.validity.tooShort) {
          passwordError.element.title = `Пароль должен быть не короче ${passwordInput.element.minLength} символов; сейчас ${passwordInput.element.value.length}.`;
        }
        passwordError.element.classList.add('form__error_active');
        break;

      case 'email-exists':
        emailError.element.title = 'Эта почта уже занята';
        emailError.element.classList.add('form__error_active');
        break;

      default:
        break;
    }
  }

  nameInput.element.addEventListener('input', () => {
    if (nameInput.element.validity.valid) {
      nameError.element.title = '';
      nameError.element.classList.remove('form__error_active');
    } else {
      showError('name');
    }
  });
  emailInput.element.addEventListener('input', () => {
    if (emailInput.element.validity.valid) {
      emailError.element.title = '';
      emailError.element.classList.remove('form__error_active');
    } else {
      showError('email');
    }
  });
  passwordInput.element.addEventListener('input', () => {
    if (passwordInput.element.validity.valid) {
      passwordError.element.title = '';
      passwordError.element.classList.remove('form__error_active');
    } else {
      showError('password');
    }
  });
  form.element.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!nameInput.element.validity.valid) {
      showError('name');
    }
    if (!emailInput.element.validity.valid) {
      showError('email');
    }
    if (!passwordInput.element.validity.valid) {
      showError('password');
    }
    if (nameInput.element.validity.valid && emailInput.element.validity.valid && passwordInput.element.validity.valid) {
      const props = {
        name: nameInput.element.value,
        email: emailInput.element.value,
        password: passwordInput.element.value,
      };
      const resultSignUp = await state.user?.createUser(props);

      if ('id' in resultSignUp) {
        const resultSignIn = await state.user?.signInUser(props);
        if ('userId' in resultSignIn) {
          if (state.user) state.user.isAuthorized = true;
          state.events?.notify('userAuthorized');
          dialog.element.close();
        } else {
          // Это не должно никогда произойти
          throw new Error('Ошибка авторизации');
        }
      } else {
        showError('email-exists');
      }
    }
  });

  window.addEventListener('hashchange', () => dialog.element.close());
  dialog.element.addEventListener('close', () => {
    document.body.style.overflow = 'auto';
    dialog.element.remove();
  });

  return dialog.element;
}

export default dialogSignUp;
