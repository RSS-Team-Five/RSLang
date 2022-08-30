import CustomElement from '../../utils/customElement';
import anna from '../../assets/images/Anna.jpg';
import igor from '../../assets/images/Igor.jpg';
import yuliya from '../../assets/images/Yuliya.jpg';

function createAboutUsPage() {
  const aboutUsWrapper = new CustomElement('div', {
    className: 'about-us__wrapper',
  });

  const intro = new CustomElement('p', {
    className: 'aboutUs__intro',
    innerHTML: `Приятно познакомиться! Мы - Игорь, Аня и Юля - команда молодых frontend разработчиков, выпускников курса JavaScript/Front-end онлайн школы <b>RS School</b>.
    Этот познавательный сайт - наша совместная финальная работа. Во время реализации данного проекта мы применили все полученные знания и постарались сделать его удобным, интересным, быстрым и качественным.
    В своей работе мы использовали следующие инструменты разработки: TypeScript, Webpack, SASS, EsLint, Prettier, StyleLint, Canvas.
    Организацию процесса работы вели в соответствии с принципами Agile по гибкой методологии Kanban. Старались сбалансировать работу каждого разработчика, равномерно распределить задачи.
    У нас не было роли владельца продукта и scrum-мастера ввиду небольшого проекта. Процесс работы делился не на универсальные спринты, а на стадии выполнения конкретной задачи.
    Для визуализации наших процессов использовали такие инструменты, как Trello, Miro.
    Каждую неделю проводили статусные звонки с ведением лога и ежедневно - короткие онлайн митинги.
    Командная работа сложная, но очень познавательная и продуктивная.
    Надеемся, что изучение английского языка с нашим приложением будет для Вас увлекательным.`,
  });
  aboutUsWrapper.addChildren([intro.element]);

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
  const allCards = new CustomElement('div', {
    className: 'about-us__cards',
  });

  we.forEach((unit) => {
    const cardWrapper = new CustomElement('div', {
      className: 'about-us__card',
    });

    const cardImg = new CustomElement('img', {
      className: 'about-us__img',
      src: unit.photo,
      alt: unit.name,
    });
    const cardName = new CustomElement('p', {
      className: 'about-us__name',
      innerHTML: unit.name,
    });

    const cardCity = new CustomElement('p', {
      className: 'about-us__city',
      innerHTML: unit.from,
    });

    const cardAbout = new CustomElement('p', {
      className: 'about-us__about',
      innerHTML: unit.about,
    });

    cardWrapper.addChildren([cardImg.element, cardName.element, cardCity.element, cardAbout.element]);
    allCards.addChildren([cardWrapper.element]);
  });

  aboutUsWrapper.addChildren([allCards.element]);
  return aboutUsWrapper.element;
}

export default createAboutUsPage;
