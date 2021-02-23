(() => {

  function createForm() {
    let form = document.createElement('form');
    let label = document.createElement('div')
    let input = document.createElement('input');
    let checkContainer = document.createElement('div');
    let checkBox = document.createElement('input')
    let checkLabel = document.createElement('div')
    let button = document.createElement('button');

    form.classList.add('form');
    label.classList.add('form__label');
    label.textContent = 'Кол-во карточек по вертикали/горизонтали (четное число от 2 до 10)';
    input.classList.add('form__input');
    input.placeholder = '4';
    checkContainer.classList.add('form__checkContainer');
    checkBox.classList.add('form__checkbox');
    checkBox.type = "checkbox";
    checkLabel.classList.add('form__checkLabel')
    checkLabel.textContent = 'Включить таймер';
    button.classList.add('form__btn');
    button.textContent = 'Начать игру';

    checkContainer.append(checkBox);
    checkContainer.append(checkLabel);

    form.append(label);
    form.append(input);
    form.append(checkContainer);
    form.append(button);

    return {
      form,
      input,
      checkBox,
      button,
    };
  }

  function counter(count) {
    if (count < 2 || count > 10 || count % 2 === 1 || !count) {
      count = 4;
    }
    return count;
  }

  function createField(count) {
    count = count * count / 2
    let array = [];
    for (let i = 0; i < count; i++) {
      array[i] = i + 1;
    }
    for (let i = count; i < count * 2; i++) {
      array[i] = i - count + 1;
    }
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }

    let container = document.createElement('ul');
    container.classList.add('container');
    container.style.width = toString(count * 50) + 'px';

    for (let i = 0; i < array.length; i++) {
      let card = document.createElement('li');
      card.classList.add('card');
      card.textContent = array[i];
      container.append(card);
    }

    return {
      container
    }
  }

  function createTimer() {
    let timer = document.createElement('div');
    timer.classList.add('field__timer');
    timer.textContent = '5';
    return timer;
  }

  function createButton() {
    let button = document.createElement('button');
    button.classList.add('field__btn');
    button.textContent = 'Сыграть еще раз';
    return button;
  }

  function createApp()
  {
    const form = createForm();
    document.body.append(form.form);

    document.querySelector('.form__btn').addEventListener('click', (e) => {

      e.preventDefault();

      const field = createField(counter(parseInt(form.input.value)));
      document.body.append(field.container);

      document.querySelector('.container').style.width = (counter(parseInt(form.input.value)) * 60) + 'px';

      const timer = createTimer();

      let idTimer;

      function timerCount() {
        document.querySelector('.field__timer').textContent = parseInt(document.querySelector('.field__timer').textContent) - 1;
      }

      if (document.querySelector('.form__checkbox').checked) {
        document.body.append(timer);
        idTimer = setInterval(timerCount, 1000);
      }

      document.querySelector('.form').remove();

      let pairArr = [];
      let cardsArray = document.querySelectorAll('.card');
      let newCardsArr = [];
      for (let i = 0; i < cardsArray.length; i++) {
        newCardsArr.push({value: cardsArray[i], label: false});
      }
      for (let i = 0; i < cardsArray.length; i++) {
        cardsArray[i].addEventListener('click', () => {
          if (pairArr.length < 2) {
            cardsArray[i].classList.add('card--is-active');
            pairArr.push({index: i, value: cardsArray[i].textContent});
            if (pairArr.length === 2) {
              window.setTimeout(() => {
                if (pairArr[0].index != pairArr[1].index && newCardsArr[pairArr[0].index].label === false && newCardsArr[pairArr[1].index].label === false) {
                  if (pairArr[0].value != pairArr[1].value) {
                      cardsArray[pairArr[0].index].classList.remove('card--is-active');
                      cardsArray[pairArr[1].index].classList.remove('card--is-active');
                  }
                  else {
                    newCardsArr[pairArr[0].index].label = true;
                    newCardsArr[pairArr[1].index].label = true;
                  }
                  pairArr.length = 0;
                }
                else {
                  if (pairArr[0]) if (newCardsArr[pairArr[0].index].label === true) pairArr.splice(0, 1);
                  if (pairArr[1]) if (newCardsArr[pairArr[1].index].label === true) pairArr.splice(1, 1);
                  if (pairArr[0] && pairArr[1]) pairArr.splice(1, 1);
                }
                let count = 0;
                for (let i = 0; i < newCardsArr.length; i++) {
                  if (newCardsArr[i].label === true) count++;
                }
                if (count === newCardsArr.length) {
                  clearInterval(idTimer);
                  const button = createButton();
                  document.body.append(button);
                  document.querySelector('.field__btn').addEventListener('click', () => {
                    document.querySelector('.container').remove();
                    document.querySelector('.field__btn').remove();
                    document.querySelector('.field__timer').remove();
                    createApp();
                  })
                }
              }, 500);
            }
          }
        })
      };
    })
  }

  window.createApp = createApp;

})();

document.addEventListener('DOMContentLoaded', () => {
  createApp();
});
