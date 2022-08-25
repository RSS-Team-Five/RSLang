import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function dialogSignIn() {
  const dialog = new CustomElement('dialog', { className: 'dialog' });
  const header = new CustomElement('h2', { className: 'dialog__header', textContent: 'Вход' });
  const form = new CustomElement('form', { className: 'dialog__form form' });
  const email = new CustomElement('input', { className: 'form__email', type: 'text', placeholder: 'Почта' });
  const password = new CustomElement('input', { className: 'form__password', type: 'text', placeholder: 'Пароль' });
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

  btnSignUp.element.addEventListener('click', async (e) => {
    e.preventDefault();
    const props = {
      email: email.element.value,
      password: password.element.value,
    };
    const resultSignIn = await state.user?.signInUser(props);

    if ('userId' in resultSignIn) {
      if (state.user) {
        state.user.isAuthorized = true;
      }
      state.events?.notify('userAuthorized');
      dialog.element.close();
    } else if ('error' in resultSignIn) {
      // TODO обработать ошибки, подсветить поля.
      console.log(resultSignIn);
    } else {
      // Это не должно никогда произойти
      throw new Error('Ошибка авторизации');
    }
  });

  window.addEventListener('hashchange', () => dialog.element.close());
  dialog.element.addEventListener('close', () => {
    document.body.style.overflow = 'auto';
    dialog.element.remove();
  });

  return dialog.element;
}

export default dialogSignIn;
