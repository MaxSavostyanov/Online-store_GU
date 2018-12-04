//отрисовка товаров
function renderGoods(limit) {
  $('.product-block').empty();
  $.ajax({
    url: 'http://localhost:3000/goods' + limit,
    type: 'GET',
    success: function (goods) {
      goods.forEach(function (good) {
        var $productCard = $('<div />', {
          class: 'product-card'
        });

        var $productCardChild = $('<a />', {
          class: 'product-card-child',
          href: 'single_page.html#' + good.id,
          target: '_blank',
          'data-id': good.id
        });
        $productCard.append($productCardChild);

        var $image = $('<img>', {
          src: good.srcImg,
          class: 'product-card__img',
          alt: good.name
        });
        $productCardChild.append($image);

        var $description = $('<div />', {
          class: 'product-card__description'
        });
        $productCardChild.append($description);

        var $name = $('<p />', {
          text: good.brand + ' ' + good.name,
          class: 'product-card__name'
        });
        $description.append($name);

        var $price = $('<p />', {
          text: '$' + good.price,
          class: 'product-card__price'
        });
        $description.append($price);

        var $fastAdd = $('<div />', {
          class: 'fast-add'
        });
        $productCard.append($fastAdd);

        var $fastAddLink = $('<button />', {
          class: 'fast-add__link',
          'data-good-id': good.id,
          'data-name': good.brand + ' ' + good.name,
          'data-size': good.size,
          'data-color': 'red',
          'data-img': good.srcImg,
          'data-price': good.price
        });
        $fastAdd.append($fastAddLink);

        var $fastAddImg = $('<img />', {
          src: 'img/cart-white.svg',
          alt: 'cart',
          class: 'fast-add__cart-img'
        });
        $fastAddLink.append($fastAddImg);

        var $fastAddText = $('<span />', {
          text: 'Add to cart',
          class: 'fast-add__text'
        });
        $fastAddLink.append($fastAddText);

        $('.product-block').append($productCard);
      })
    }
  })
}

//Отрисовка корзины на странице корзины
function renderCart() {
  $('.trcart').remove();
  renderCounter();
  $.ajax({
    url: 'http://localhost:3000/cart',
    type: 'GET',
    success: function (goods) {
      var subTotal = 0;
      goods.forEach(function (good) {
        var $tr = $('<tr />', {
          class: 'trcart'
        });

        var $tdProductCard = $('<td />', {
          class: 'shopping-cart__cell'
        });

        var $details = $('<div />', {
          class: 'product-details'
        });

        var $detailsImg = $('<div />', {
          class: 'product-details__image'
        });

        var $img = $('<img>', {
          src: good.img,
          alt: good.name
        });
        $detailsImg.append($img);
        $details.append($detailsImg);

        var $detailsText = $('<div />', {
          class: 'product-details__text'
        });

        var $detailsHeading = $('<h3 />', {
          class: 'product-details__heading'
        });

        var $detailsLink = $('<a />', {
          class: 'product-details__link',
          href: 'single_page.html#' + good.goodId,
          text: good.name
        });
        $detailsHeading.append($detailsLink);
        $detailsText.append($detailsHeading);

        var $detailsParam = $('<p />', {
          class: 'product-details__param',
          text: 'Color: '
        });
        var $detailsValue = $('<span />', {
          class: 'product-details__param_value',
          text: good.color
        });
        $detailsParam.append($detailsValue);
        $detailsText.append($detailsParam);

        $detailsParam = $('<p />', {
          class: 'product-details__param',
          text: 'Size: '
        });
        $detailsValue = $('<span />', {
          class: 'product-details__param_value',
          text: good.size
        });
        $detailsParam.append($detailsValue);
        $detailsText.append($detailsParam);
        $details.append($detailsText);
        $tdProductCard.append($details);
        $tr.append($tdProductCard);

        var $tdPrice = $('<td />', {
          class: 'shopping-cart__cell',
          text: '$' + good.price
        });
        $tr.append($tdPrice);

        var $tdQuantity = $('<td />', {
          class: 'shopping-cart__cell quantity'
        });
        var $quantity = $('<input type="number" value="' + good.quantity + '" data-id = "' + good.id + '" min = "1" max="10">');
        $tdQuantity.append($quantity);
        $tr.append($tdQuantity);

        var $tdShipping = $('<td />', {
          class: 'shopping-cart__cell',
          text: 'free'
        });
        $tr.append($tdShipping);

        var $tdTotal = $('<td />', {
          class: 'shopping-cart__cell subTotal',
          text: '$' + (+good.price * +good.quantity).toFixed(2),
          'data-id': good.id
        });
        $tr.append($tdTotal);

        var $tdDelete = $('<td />', {
          class: 'shopping-cart__cell'
        });
        var $buttonDel = $('<a />', {
          class: 'a-delete',
          'data-id': good.id
        });
        $buttonDel.append('<i class="fas fa-times-circle"></i>');
        $tdDelete.append($buttonDel);
        $tr.append($tdDelete);
        $('.shopping-cart__table').append($tr);
      });
      total();
    }
  });
}

