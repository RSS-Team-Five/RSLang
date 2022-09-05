import CustomElement from '../../utils/customElement';
import anna from '../../assets/images/Anna.jpg';
import igor from '../../assets/images/Igor.jpg';
import yuliya from '../../assets/images/Yuliya.jpg';

function createAboutUsPage() {
  const aboutUsPanels = new CustomElement('div', {
    className: 'about-us__panels panel',
  });
  const introPanel = new CustomElement('div', {
    className: 'panel__intro',
  });
  const cardsPanel = new CustomElement('div', {
    className: 'panel__cards',
  });
  aboutUsPanels.addChildren([introPanel.element, cardsPanel.element]);

  const aboutUsWrapper = new CustomElement('div', {
    className: 'about-us__wrapper about-page',
  });
  const introWrapper = new CustomElement('div', {
    className: 'about-page__intro-wrapper',
  });
  const cardsWrapper = new CustomElement('div', {
    className: 'about-page__cards-wrapper',
  });

  const intro = new CustomElement('div', {
    className: 'about-page__intro intro',
  });
  const introHeader = new CustomElement('h2', {
    className: 'intro__header',
    innerText: 'О нас',
  });
  const introContent = new CustomElement('p', {
    className: 'intro__content',
    innerHTML: `<p>Приятно познакомиться! Мы - Игорь, Аня и Юля - команда молодых frontend разработчиков, выпускников курса JavaScript/Front-end онлайн школы <b>RS School</b>.</p>
    <p>Этот познавательный сайт - наша совместная финальная работа.</p>
    <p>Во время реализации данного проекта мы применили все полученные знания и постарались сделать его удобным, интересным, быстрым и качественным.
    В своей работе мы использовали следующие инструменты разработки: TypeScript, Webpack, SASS, EsLint, Prettier, StyleLint, Canvas, Git, GitHub-actions.</p>
    <p>Организацию процесса работы вели в соответствии с принципами Agile по гибкой методологии Kanban. Старались сбалансировать работу каждого разработчика, равномерно распределить задачи.
    У нас не было роли владельца продукта и scrum-мастера ввиду небольшого проекта. Процесс работы делился не на универсальные спринты, а на стадии выполнения конкретной задачи.
    Для визуализации наших процессов использовали такие инструменты, как Trello, Miro.
    Каждую неделю проводили статусные звонки с ведением лога и ежедневно - короткие онлайн митинги.</p>
    <p>Командная работа сложная, но очень познавательная и продуктивная.</p>
    <p>Надеемся, что изучение английского языка с нашим приложением будет для Вас увлекательным.</p>`,
  });
  intro.addChildren([introHeader.element, introContent.element]);
  introWrapper.addChildren([intro.element]);

  const cards = new CustomElement('div', {
    className: 'about-page__cards about-cards',
  });
  const we = [
    {
      name: 'Игорь',
      photo: igor,
      from: 'г. Корсаков, Россия',
      about:
        'На вопрос, что ты думаешь о программировании, Игорь ответил: "да... я сунулся туда... но вовремя передумал)"',
    },
    {
      name: 'Анна',
      photo: anna,
      from: 'г. Екатеринбург, Россия',
      about:
        'Иду в тц за кофе, вижу кучу людей, которые гуляют и думаю «неужели они все уже доделали проект, что ходят развлекаются?»',
    },
    {
      name: 'Юлия',
      photo: yuliya,
      from: 'г. Гданьск, Польша',
      about:
        'Год назад полностью поменяла жизнь - работу, страну. Учусь выживать в океане программирования, надеюсь, не утону :)',
    },
  ];

  we.forEach((unit) => {
    const cardWrapper = new CustomElement('div', {
      className: 'about-card',
    });

    const cardImgWrapper = new CustomElement('div', {
      className: 'about-card__img-wrapper',
    });
    const cardImg = new CustomElement('img', {
      className: 'about-card__img',
      src: unit.photo,
      alt: unit.name,
    });
    cardImgWrapper.addChildren([cardImg.element]);

    const cardContentWrapper = new CustomElement('div', {
      className: 'about-card__content-wrapper',
    });
    const cardName = new CustomElement('p', {
      className: 'about-card__name',
      innerHTML: unit.name,
    });
    const cardCity = new CustomElement('p', {
      className: 'about-card__city',
      innerHTML: unit.from,
    });
    const cardAbout = new CustomElement('p', {
      className: 'about-card__about',
      innerHTML: unit.about,
    });
    cardContentWrapper.addChildren([cardName.element, cardCity.element, cardAbout.element]);

    cardWrapper.addChildren([cardImgWrapper.element, cardContentWrapper.element]);
    cards.addChildren([cardWrapper.element]);
  });

  cardsWrapper.addChildren([cards.element]);

  aboutUsWrapper.addChildren([introWrapper.element, cardsWrapper.element]);

  const fragment = document.createDocumentFragment();
  fragment.append(aboutUsPanels.element, aboutUsWrapper.element);
  return fragment;
}

export default createAboutUsPage;
