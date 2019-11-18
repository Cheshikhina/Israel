'use strict';

; (function () {
  var KeyCode = {
    ESC: 27,
  };
  var Url = {
    SEND: 'http://httpbin.org/post',
  };
  var Code = {
    SUCESS: 200,
  };
  var TIMEOUT = 10000;
  var ERROR_INPUT = 'border: 2px solid #FF0000; border-radius: 80px;';
  var popup = document.querySelector('.modal-form');
  var overlay = document.querySelector('.overlay');
  var linkOpenPopup = document.querySelector('#link-call');
  var buttonClosePopup = document.querySelector('#modal-close');
  var modalForm = document.querySelector('.modal-form form');
  // var callForm = document.querySelector('.phone-contact__form form');
  // var detailsForm = document.querySelector('.details__form form');
  var phoneInFormAll = document.querySelectorAll('input[name="your-phone"]');
  // var phoneCallForm = callForm.querySelector('input[name="your-phone"]');
  // var phoneDetailsForm = detailsForm.querySelector('input[name="your-phone"]');
  // var nameDetailsForm = detailsForm.querySelector('input[name="your-name"]');
  var phoneModalForm = modalForm.querySelector('input[name="your-phone"]');
  var nameModalForm = modalForm.querySelector('input[name="your-name"]');
  var personalModalForm = modalForm.querySelector('div');
  var textErrorModalForm = document.querySelector('.modal-form__text-extra');
  var scrollButton = document.querySelector('.page-header__scroll button');
  var pageMain = document.querySelector('.page-main');
  var inputAll = document.querySelectorAll('input');

  //BACKEND
  // функция загрузки данных из формы
  var request = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === Code.SUCESS) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  // функция сохранения данных
  var save = function (data, onLoad, onError) {
    var xhr = request(onLoad, onError);

    xhr.open('POST', Url.SEND);
    xhr.send(data);
  };

  //успешно отправленная форма
  var successHandler = function () {
    closePopup();
    var similarSucessMessage = document.querySelector('#success')
      .content
      .querySelector('.success');
    var sucessMessage = similarSucessMessage.cloneNode(true);
    document.body.insertBefore(sucessMessage, document.body.children[0]);
    overlay.style.display = "block";

    var successButton = document.querySelector('.success__button');

    var closeSuccessMessage = function () {
      overlay.style.display = "none";
      document.body.removeChild(document.body.children[0]);
      successButton.removeEventListener('click', closeSuccessMessage);
      modalForm.reset();
      // pageForm.reset();
    };

    var addCloseEscSuccessMessage = function () {
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KeyCode.ESC) {
          closeSuccessMessage();
        }
      });
    };

    addCloseEscSuccessMessage();
    successButton.addEventListener('click', closeSuccessMessage);
  };

  // ошибка отправки формы модального окна
  var modalFormErrorHandler = function () {
    closePopup();
    var similarErrorMessage = document.querySelector('#error')
      .content
      .querySelector('.error');

    var errorMessage = similarErrorMessage.cloneNode(true);
    document.body.insertBefore(errorMessage, document.body.children[0]);
    overlay.style.display = "block";

    var errorButton = document.querySelector('.error__button');

    var closeErrorMessage = function () {
      openPopup();
      document.body.removeChild(document.body.children[0]);
      errorButton.removeEventListener('click', closeErrorMessage);
    };

    var addCloseEscErrorMessage = function () {
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KeyCode.ESC) {
          document.body.removeChild(document.body.children[0]);
          overlay.style.display = "none";
          errorButton.removeEventListener('click', closeErrorMessage);
          modalForm.reset();
        }
      });
    };

    addCloseEscErrorMessage();
    errorButton.addEventListener('click', closeErrorMessage);
  };


  //ЛОГИКА МОДАЛЬНОГО ОКНА
  // функция закрытия модального окна по нажатию на ESC
  var popupCloseEscHandler = function (evt) {
    if (evt.keyCode === KeyCode.ESC) {
      closePopup();
      modalForm.reset();
    }
  };

  var addCloseEscPopup = function () {
    document.addEventListener('keydown', popupCloseEscHandler);
  };

  var removeCloseEscPopup = function () {
    document.removeEventListener('keydown', popupCloseEscHandler);
  };

  // функция открытия модального окна
  var openPopup = function () {
    overlay.style.display = "block";
    popup.classList.remove('visually-hidden');
    addCloseEscPopup();
    if (buttonClosePopup) {
      buttonClosePopup.addEventListener('click', function () {
        closePopup();
        modalForm.reset();
      });
    }
    modalForm.addEventListener('submit', pressModalFormButton);
  };

  // слушатель ссылки на модальное окно
  if (linkOpenPopup) {
    linkOpenPopup.addEventListener('click', function (evt) {
      evt.preventDefault();
      openPopup();
    });
  }

  // функция закрытия модального окна
  var closePopup = function () {
    overlay.style.display = "none";
    nameModalForm.style = '';
    phoneModalForm.style = '';
    personalModalForm.style = '';
    textErrorModalForm.classList.add('visually-hidden');
    popup.classList.add('visually-hidden');
    removeCloseEscPopup();
    modalForm.removeEventListener('submit', pressModalFormButton);
  }

  // функция сохранения данных формы модального окна
  var pressModalFormButton = function (evt) {
    evt.preventDefault();
    if (checkModalForm()) {
      save(new FormData(modalForm), successHandler, modalFormErrorHandler);
    }
  };


  //МАСКИ ДЛЯ ВВОДА ТЕЛЕФОНА
  var checkPhoneNumber = function (element) {
    $(element).mask('+7 (999) 999 99 99');
  };

  // ввод телефонов
  if (phoneInFormAll) {
    checkPhoneNumber(phoneInFormAll);
  }


  //ПРОВЕРКА ФОРМЫ
  // удаление аттрибута required
  if (inputAll) {
    $(inputAll).removeAttr('required');
  }

  // функция для создания массива с данными из формы
  var getFormData = function (form) {
    var unindexed_array = $(form).serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function (n, i) {
      indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
  };

  // функция проверки полей модального окна
  var checkModalForm = function () {
    var thisForm = getFormData(modalForm);
    var nameValue = thisForm['your-name'];
    var phoneValue = thisForm['your-phone'];
    var personalValue = thisForm['personal'];

    if (nameValue == '') {
      nameModalForm.style = ERROR_INPUT;
      phoneModalForm.style = '';
      personalModalForm.style = '';
      textErrorModalForm.classList.remove('visually-hidden');
      return false;
    } else if (phoneValue == '') {
      phoneModalForm.style = ERROR_INPUT;
      nameModalForm.style = '';
      personalModalForm.style = '';
      textErrorModalForm.classList.remove('visually-hidden');
      return false;
    } else if (personalValue !== 'on') {
      personalModalForm.style = ERROR_INPUT;
      nameModalForm.style = '';
      phoneModalForm.style = '';
      textErrorModalForm.classList.remove('visually-hidden');
      return false;
    } else {
      nameModalForm.style = '';
      phoneModalForm.style = '';
      personalModalForm.style = '';
      textErrorModalForm.classList.add('visually-hidden');
      return true;
    }
  };


  //СКРОЛЛ
  var scrollElement = function (button, link) {
    $(button).on('click', function () {
      var top = $(link).offset().top;
      $('body, html').animate({scrollTop: top}, 1500);
    });
  };

  // переход по кнопке скролла
  if (scrollButton, pageMain) {
    scrollElement(scrollButton, pageMain);
  }


})();