//Отрисовка счетчика кол-ва товаров в корзине
function renderCounter() {
  $.ajax({
    url: 'http://localhost:3000/cart',
    type: 'GET',
    success: function (cart) {
      $('#counter').remove();
      if (cart.length !== 0) {
        var counter = $('<div />', {
          id: 'counter',
          text: cart.length
        });
        $('.header-cart').append(counter);
      }
    }
  });
}

//очищение корзины
function clearCart() {
  $.ajax({
    url: 'http://localhost:3000/cart',
    type: 'GET',
    success: function (goods) {
      goods.forEach(function (value) {
        $.ajax({
          url: 'http://localhost:3000/cart/' + value.id,
          type: 'DELETE'
        });
      })
    }
  });
  $('.trcart').remove();
  $('#counter').remove();
  $('.total-sum span').remove();
}

//Отрисовка странички продукта.
function renderSinglePage(id) {
  $.ajax({
    url: 'http://localhost:3000/goods/' + id,
    type: 'GET',
    success: function (good) {
      $('.pro-description').empty();
      var $className = $('<div />', {
        class: 'class-name',
        text: 'WOMEN COLLECTION'
      });
      $('.pro-description').append($className);

      var $spacer = $('<div />', {
        class: 'spacer',
      });
      $('.pro-description').append($spacer);

      var $heading = $('<div />', {
        class: 'pro-description__heading',
        text: good.name
      });
      $('.pro-description').append($heading);

      var $description = $('<div />', {
        class: 'pro-desc-text description-container'
      });

      var $descriptionText = $('<p />', {
        text: 'Compellingly actualize fully researched processes before proactive outsourcing. Progressively' +
        ' syndicate collaborative architectures before cutting-edge services. Completely visualize parallel core' +
        ' competencies rather than exceptional portals.'
      });
      $description.append($descriptionText);

      var $materialDesinger = $('<div />', {
        class: 'material-designer'
      });

      var $material = $('<p />', {text: 'material: '});
      var $span = $('<span />', {text: 'cotton'});
      $material.append($span);
      $materialDesinger.append($material);

      var $designer = $('<p />', {text: 'designer: '});
      $span = $('<span />', {text: good.designer});
      $designer.append($span);
      $materialDesinger.append($designer);
      $description.append($materialDesinger);

      var $price = $('<div />', {
        class: 'price',
        text: '$' + good.price
      });
      $description.append($price);
      $('.pro-description').append($description);

      var $form = $('<form />', {
        class: 'add-to-cart  description-container',
        action: '#'
      });

      var $choose = $('<div />', {
        class: 'choose'
      });
      var $chooseCol = $('<div />', {
        class: 'choose-col'
      });
      var $label;
      var $select = $('<select />');
      $label = $('<label />', {
        text: 'choose color'
      });
      ['red', 'blue', 'white'].forEach(function (value) {
        var $option = $('<option />', {
          text: value
        });
        $select.append($option);
      });
      $label.append($select);
      $chooseCol.append($label);
      $choose.append($chooseCol);
      $form.append($choose);

      $chooseCol = $('<div />', {
        class: 'choose-col'
      });
      $label = $('<label />', {
        text: 'choose size'
      });
      $select = $('<select />');
      ['xxl', 'xl', 'l'].forEach(function (value) {
        var $option = $('<option />', {
          text: value
        });
        $select.append($option);
      });
      $label.append($select);
      $chooseCol.append($label);
      $choose.append($chooseCol);
      $form.append($choose);

      $chooseCol = $('<div />', {
        class: 'choose-col'
      });
      $label = $('<label />', {
        text: 'QUANTITY'
      });
      var $input = $('<input>', {
        type: 'number',
        value: 1,
        min: 1,
        max: 10
      });
      $label.append($input);
      $chooseCol.append($label);
      $choose.append($chooseCol);
      $form.append($choose);

      var $button = $('<button />', {
        class: 'submit-btn',
        type: 'submit',
        text: 'Add to cart',
        'data-good-id': good.id,
        'data-name': good.brand + ' ' + good.name,
        'data-size': good.size,
        'data-color': 'red',
        'data-img': good.srcImg,
        'data-price': good.price
      });
      $form.append($button);
      $('.pro-description').append($form);
    }
  })
}

