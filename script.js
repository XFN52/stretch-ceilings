// Скрипт калькулятора и формы для сайта «ПОТОЛКИ 52»
document.addEventListener('DOMContentLoaded', function () {
  // Элементы калькулятора
  const lengthInput = document.getElementById('calc-length');
  const widthInput = document.getElementById('calc-width');
  const typeSelect = document.getElementById('calc-type');
  const areaVal = document.getElementById('calc-area-val');
  const totalVal = document.getElementById('calc-total-val');
  const calcSubmitBtn = document.getElementById('calc-submit-action');
  const summaryHiddenInput = document.getElementById('form-calc-summary');
  const leadForm = document.getElementById('main-lead-form');

  // Функция расчёта стоимости
  function updateCalculator() {
    if (!lengthInput || !widthInput || !typeSelect) return;

    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(widthInput.value) || 0;
    const pricePerM2 = parseInt(typeSelect.value, 10) || 390;

    // Расчёт площади и итоговой суммы
    const area = length * width;
    const totalPrice = Math.round(area * pricePerM2);

    // Форматирование чисел для красивого отображения
    const formattedArea = area.toFixed(1);
    const formattedPrice = totalPrice.toLocaleString('ru-RU');

    if (areaVal) {
      areaVal.textContent = formattedArea;
    }

    if (totalVal) {
      totalVal.textContent = 'от ' + formattedPrice + ' ₽';
      totalVal.classList.remove('pulse-update');
      void totalVal.offsetWidth; // Trigger reflow
      totalVal.classList.add('pulse-update');
    }

    // Сохранение итоговой сводки для передачи в форму заявки
    const selectedTypeName = typeSelect.options[typeSelect.selectedIndex].text.split('(')[0].trim();
    const summaryText = `Площадь: ${formattedArea} м², Тип: ${selectedTypeName}, Сумма: от ${formattedPrice} ₽`;
    
    if (summaryHiddenInput) {
      summaryHiddenInput.value = summaryText;
    }
  }

  // Слушатели событий изменений параметров калькулятора
  if (lengthInput && widthInput && typeSelect) {
    lengthInput.addEventListener('input', updateCalculator);
    widthInput.addEventListener('input', updateCalculator);
    typeSelect.addEventListener('change', updateCalculator);
    
    // Первоначальный расчёт при загрузке
    updateCalculator();
  }

  // Перенос данных из калькулятора в форму при клике на кнопку «Вызвать замерщика на эту сумму»
  if (calcSubmitBtn) {
    calcSubmitBtn.addEventListener('click', function (e) {
      // Имя полотна
      const selectedTypeName = typeSelect.options[typeSelect.selectedIndex].text.split('(')[0].trim();
      const currentArea = areaVal.textContent;
      const currentTotal = totalVal.textContent;

      // Плавно прокручиваем к форме
      const formElement = document.getElementById('order-form');
      if (formElement) {
        formElement.scrollIntoView({ behavior: 'smooth' });
      }

      // Помещаем фокус на поле ввода имени
      const nameInput = document.getElementById('user-name');
      if (nameInput) {
        setTimeout(function () {
          nameInput.focus();
        }, 500);
      }
    });
  }

  // Обработка отправки главной формы
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const nameField = document.getElementById('user-name');
      const phoneField = document.getElementById('user-phone');

      if (!nameField.value.trim() || !phoneField.value.trim()) {
        alert('Пожалуйста, заполните имя и номер телефона.');
        return;
      }

      // Сообщение об успешной отправке заявки
      const calcSummary = summaryHiddenInput ? summaryHiddenInput.value : '';
      let successMsg = `Спасибо, ${nameField.value}! Заявка принята.\nПерезвоним вам в течение 15 минут.`;
      
      if (calcSummary) {
        successMsg += `\n\nПараметры вашего расчёта:\n${calcSummary}`;
      }

      alert(successMsg);

      // Очистка формы
      leadForm.reset();
      updateCalculator();
    });
  }

  // Детализированный наблюдатель IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.12,
      rootMargin: '0px 0px -30px 0px'
    };

    const scrollObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');

          // Автоматическая каскадная прорисовка для дочерних элементов с классом stagger-child
          const staggeredChildren = entry.target.querySelectorAll('.stagger-child');
          staggeredChildren.forEach(function (child, idx) {
            setTimeout(function () {
              child.classList.add('is-visible');
            }, idx * 120);
          });

          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Наблюдение за заголовками секций и всеми анимируемыми блоками
    const targets = document.querySelectorAll('.section-title, .anim-fade-up, .anim-fade-scale, .anim-slide-left, .animate-on-scroll');
    targets.forEach(function (el) {
      scrollObserver.observe(el);
    });
  }

  // Анимация сужения шапки при скролле
  const header = document.querySelector('.header');
  if (header) {
    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('is-scrolled');
      } else {
        header.classList.remove('is-scrolled');
      }
    });
  }

  // Эффект Ripple (волна) при клике на кнопки
  document.querySelectorAll('.btn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      const circle = document.createElement('span');
      circle.classList.add('ripple-effect');
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.width = circle.style.height = size + 'px';
      circle.style.left = e.clientX - rect.left - size / 2 + 'px';
      circle.style.top = e.clientY - rect.top - size / 2 + 'px';
      btn.appendChild(circle);

      setTimeout(function () {
        circle.remove();
      }, 600);
    });
  });

  // Эффект параллакса первого экрана при движении мыши
  const heroSection = document.querySelector('.hero-section');
  if (heroSection && window.innerWidth > 768) {
    heroSection.addEventListener('mousemove', function (e) {
      const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
      const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
      heroSection.style.backgroundPosition = `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`;
    });
  }
});
