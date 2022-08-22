import state from '../../models/State';
import CustomElement from '../../utils/customElement';

function dialogSignUp() {
  const dialog = new CustomElement('dialog', { className: 'dialog' });
  const header = new CustomElement('h2', { className: 'dialog__header', textContent: 'Регистрация' });
  const name = new CustomElement('input', { className: 'dialog__name', type: 'text', placeholder: 'Имя' });
  const email = new CustomElement('input', { className: 'dialog__email', type: 'text', placeholder: 'Почта' });
  const password = new CustomElement('input', { className: 'dialog__password', type: 'text', placeholder: 'Пароль' });
  const btnSignUp = new CustomElement('button', { className: 'dialog__btn', textContent: 'Зарегистрироваться' });
  const linkSignIn = new CustomElement('a', {
    className: 'dialog__link',
    href: '#/signIn',
    textContent: 'Уже есть аккаунт? Войти!',
  });
  dialog.addChildren([
    header.element,
    name.element,
    email.element,
    password.element,
    btnSignUp.element,
    linkSignIn.element,
  ]);

  btnSignUp.element.addEventListener('click', async () => {
    const props = {
      name: name.element.value,
      email: email.element.value,
      password: password.element.value,
    };
    const result = await state.user?.createUser(props);
    console.log(result);
  });

  window.addEventListener('hashchange', () => dialog.element.close());
  dialog.element.addEventListener('close', () => {
    document.body.style.overflow = 'auto';
    dialog.element.remove();
  });

  return dialog.element;
}

export default dialogSignUp;