//Общая стоимость товаров добавленных к коризну
function total() {
  $('.total-sum span').remove();
  var str = $('.subTotal').text();
  var arr = str.split('$');
  var result = arr.reduce(function (sum, current) {
    return +sum + +current;
  });
  $('.total-sum p').append($('<span />', {
    text: '$' + result.toFixed(2)
  }));
}

//выпадающее меню My-Account
function myToggle(button, div) {
  div.stop().slideToggle(500);
  $(document).mouseup(function (e) {
    if (!button.is(e.target)
      && !div.is(e.target)
      && div.has(e.target).length === 0) {
      div.stop().slideUp(500);
    }
  });
}

//вход
function login() {
  var username = $('#username-head').val();
  var password = $('#password-head').val();
  $.ajax({
    url: 'http://localhost:3000/users',
    type: 'GET',
    success: function (users) {
      users.some(function (user) {
        if ((user.username === username || user.email === username)
          && user.password === password) {
          $('.error').stop().slideUp(300);
          $('.hello').append('Hello, ' + user.username + '!');
          $('.header-login-form').slideUp(1000);
          $('.my-account-menu').slideDown(1000);
          localStorage.setItem('username', user.username);
          localStorage.setItem('userId', user.id);
        }
        if(!localStorage.getItem('userId')){
          $('.error').stop().slideDown(300);
        }
      });
    }
  });
}

//выход
function logout() {
  $('.hello').empty();
  $('.header-login-form').slideDown(1000);
  $('.my-account-menu').slideUp(1000);
  $('.error').stop().slideUp(200);
  localStorage.clear();
  clearCart();
}

//выполнен ли вход
function isLoggedIn() {
  if (localStorage.getItem('userId')) {
    $('.hello').append('Hello, ' + localStorage.getItem('username') + '!');
    $('.header-login-form').css('display', 'none');
    $('.my-account-menu').css('display', 'block');
  }
}

//регистрация
function checkIn() {
  var user = {access: "user"};
  $('.warring-text').slideUp(500, function () {
    $(this).remove();
  });
  Object.keys(validation).forEach(function (field) {
    user[field] = isValid(field);
  });
  if ($('.warring').length === 0) {
    $.ajax({
      url: 'http://localhost:3000/users/',
      type: 'POST',
      data: user
    }).done(function () {
      $('.checkout-form__input').val('');
    });
    return true;
  }
}

//валидация формы регистрации
function isValid(field) {
  var input = $('[data-validation-rule = ' + field + ']');
  var value = input.val();
  var rule = validation[field].rule;
  var warring = $('<div />', {
    class: 'warring-text',
    text: validation[field].warring
  });
  if (rule.test(value)) {
    fieldSuccess(input);
    return value;
  } else {
    fieldWarring(input, warring);
  }
}

//неправильно заполненное поле
function fieldWarring(input, warring) {
  input.addClass('warring');
  input.after(warring);
  warring.slideDown(500);
}

//правильно заполненое поле
function fieldSuccess(input) {
  input.removeClass('warring');
  $('.warring-text').stop().slideUp(500, function () {
    $(this).remove();
  });
}

//объект с проверками полей регистрации
var validation = {
  name: {
    warring: "Не менее 3 букв",
    rule: /^[a-zA-Zа-яА-Я]{3,50}$/
  },
  surname: {
    warring: "Не менее 3букв",
    rule: /^[a-zA-Zа-яА-Я]{3,50}$/
  },
  username: {
    warring: "Не менее 3символов",
    rule: /^[\d\wа-яА-Я]{3,50}$/
  },
  email: {
    warring: "Неверный ввод",
    rule: /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/
  },
  password: {
    warring: "Не менее 8символом",
    rule: /^[\d\wа-яёА-ЯЁ]{8,50}/
  }
};

//отрисовка личных данных
function renderPrivateOffice(id) {
  $.ajax({
    url: 'http://localhost:3000/users/' + id,
    type: 'GET',
    success: function (user) {
      Object.keys(user).forEach(function (field) {
        $('[data-validation-rule = ' + field + ']').val(user[field]);
      })
    }
  })

}

//закончить редактирование личный данных
function cancelEdit() {
  $('#enter').off('click');
  $('.checkout-form__input').off('change');
  $('#edit').show(200);
  $('#enter').hide(200);
  $('.cancel').hide(200);
  $('.checkout-form__input').addClass('readonly');
  $('.checkout-form__input').attr('readonly', 'readonly');
}

