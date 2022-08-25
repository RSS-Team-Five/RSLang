import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function dialogSignIn() {
  const dialog = new CustomElement('dialog', { className: 'dialog' });
  const header = new CustomElement('h2', { className: 'dialog__header', textContent: 'Вход' });
  const form = new CustomElement('form', { className: 'dialog__form form', noValidate: true });

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

  const btnSignUp = new CustomElement('button', { className: 'form__btn', textContent: 'Войти', type: 'submit' });
  const linkSignIn = new CustomElement('a', {
    className: 'dialog__link',
    href: '#/signUp',
    textContent: 'Ещё нет аккаунта? Регистрация!',
  });
  form.addChildren([email.element, password.element, btnSignUp.element]);
  dialog.addChildren([header.element, form.element, linkSignIn.element]);

  linkSignIn.element.addEventListener('click', (e) => {
    e.preventDefault();
    state.router?.view('/signUp');
    dialog.element.close();
  });

  function showError(input: string) {
    switch (input) {
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
        emailError.element.title = 'Эта почта не зарегистрирована';
        emailError.element.classList.add('form__error_active');
        break;

      default:
        break;
    }
  }

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
    if (!emailInput.element.validity.valid) {
      showError('email');
    }
    if (!passwordInput.element.validity.valid) {
      showError('password');
    }
    if (emailInput.element.validity.valid && passwordInput.element.validity.valid) {
      const props = {
        email: emailInput.element.value,
        password: passwordInput.element.value,
      };
      const resultSignIn = await state.user?.signInUser(props);

      if ('userId' in resultSignIn) {
        if (state.user) {
          state.user.isAuthorized = true;
        }
        state.events?.notify('userAuthorized');
        dialog.element.close();
      } else if ('error' in resultSignIn) {
        showError('email-exists');
      } else {
        // Это не должно никогда произойти
        throw new Error('Ошибка авторизации');
      }
    }
  });

  // btnSignUp.element.addEventListener('click', async (e) => {
  //   e.preventDefault();
  //   const props = {
  //     email: email.element.value,
  //     password: password.element.value,
  //   };
  //   const resultSignIn = await state.user?.signInUser(props);

  //   if ('userId' in resultSignIn) {
  //     if (state.user) {
  //       state.user.isAuthorized = true;
  //     }
  //     state.events?.notify('userAuthorized');
  //     dialog.element.close();
  //   } else if ('error' in resultSignIn) {
  //     // TODO обработать ошибки, подсветить поля.
  //     console.log(resultSignIn);
  //   } else {
  //     // Это не должно никогда произойти
  //     throw new Error('Ошибка авторизации');
  //   }
  // });

  window.addEventListener('hashchange', () => dialog.element.close());
  dialog.element.addEventListener('close', () => {
    document.body.style.overflow = 'auto';
    dialog.element.remove();
  });

  return dialog.element;
}

export default dialogSignIn;
