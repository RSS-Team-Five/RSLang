import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function dialogSignUp() {
  const dialog = new CustomElement('dialog', { className: 'dialog' });
  const header = new CustomElement('h2', { className: 'dialog__header', textContent: 'Регистрация' });
  const form = new CustomElement('form', { className: 'dialog__form form' });
  const name = new CustomElement('input', { className: 'form__name', type: 'text', placeholder: 'Имя' });
  const email = new CustomElement('input', { className: 'form__email', type: 'text', placeholder: 'Почта' });
  const password = new CustomElement('input', { className: 'form__password', type: 'text', placeholder: 'Пароль' });
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

  btnSignUp.element.addEventListener('click', async (e) => {
    e.preventDefault();
    const props = {
      name: name.element.value,
      email: email.element.value,
      password: password.element.value,
    };
    const resultSignUp = await state.user?.createUser(props);

    if ('id' in resultSignUp) {
      const resultSignIn = await state.user?.signInUser(props);
      if ('userId' in resultSignIn) {
        if (state.user) state.user.isAuthorized = true;
        localStorage.setItem('userId', resultSignIn.userId);
        localStorage.setItem('token', resultSignIn.token);
        localStorage.setItem('refreshToken', resultSignIn.refreshToken);
        state.events?.notify('userAuthorized');
        dialog.element.close();
      } else {
        // Это не должно никогда произойти
        throw new Error('Ошибка авторизации');
      }
    } else {
      // TODO обработать ошибки регистрации, подсветить строки.
      console.log('FAIL', resultSignUp);
      console.log('FAIL', state.user);
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
