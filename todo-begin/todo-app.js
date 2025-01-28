(function () {
  let keyName;
  // создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  }

  // создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');

    // добавляем классы и необходимые атрибуты
    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';


    form.append(input);
    form.append(buttonWrapper);
    buttonWrapper.append(button);

    return {
      form,
      input,
      button
    }
  }

  // создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  }

  // создаем и возвращаем элемент списка
  function createTodoItem({ id, name, done = "false" }) {
    let item = document.createElement('li');

    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

    if (done) {
      item.classList.add('list-group-item-success');
    }
    item.textContent = name;

    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    item.append(buttonGroup);
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);

    // обрабочики кнопок
    doneButton.addEventListener('click', function () {
      item.classList.toggle('list-group-item-success');
      let cart = getCardDataJson(keyName);
      for (let i=0;i<cart.length;i++){
        if (cart[i].id === id){
          cart[i].done = !(cart[i].done);
        }
      }
      setCardDataToJson(keyName, cart)
    })
    deleteButton.addEventListener('click', function () {
      if (confirm('Вы уверены?')) {
        item.remove();
        let cart = getCardDataJson(keyName);
        let newTodoListArray = [];
        for (let i=0;i<cart.length;i++){
          if (cart[i].id !== id){
            newTodoListArray.push(cart[i])
          }
        }
        setCardDataToJson(keyName, newTodoListArray)
      }
    });

    return {
      item,
      doneButton,
      deleteButton
    };
  }

  // создаем функцию для id
  function generateId(arr) {
    if (arr.length === 0 || arr.length === 1) {
      return arr.length + 1;
    } else {
      let max = 0;
      for (let i = 0; i < arr.length - 1; ++i) {
        if (arr[i].id > arr[i + 1].id) {
          max = arr[i].id;
        } else {
          max = arr[i + 1].id;
        }
      }
      return (max + 1);
    }
  }

  // объединение setCardData и dataToJson
  function setCardDataToJson(id, name) {
    return localStorage.setItem(id, JSON.stringify(name));
  }

  function getCardDataJson(id) {
    let cart = localStorage.getItem(id);
    if (cart) {
      return JSON.parse(cart);
    } else {
      return [];
    }
  }

  function createTodoApp(container, title = 'Список дел', listName) {
    keyName = listName;
    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();

    todoItemForm.button.disabled = true;

    let todoListArr = getCardDataJson(listName);

    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    for (let i = 0; i < todoListArr.length; ++i) {
      let newTodoItem = createTodoItem({ id: todoListArr[i].id, name: todoListArr[i].name, done: todoListArr[i].done })
      todoList.append(newTodoItem.item);
    }

    todoItemForm.input.addEventListener('input', function () {
      todoItemForm.button.disabled = false;
    })

    // браузер создает событие на форме по нажатию на Enter  или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      let done = false;
      todoItemForm.button.disabled = true;
      todoListArr = getCardDataJson(listName);
      // прдетвращаем перезагрузку страницы в случае отправки формы
      e.preventDefault();

      // игнорируем создание элемента, если пользователь ничего не ввел
      if (!todoItemForm.input.value) {
        return;
      }

      let name = todoItemForm.input.value;
      let id = generateId(todoListArr);
      let todoItem = createTodoItem({ id, name, done });

      todoListArr.push({ id, name, done });
      setCardDataToJson(listName, todoListArr)

      // создаем и добавляем новое дело из поля для ввода
      todoList.append(todoItem.item);

      //стираем поле для ввода
      todoItemForm.input.value = '';
    });
  }
  window.createTodoApp = createTodoApp;
})();
