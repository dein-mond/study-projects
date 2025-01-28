(() => {
  let flipCards = [];
  let memoryCard = 0;
  let count = 0;
  let timeLimit = 60;
  let timer = document.createElement('span');
  timer.classList.add('timer');
  let time;
  let lockBoard = false;

  // функция обратного отсчета
  function countdown() {
    timer.innerHTML = timeLimit;
    timeLimit--;
    if (timeLimit < 0) {
      clearTimeout(time);
      alert('Время игры закончилось');
      window.location.reload();
    }
    else {
      time = setTimeout(countdown, 1000);
    }
  }

  // создание заголовка
  function createAppTitle() {
    let startTitle = document.createElement('h2');
    startTitle.textContent = "Найди пару";
    startTitle.classList.add("main-title");
    return startTitle;
  }

  // создание формы запроса количества карточек по вертикали/горизонтали
  function createAppForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let button = document.createElement('button');

    // добавляем классы и необходимые атрибуты
    form.classList.add('form', 'flex');
    input.classList.add('form-input');
    input.type = "number"
    input.placeholder = 'Количество карточек по вертикали/горизонтали';
    button.classList.add('btn', 'btn-reset');
    button.textContent = 'Начать игру';
    form.append(input);
    form.append(button);

    return {
      form,
      input,
      button
    }
  }

  // Этап 1. Создайте функцию, генерирующую массив парных чисел. Пример массива, который должна возвратить функция: [1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8].count - количество пар.
  function createNumbersArray(count) {
    let numbersArr = [];
    for (let i = 1; i <= count; ++i) {
      numbersArr.push(i);
      numbersArr.push(i);
    }
    return numbersArr;
  }

  // Этап 2. Создайте функцию перемешивания массива.Функция принимает в аргументе исходный массив и возвращает перемешанный массив. arr - массив чисел
  function shuffle(arr) {
    let i = arr.length;
    while (--i > 0) {
      let randIndex = Math.floor(Math.random() * (i + 1));
      [arr[randIndex], arr[i]] = [arr[i], arr[randIndex]];
    }
    return arr;
  }

  // создаем список карточек
  function createCards(arr) {
    let list = document.createElement('ul');
    list.classList.add('list-reset', 'flex', 'cards');
    let className;
    switch (arr.length) {
      case 4:
        className = "cards-item-2";
        break;
      case 16:
        className = "cards-item-4";
        break;
      case 36:
        className = "cards-item-6";
        break;
      case 64:
        className = "cards-item-8";
        break;
      case 100:
        className = "cards-item-10";
        break;
      default:
        className = "cards-item-4";
        break;
    }
    for (let i = 0; i < arr.length; ++i) {
      let listItem = createCard(arr[i], className);
      list.append(listItem);
    }
    return list;
  }

  // создание карточки
  function createCard(numberOfArr, className) {
    let done = false;
    let listItem = document.createElement('li');
    let listItemFront = document.createElement('div');
    let listItemBack = document.createElement('div');
    listItem.classList.add('flex', 'card', className);
    listItemFront.classList.add('cards-item-front', 'card-face');
    listItemBack.classList.add('cards-item-back', 'card-face');
    listItemBack.textContent = numberOfArr;
    listItem.append(listItemFront);
    listItem.append(listItemBack);

    listItem.addEventListener('click', () => {
      if (lockBoard) return;
      done = !done;

      if (done) {
        flipCards.push({ numberOfArr, done, listItem });
        listItem.classList.add("flip");
        listItem.classList.add("noclick-card");

      }

      if (flipCards.length === 2) {
        lockBoard = true;
        if (flipCards[0].numberOfArr !== flipCards[1].numberOfArr) {
          setTimeout(() => {
            flipCards[0].listItem.classList.remove('flip');
            flipCards[1].listItem.classList.remove('flip');
            flipCards[0].listItem.classList.remove('noclick-card');
            flipCards[1].listItem.classList.remove('noclick-card');
            done = false;
            flipCards = [];
            lockBoard = false;
          }, 800);
        } else {
          flipCards = [];
          memoryCard = memoryCard + 1;
          lockBoard = false;
        }
      } else {
        done = false;
      }

      playAgain();
    });
    return listItem;
  }

  function playAgain() {
    let button = document.createElement('button');
    button.classList.add('btn', 'btn-reset');
    button.textContent = 'Сыграть еще раз';
    let className = document.querySelector(".container");
    if (memoryCard === count) {
      className.append(button);
      clearTimeout(time);
      button.addEventListener('click', () => {
        window.location.reload();
      });

    }
  }

  // Этап 3. Используйте две созданные функции для создания массива перемешанными номерами. На основе этого массива вы можете создать DOM-элементы карточек. У каждой карточки будет свой номер из массива произвольных чисел. Вы также можете создать для этого специальную функцию. count - количество пар.
  function startGame() {
    let container = document.createElement('div');
    container.classList.add('container', 'flex');

    let startTitle = createAppTitle();

    let startForm = createAppForm();


    document.body.append(container);
    container.append(startTitle);
    container.append(startForm.form);
    startForm.form.addEventListener('submit', function (e) {
      startTitle.after(timer);
      e.preventDefault();
      // игнорируем создание элемента, если пользователь ничего не ввел
      if (!startForm.input.value) {
        return;
      }

      count = startForm.input.value;
      if (count <= 10 && count >= 2 && count % 2 === 0) {
        count = count * count / 2
      } else {
        count = 8;
      }

      let shuffleNumbersArr = shuffle(createNumbersArray(count));
      container.append(createCards(shuffleNumbersArr));

      countdown();
      startForm.input.value = "";
      startForm.form.classList.add('hidden');
    });

  }
  window.startGame = startGame;
})();
