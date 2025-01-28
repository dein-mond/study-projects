(function () {
  function makeStudent(surname, name, middlename, birthday, startYear, faculty) {
    return {
      surname: surname,
      name: name,
      middlename: middlename,
      birthday: birthday,
      startYear: startYear,
      faculty: faculty
    };
  }
  function getAge(date) {
    let today = new Date();
    let birthDate = date;
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    if (age % 10 === 1 && (age > 20 || age < 10)) {
      return `${age} год`;
    } else if ((age % 10 === 2 || age % 10 === 3 || age % 10 === 4) && (age > 20 || age < 10)) {
      return `${age} годa`;
    } else {
      return `${age} лет`;
    }
  }

  function addStudent({ surname, name, middlename, birthday, startYear, faculty }) {
    let studentItem = document.createElement('tr');
    let studentFIO = document.createElement('td');
    let studentFaculty = document.createElement('td');
    let studentBirthday = document.createElement('td');
    let studentUnit = document.createElement('td');
    let month = new Date().getMonth() + 1;
    if ((month >= 9 && (startYear + 4) === new Date().getFullYear()) || (startYear + 4) < new Date().getFullYear()) {
      studentUnit.textContent = `${startYear}-${startYear + 4} (закончил)`;
    } else if (month < 9) {
      studentUnit.textContent = `${startYear}-${startYear + 4} (${new Date().getFullYear() - startYear} курс)`;
    } else if (month >= 9) {
      studentUnit.textContent = `${startYear}-${startYear + 4} (${new Date().getFullYear() - startYear + 1} курс)`;
    }

    month = birthday.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    studentFIO.textContent = surname + ' ' + name + ' ' + middlename;
    studentFaculty.textContent = faculty;
    studentBirthday.textContent = `${birthday.getDate()}.${month}.${birthday.getFullYear()} (${getAge(birthday)})`;

    studentItem.append(studentFIO);
    studentItem.append(studentFaculty);
    studentItem.append(studentBirthday);
    studentItem.append(studentUnit);

    return studentItem;
  }
  function createTable(studArr) {
    let studTable = document.createElement('table');
    studTable.classList.add("table", "table-bordered", "border-success");

    let thead = document.createElement('thead');
    let headerRow = document.createElement('tr');
    let headers = ['ФИО', 'Факультет', 'Дата рождения (возраст)', 'Период обучения'];

    headers.forEach(headerText => {
      let th = document.createElement('th');
      th.textContent = headerText;
      headerRow.append(th);
    });

    thead.append(headerRow);
    studTable.append(thead);

    let tbody = document.createElement('tbody');
    studArr.forEach(student => {
      let studentItem = addStudent(student);
      tbody.append(studentItem);
    });

    studTable.append(tbody);
    studTable.rows[0].cells[0].addEventListener('click', function () {
      studArr = sortArr(studArr, 'surname');
      tbody.innerHTML = '';
      studArr.forEach(student => {
        let studentItem = addStudent(student);
        tbody.append(studentItem);
      });
    });
    studTable.rows[0].cells[1].addEventListener('click', function () {
      studArr = sortArr(studArr, 'faculty');
      tbody.innerHTML = '';
      studArr.forEach(student => {
        let studentItem = addStudent(student);
        tbody.append(studentItem);
      });
    });
    studTable.rows[0].cells[2].addEventListener('click', function () {
      studArr = sortArr(studArr, 'birthday');
      tbody.innerHTML = '';
      studArr.forEach(student => {
        let studentItem = addStudent(student);
        tbody.append(studentItem);
      });
    });
    studTable.rows[0].cells[3].addEventListener('click', function () {
      studArr = sortArr(studArr, 'startYear');
      tbody.innerHTML = '';
      studArr.forEach(student => {
        let studentItem = addStudent(student);
        tbody.append(studentItem);
      });
    });
    return studTable;
  }

  function sortArr(arr, key) {
    let result = arr.sort((a, b) => a[key] >= b[key] ? 1 : -1);
    return result;
  }

  function createStudentApp(container) {
    let studentArr = [];
    studentArr.push(makeStudent('Яндубаева', 'Анастасия', 'Григорьевна', new Date(2003, 2, 15), 2021, 'Инфомационные технологии и интеллектуальные системы'));
    studentArr.push(makeStudent('Петрова', 'Ольга', 'Игоревна', new Date(2000, 4, 2), 2019, 'История'));
    studentArr.push(makeStudent('Сидорова', 'Анна', 'Алексеевна', new Date(2000, 1, 21), 2022, 'Лингвистика'));
    studentArr.push(makeStudent('Сидоров', 'Дмитрий', 'Сергеевич', new Date(2004, 5, 19), 2022, 'Лингвистика'));
    studentArr.push(makeStudent('Кузнецов', 'Владимир', 'Игоревич', new Date(2005, 9, 23), 2023, 'Экономика'));

    let studentTable = createTable(studentArr);
    container.append(studentTable);
    document.getElementById('myForm').addEventListener('submit', function (e) {
      e.preventDefault();
      let empty = true;
      let surname = document.getElementById('inputSurname');
      let name = document.getElementById('inputName');
      let middlename = document.getElementById('inputMiddlename');
      let birthDate = document.getElementById('inputBirthday');
      let startYear = document.getElementById('inputStartDay');
      let faculty = document.getElementById('inputFaculty');
      let oldErrors = document.getElementById('myForm').querySelectorAll('.error-message');
      oldErrors.forEach(error => error.remove());
      let errors = [];
      let inputsText = [];
      inputsText.push(surname);
      inputsText.push(name);
      inputsText.push(middlename);
      inputsText.push(faculty);

      let inputDate = birthDate;
      let inputYear = startYear;
      if (!(new Date(inputDate.value) >= new Date(1990, 0, 1) && new Date(inputDate.value) <= new Date())) {
        empty = false;
        inputDate.classList.add('is-invalid');
        inputDate.value = '';
        errors.push('Дата рождения должна находится в диапазоне от 01.01.1900 до текущей даты');
      } else {
        inputDate.classList.remove('is-invalid');
      }

      if (!(inputYear.value >= 2000 && inputYear.value <= new Date().getFullYear())) {
        inputYear.value = '';
        empty = false;
        inputYear.classList.add('is-invalid');
        errors.push('Год начала обучения находится в диапазоне от 2000-го до текущего года');
      } else {
        inputYear.classList.remove('is-invalid');
      }

      for (let input of inputsText) {
        let value = input.value.trim();
        if (value === '') {
          empty = false;
          input.classList.add('is-invalid');
          errors.push('Все поля обязательны для заполнения');
          input.value = '';
        } else {
          input.classList.remove('is-invalid');
        }
      }

      if (!empty) {
        alert('Пожалуйста, заполните все поля корректно!');
        errors.forEach(error => {
          let errorMessage = document.createElement('div');
          errorMessage.className = 'error-message';
          errorMessage.textContent = error;
          document.getElementById('myForm').insertBefore(errorMessage, document.querySelector('form#myForm button'));
        });
      } else {
        studentArr.push(makeStudent(surname.value.trim(), name.value.trim(), middlename.value.trim(), new Date(birthDate.value), +startYear.value, faculty.value.trim()));
        studentTable.remove();
        studentTable = createTable(studentArr);
        container.append(studentTable)
        let inputs = document.querySelectorAll('#myForm input');
        for (let input of inputs) {
          input.value = '';
        }
      }
    });
    // Фильтрация массива студентов
    document.getElementById('filter').addEventListener('input', function (e) {
      e.preventDefault();

      let p = document.createElement('p');
      p.classList.add('mb-3');
      p.setAttribute('id', 'formp');
      p.textContent = "Совпадений не найдено";

      let fio = document.getElementById('fio').value.trim().toLowerCase();;
      let faculty = document.getElementById('faculty').value.trim().toLowerCase();;
      let start = +document.getElementById('start').value.trim();
      let finish = +document.getElementById('finish').value.trim();

      // Фильтрация массива студентов
      let filterStudArr = studentArr.filter(student => {
        let fullName = `${student.surname} ${student.name} ${student.middlename}`.toLowerCase();
        let matchesFio = fullName.includes(fio) || !fio;
        let matchesFaculty = student.faculty.toLowerCase().includes(faculty) || !faculty;
        let matchesStart = student.startYear === start || !start;
        let matchesFinish = (student.startYear + 4) === finish || !finish;
        return matchesFio && matchesFaculty && matchesStart && matchesFinish;
      });

      // Если совпадений нет выводим сообщение
      if (filterStudArr.length === 0) {
        if (!(document.getElementById('formp'))){
          document.getElementById('filter').after(p);
        }
        studentTable.remove();

        // иначе перерисовываем таблицу, удалив сообщение если оно есть
      } else {
        if (document.getElementById('formp')) {
          document.getElementById('formp').remove();
        }
        studentTable.remove();
        studentTable = createTable(filterStudArr);
        container.append(studentTable);
      }

    });

  }
  window.createStudentApp = createStudentApp;
})();
