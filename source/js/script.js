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
  var PlaceholderClass = {
    MODAL: 'modal-form__phone--placeholder',
    CALL: 'phone-contact__phone--placeholder',
    DETAILS: 'details__form-phone--placeholder',
  };
  var ThisElement = {
    TAB: ':nth-child(2)',
    SLIDE: ':nth-child(1)',
  };
  var TIMEOUT = 10000;
  var SCROLL_SPEED = 1500;
  var MOBILE_WIDTH = 768;
  var ERROR_INPUT = 'border: 2px solid rgba(255, 0, 0, 0.5); border-radius: 80px;';
  var popup = document.querySelector('.modal-form');
  var overlay = document.querySelector('.overlay');
  var linkOpenPopup = document.querySelector('#link-call');
  var buttonClosePopup = document.querySelector('#modal-close');
  var modalForm = document.querySelector('.modal-form form');
  var callForm = document.querySelector('.phone-contact__form form');
  var detailsForm = document.querySelector('.details__form form');
  var phoneInFormAll = document.querySelectorAll('input[name="your-phone"]');
  var phoneCallForm = callForm.querySelector('input[name="your-phone"]');
  var phoneDetailsForm = detailsForm.querySelector('input[name="your-phone"]');
  var nameDetailsForm = detailsForm.querySelector('input[name="your-name"]');
  var phoneModalForm = modalForm.querySelector('input[name="your-phone"]');
  var nameModalForm = modalForm.querySelector('input[name="your-name"]');
  var personalModalForm = modalForm.querySelector('.modal-form__personal');
  var scrollButton = document.querySelector('.page-header__scroll button');
  var mainInfo = document.querySelector('.main-info');
  var inputAll = document.querySelectorAll('input');
  var programsName = document.querySelectorAll('.programs__nav-item');
  var programsDesc = document.querySelectorAll('.programs__item-basic');
  var slider = document.querySelector('.advantages__nav-list');
  var slidesName = document.querySelectorAll('.advantages__nav-item');
  var slidesPhoto = document.querySelectorAll('.advantages__slide');
  var questionsAll = document.querySelectorAll('.questions__checkbox');
  var answersAll = document.querySelectorAll('.questions__text');
  var thisQuestion = document.querySelector('.questions__checkbox--checked');
  var thisAnswer = document.querySelector('.questions__text--active');
  var thisComment = document.querySelector('.reviews__point--active');
  var buttonsToggleComment = document.querySelectorAll('.reviews__bth');
  var commentsAll = document.querySelectorAll('.reviews__point');
  var counterComments = document.querySelector('.reviews__holder');
  var countThisComment = document.querySelector('.reviews__count-this');
  var counterAllComments = document.querySelector('.reviews__count-all');
  var programsNameLine = document.querySelector('.programs__nav');
  var programsNameContainer = document.querySelector('.programs__nav-box');
  var indentTabName = 0;
  var arrayTabNameWidth = [];
  var programsNameLineWidth = 0;
  var indexTabName = $(document.querySelector('.programs__nav-radio[checked]')).parent().index();

  // //ФУНКЦИЯ "ОЖИВЛЕНИЯ" КАРТЫ
  // var initMap = function () {
  //   var uluru = { lat: 55.028574, lng: 82.928464 };
  //   var map = new google.maps.Map(document.getElementById('map'), { zoom: 18, center: uluru });
  //   var marker = new google.maps.Marker({
  //     position: uluru,
  //     map: map,
  //     icon: './img/icon-marker-map.svg'
  //   });
  // };
  // initMap();

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
    overlay.style.display = 'block';

    var successButton = document.querySelector('.success__button');
    var successButtonClose = document.querySelector('.success__button-close');

    var closeSuccessMessage = function () {
      overlay.style.display = 'none';
      document.body.removeChild(document.body.children[0]);
      successButton.removeEventListener('click', closeSuccessMessage);
      successButtonClose.removeEventListener('click', closeSuccessMessage);
      modalForm.reset();
      callForm.reset();
      detailsForm.reset();
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
    successButtonClose.addEventListener('click', closeSuccessMessage);
  };

  // ошибка отправки формы модального окна
  var modalFormErrorHandler = function () {
    closePopup();
    var similarErrorMessage = document.querySelector('#error')
      .content
      .querySelector('.error');

    var errorMessage = similarErrorMessage.cloneNode(true);
    document.body.insertBefore(errorMessage, document.body.children[0]);
    overlay.style.display = 'block';

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
          overlay.style.display = 'none';
          errorButton.removeEventListener('click', closeErrorMessage);
          modalForm.reset();
        }
      });
    };

    addCloseEscErrorMessage();
    errorButton.addEventListener('click', closeErrorMessage);
  };

  // ошибка отправки формы "Хочу поехать"
  var callFormErrorHandler = function () {
    var similarErrorMessage = document.querySelector('#error')
      .content
      .querySelector('.error');

    var errorMessage = similarErrorMessage.cloneNode(true);
    document.body.insertBefore(errorMessage, document.body.children[0]);
    overlay.style.display = 'block';

    var errorButton = document.querySelector('.error__button');

    var closeErrorMessage = function () {
      document.body.removeChild(document.body.children[0]);
      errorButton.removeEventListener('click', closeErrorMessage);
      overlay.style.display = 'none';
    };

    var addCloseEscErrorMessage = function () {
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KeyCode.ESC) {
          document.body.removeChild(document.body.children[0]);
          overlay.style.display = 'none';
          errorButton.removeEventListener('click', closeErrorMessage);
          callForm.reset();
        }
      });
    };

    addCloseEscErrorMessage();
    errorButton.addEventListener('click', closeErrorMessage);
  };

  // ошибка отправки формы "Узнать подробности"
  var detailsFormErrorHandler = function () {
    var similarErrorMessage = document.querySelector('#error')
      .content
      .querySelector('.error');

    var errorMessage = similarErrorMessage.cloneNode(true);
    document.body.insertBefore(errorMessage, document.body.children[0]);
    overlay.style.display = 'block';

    var errorButton = document.querySelector('.error__button');

    var closeErrorMessage = function () {
      document.body.removeChild(document.body.children[0]);
      errorButton.removeEventListener('click', closeErrorMessage);
      overlay.style.display = 'none';
    };

    var addCloseEscErrorMessage = function () {
      document.addEventListener('keydown', function (evt) {
        if (evt.keyCode === KeyCode.ESC) {
          document.body.removeChild(document.body.children[0]);
          overlay.style.display = 'none';
          errorButton.removeEventListener('click', closeErrorMessage);
          detailsForm.reset();
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

  // функция добавления светло-серой подсказки на ввод телефона
  var addPhonePlaceholder = function (form, classForPlaceholder) {
    var inputParent = form.querySelector('input[name="your-phone"]').parentNode;
    if (inputParent) {
      inputParent.classList.add(classForPlaceholder);
    }
  };

  // функция удаления светло-серой подсказки на ввод телефона
  var removePhonePlaceholder = function (form, classForPlaceholder) {
    var inputParent = form.querySelector('input[name="your-phone"]').parentNode;
    if (inputParent) {
      inputParent.classList.remove(classForPlaceholder);
    }
  };

  // функция открытия модального окна
  var openPopup = function () {
    overlay.style.display = 'block';
    nameModalForm.focus();
    popup.classList.remove('visually-hidden');
    addCloseEscPopup();
    if (buttonClosePopup) {
      buttonClosePopup.addEventListener('click', function () {
        closePopup();
        modalForm.reset();
      });
    }
    if (phoneModalForm) {
      phoneModalForm.addEventListener('focus', function () {
        addPhonePlaceholder(modalForm, PlaceholderClass.MODAL);
      });
      phoneModalForm.addEventListener('blur', function () {
        removePhonePlaceholder(modalForm, PlaceholderClass.MODAL);
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
    overlay.style.display = 'none';
    nameModalForm.style = '';
    phoneModalForm.style = '';
    personalModalForm.style = '';
    popup.classList.add('visually-hidden');
    removeCloseEscPopup();
    modalForm.removeEventListener('submit', pressModalFormButton);
  };

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

    if (nameValue === '') {
      nameModalForm.style = ERROR_INPUT;
      phoneModalForm.style = '';
      personalModalForm.style = '';
      return false;
    } else if (phoneValue === '') {
      phoneModalForm.style = ERROR_INPUT;
      nameModalForm.style = '';
      personalModalForm.style = '';
      return false;
    } else if (personalValue !== 'on') {
      personalModalForm.style = ERROR_INPUT;
      nameModalForm.style = '';
      phoneModalForm.style = '';
      return false;
    } else {
      nameModalForm.style = '';
      phoneModalForm.style = '';
      personalModalForm.style = '';
      return true;
    }
  };


  //СКРОЛЛ В ШАПКЕ
  var scrollElement = function (button, link) {
    $(button).on('click', function () {
      var top = $(link).offset().top;
      $('body, html').animate({ scrollTop: top }, SCROLL_SPEED);
    });
  };

  // переход по кнопке скролла
  if (scrollButton && mainInfo) {
    scrollElement(scrollButton, mainInfo);
  }


  //ЛОГИКА ФОРМЫ "ХОЧУ ПОЕХАТЬ"
  // добавление/удаление светло-серой подсказки на ввод телефона
  if (phoneCallForm && callForm) {
    phoneCallForm.addEventListener('focus', function () {
      addPhonePlaceholder(callForm, PlaceholderClass.CALL);
    });
    phoneCallForm.addEventListener('blur', function () {
      removePhonePlaceholder(callForm, PlaceholderClass.CALL);
    });
  }

  // функция проверки формы "Хочу поехать"
  var checkCallForm = function () {
    var thisForm = getFormData(callForm);
    var phoneValue = thisForm['your-phone'];

    if (phoneValue === '') {
      phoneCallForm.style = ERROR_INPUT;
      return false;
    } else {
      phoneCallForm.style = '';
      return true;
    }
  };

  // функция сохранения данных формы "Хочу поехать"
  var pressCallFormButton = function (evt) {
    evt.preventDefault();
    if (checkCallForm()) {
      save(new FormData(callForm), successHandler, callFormErrorHandler);
    }
  };

  // слушатель отправки формы "Хочу поехать"
  if (callForm) {
    callForm.addEventListener('submit', pressCallFormButton);
  }

  //ЛОГИКА СЛАЙДЕРА В БЛОКЕ ЖИЗНЬ В ИЗРАИЛЕ
  // проверка ширины окна при открытии сайта для добавления/удаления кнопок слайдера
  if (slider) {
    if (document.documentElement.clientWidth < MOBILE_WIDTH) {
      slider.classList.remove('visually-hidden');
      if (slidesName && slidesPhoto && ThisElement.SLIDE) {
        $(slidesPhoto).not(ThisElement.SLIDE).hide();
        $(slidesName).click(function () {
          $(slidesPhoto).hide().eq($(this).index()).show();
        });
      }
    }
  }


  //ЛОГИКА ДЛЯ БЛОКА С ЧАСТЫМИ ВОПРОСАМИ (АККОРДЕОН)
  if (questionsAll && answersAll && thisQuestion && thisAnswer) {
    $(questionsAll).not(thisQuestion).removeAttr('checked');
    $(answersAll).not(thisAnswer).hide();

    $(questionsAll).click(function () {
      $(this).next(answersAll).toggle();
    });
  }


  //ЛОГИКА ДЛЯ БЛОКА ОТЗЫВЫ
  if (buttonsToggleComment && commentsAll && counterComments && countThisComment && counterAllComments) {
    $(commentsAll).not(thisComment).hide();
    counterComments.classList.remove('visually-hidden');

    // функция для показа комментария
    var showComment = function (arr, index, currentNumber, link) {
      index = currentNumber - 1;
      $(arr[index]).show();
      $(arr).not(arr[index]).hide();
      link.innerHTML = currentNumber;
    };

    // переменные для функции показа комментария
    var currentCommentNumber = Number(countThisComment.innerHTML);
    var currentComment;
    var limitComments = commentsAll.length;
    counterAllComments.innerHTML = limitComments;

    // слушатель клика по кнопкам вперед/назад
    if (limitComments === '0' || currentCommentNumber > limitComments) {
      counterComments.classList.add('visually-hidden');
    } else {
      $(buttonsToggleComment).on('click', function () {
        if ($(this).attr('value') === 'left') {
          currentCommentNumber = currentCommentNumber - 1;
          if (currentCommentNumber <= 1) {
            currentCommentNumber = 1;
            showComment(commentsAll, currentComment, currentCommentNumber, countThisComment);
          } else {
            showComment(commentsAll, currentComment, currentCommentNumber, countThisComment);
          }
        }
        if ($(this).attr('value') === 'right') {
          currentCommentNumber = currentCommentNumber + 1;
          if (currentCommentNumber >= limitComments) {
            currentCommentNumber = limitComments;
            showComment(commentsAll, currentComment, currentCommentNumber, countThisComment);
          } else {
            showComment(commentsAll, currentComment, currentCommentNumber, countThisComment);
          }
        }
      });
    }
  }


  //ЛОГИКА ФОРМЫ "УЗНАТЬ ПОДРОБНОСТИ"
  // добавление/удаление светло-серой подсказки на ввод телефона
  if (phoneDetailsForm && detailsForm) {
    phoneDetailsForm.addEventListener('focus', function () {
      addPhonePlaceholder(detailsForm, PlaceholderClass.DETAILS);
    });
    phoneDetailsForm.addEventListener('blur', function () {
      removePhonePlaceholder(detailsForm, PlaceholderClass.DETAILS);
    });
  }

  // функция проверки формы "Узнать подробности"
  var checkDetailsForm = function () {
    var thisForm = getFormData(detailsForm);
    var phoneValue = thisForm['your-phone'];
    var nameValue = thisForm['your-name'];

    if (nameValue === '') {
      nameDetailsForm.style = ERROR_INPUT;
      phoneDetailsForm.style = '';
      return false;
    } else if (phoneValue === '') {
      phoneDetailsForm.style = ERROR_INPUT;
      nameDetailsForm.style = '';
      return false;
    } else {
      phoneDetailsForm.style = '';
      nameDetailsForm.style = '';
      return true;
    }
  };

  // функция сохранения данных формы "Узнать подробности"
  var pressDetailsFormButton = function (evt) {
    evt.preventDefault();
    if (checkDetailsForm()) {
      save(new FormData(detailsForm), successHandler, detailsFormErrorHandler);
    }
  };

  // слушатель отправки формы "Узнать подробности"
  if (detailsForm) {
    detailsForm.addEventListener('submit', pressDetailsFormButton);
  }


  //ЛОГИКА РАБОТЫ ТАБОВ В БЛОКЕ ПРОГРАММЫ
  // отрисовка выбранного таба
  if (programsDesc && ThisElement.TAB) {
    $(programsDesc).not(ThisElement.TAB).hide();
  }

  // функция для расчета текущей ширины линии - суммы элементов массива по заданный индекс
  var getCurrentTabNameWidth = function (array, index) {
    var sum = 0;
    for (var i = 0; i < index + 1; i++) {
      sum = sum + Math.ceil(array[i]);
    }
    return sum;
  };


  // прячем названия табов, невлезающих в одну линию для мобильного
  if (programsNameLine && programsNameContainer) {
    if (document.documentElement.clientWidth < MOBILE_WIDTH) {
      if (!$(programsNameLine).hasClass('programs__nav--js')) {
        programsNameLine.classList.add('programs__nav--js');

        // выяснение текущей ширины линии названий табов и присваивание соответсвующих стилей
      }
      if (!$(programsNameContainer).hasClass('programs__nav-box--js')) {
        programsNameContainer.classList.add('programs__nav-box--js');
        if (programsNameLine && programsName) {
          for (var k = 0; k < programsName.length; k++) {
            arrayTabNameWidth.push(programsName[k].offsetWidth);
            programsNameLineWidth += programsName[k].offsetWidth;
          }
          programsNameLine.style.width = programsNameLineWidth + 'px';
          programsNameLine.style.left = '-44px';
        }
      }
    }
  }

  // открытие/закрытие табов в и перемещение названий программ по карусели на мобильном
  if (programsName && programsDesc && indexTabName && programsNameLine) {
    $(programsName).click(function () {
      $(programsDesc).hide().eq($(this).index()).show();
      if ($(this).index() === indexTabName) {
        indentTabName = indentTabName;
      } else {
        indentTabName = (getCurrentTabNameWidth(arrayTabNameWidth, ($(this).index() - 1)) - Math.floor((document.documentElement.clientWidth - arrayTabNameWidth[$(this).index()]) / 2));
        programsNameLine.style.left = -indentTabName + 'px';
      }
      indexTabName = $(this).index();
    });
  }

  // проверка ширины окна в текущем времени для добавления/удаления кнопок слайдера и классов для корректной работы табов
  window.addEventListener('resize', function () {
    if (slider) {
      if (document.documentElement.clientWidth >= MOBILE_WIDTH) {
        if (!$(slider).hasClass('visually-hidden')) {
          slider.classList.add('visually-hidden');
          $(slidesPhoto).show();
        }
      } else {
        if ($(slider).hasClass('visually-hidden')) {
          slider.classList.remove('visually-hidden');
          if (slidesName && slidesPhoto && ThisElement.SLIDE) {
            $(slidesPhoto).not(ThisElement.SLIDE).hide();
            $(slidesName).click(function () {
              $(slidesPhoto).hide().eq($(this).index()).show();
            });
          }
        }
      }
    }

    if (programsNameLine && programsNameContainer) {
      if (document.documentElement.clientWidth < MOBILE_WIDTH) {
        programsNameLine.style.width = programsNameLineWidth + 'px';
        programsNameLine.style.left = -(getCurrentTabNameWidth(arrayTabNameWidth, ($(this).index() - 1)) - Math.floor((document.documentElement.clientWidth - arrayTabNameWidth[$(this).index()]) / 2)) + 'px';
        if (!$(programsNameLine).hasClass('programs__nav--js')) {
          programsNameLine.classList.add('programs__nav--js');
        }
        if (!$(programsNameContainer).hasClass('programs__nav-box--js')) {
          programsNameContainer.classList.add('programs__nav-box--js');
        }
      } else {
        programsNameLine.style = '';
        if ($(programsNameLine).hasClass('programs__nav--js')) {
          programsNameLine.classList.remove('programs__nav--js');
        }
        if ($(programsNameContainer).hasClass('programs__nav-box--js')) {
          programsNameContainer.classList.remove('programs__nav-box--js');
        }
      }
    }
  });

})();