(function ($) {
  $(function () {
    isLoggedIn();
    var title = $('title').text();
    if (title === 'Index') {
      renderGoods('?_page=1&_limit=8');
    } else if (title === 'Product') {
      renderGoods('?_page=1&_limit=9');
    } else {
      renderGoods('?_page=1&_limit=4');
    }
    renderCart();

    var idGood = location.hash.replace('#', '');
    renderSinglePage(idGood);

    //добавление товара в корзину
    $('.product-block').on('click', '.fast-add__link', function () {
      var good = $(this).data();
      good.quantity = 1;

      $.ajax({
        url: 'http://localhost:3000/cart',
        type: 'GET',
        success: function (cart) {
          var indx = cart.findIndex(function (value) {
            if (+value.goodId === good.goodId) {
              return true;
            } else {
              return false;
            }
          });
          if (indx === -1) {
            $.ajax({
              url: 'http://localhost:3000/cart/',
              type: 'POST',
              data: good,
              success: function () {
                renderCounter();
              }
            });
          } else {
            var quantity = cart[indx].quantity;
            indx += 1;
            $.ajax({
              url: 'http://localhost:3000/cart/' + indx,
              type: 'PATCH',
              data: {quantity: +quantity + 1}
            });
          }
        }
      });
    });

    //удалеение товара из корзины
    $('.shopping-cart__table').on('click', '.a-delete', function () {
      var good = $(this).data();
      $.ajax({
        url: 'http://localhost:3000/cart/' + good.id,
        type: 'DELETE',
        success: function () {
          renderCart();
        }
      });
    });

    //очищение корзины
    $('.clear').on('click', function () {
      clearCart();
    });

    //изменение кол-ва товара в корзине
    $('.shopping-cart__table').on('input', function (event) {
      var good = $(event.target).data();
      var quantity = $(event.target).val();
      $.ajax({
        url: 'http://localhost:3000/cart/' + good.id,
        type: 'PATCH',
        data: {quantity: quantity},
        success: function () {
          $.ajax({
            url: 'http://localhost:3000/cart/' + good.id,
            type: 'GET',
            success: function (good) {
              var subTotal = '$' + (+good.quantity * +good.price).toFixed(2);
              $(".subTotal[data-id='" + good.id + "']").text(subTotal);
              total();
            }
          })
        }
      });
    });


    $("#slider-range").slider({
      range: true,
      min: 0,
      max: 500,
      values: [75, 300],
      color: 'pink',
      slide: function (event, ui) {
        $("#amount").val("$" + ui.values[0] + " - $" + ui.values[1]);
      }
    });
    $("#amount").val("$" + $("#slider-range").slider("values", 0) +
      " - $" + $("#slider-range").slider("values", 1));

    //выпадающе меню My Accоunt
    $('.my-account').on('click', function () {
      myToggle($('.my-account'), $('.header-login'));
    });

    //вход
    $('#login').on('click', function () {
      login();
    });

    //выход
    $('#logout').on('click', function () {
      logout();
    });

    //регистрация
    $('#check-in').on('click', function (e) {
      if (!checkIn()) {
        e.preventDefault();
      } else {
        alert("Успешно!");
      }
    });

    //отрисовка личного кабинета
    renderPrivateOffice(localStorage.getItem('userId'));

    //редактирование личных данных
    $('#edit').on('click', function () {
      $('#edit').hide(200);
      $('#enter').show(200);
      $('.cancel').show(200);

      $('.checkout-form__input').removeClass('readonly');
      $('.checkout-form__input').removeAttr('readonly');

      var editUser = {};
      $('.checkout-form__input').change(function () {
        $('.warring-text').stop().slideUp(200, function () {
          $(this).remove();
        });
        var data = $(this).data();
        var field = data.validationRule;
        if (isValid(field)) {
          editUser[field] = $(this).val();
        }
      });

      $('#enter').on('click', function () {
        if (Object.keys(editUser).length !== 0 && $('.warring-text').length === 0) {
          $.ajax({
            url: 'http://localhost:3000/users/' + localStorage.getItem('userId'),
            type: 'PATCH',
            data: editUser
          }).done(function () {
            editUser = {};
            cancelEdit();
          });
        }
      });

      $('.cancel').on('click', function () {
        editUser = {};
        cancelEdit();
        fieldSuccess($('.checkout-form__input'));
        renderPrivateOffice(localStorage.getItem('userId'));
      });
    });
  });
})(jQuery);