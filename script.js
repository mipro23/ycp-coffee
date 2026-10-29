/**
 * YCP Coffee & Kitchen — Interactive Client Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveHoursStatus();
  initMobileMenu();
  initMenuTabs();
  initTasteMatcher();
  initBookingForm();
  initScrollHeader();
  initDefaultBookingDate();
});

/**
 * 1. Live Operating Hours Indicator
 * Weekdays: 09:00 – 22:00
 * Weekends: 10:00 – 22:00 (Moscow Time UTC+3)
 */
function initLiveHoursStatus() {
  const statusEl = document.getElementById('liveStatusText');
  if (!statusEl) return;

  const now = new Date();
  // Get Moscow hours
  const moscowOffset = 3;
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const moscowTime = new Date(utc + (3600000 * moscowOffset));

  const day = moscowTime.getDay(); // 0 is Sunday, 6 is Saturday
  const hour = moscowTime.getHours();
  const minute = moscowTime.getMinutes();

  const isWeekend = (day === 0 || day === 6);
  const openHour = isWeekend ? 10 : 9;
  const closeHour = 22;

  const isOpen = (hour > openHour || (hour === openHour && minute >= 0)) && (hour < closeHour);

  if (isOpen) {
    statusEl.innerHTML = `<strong>Сейчас открыто</strong> — ждём вас до 22:00`;
  } else {
    const nextOpen = isWeekend ? '10:00' : '09:00';
    statusEl.innerHTML = `Сейчас закрыто — откроемся в ${nextOpen}`;
    const dot = document.querySelector('.status-dot');
    if (dot) {
      dot.style.background = '#E5E7EB';
      dot.style.boxShadow = 'none';
    }
  }
}

/**
 * 2. Mobile Menu Toggle
 */
function initMobileMenu() {
  const burger = document.getElementById('burgerBtn');
  const menu = document.getElementById('mobileMenu');
  if (!burger || !menu) return;

  burger.addEventListener('click', () => {
    menu.classList.toggle('open');
    burger.classList.toggle('active');
  });

  // Close when clicking link
  const links = menu.querySelectorAll('.mobile-nav-link, .btn');
  links.forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
      burger.classList.remove('active');
    });
  });
}

/**
 * 3. Menu Category Filter Tabs
 */
function initMenuTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const items = document.querySelectorAll('.menu-item');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-category');

      items.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (cat === 'all' || itemCat === cat) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn 0.35s ease';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });
}

/**
 * 4. Interactive Specialty Coffee Matcher
 */
function initTasteMatcher() {
  const flavorBtns = document.querySelectorAll('#flavorChoice .choice-btn');
  const strengthBtns = document.querySelectorAll('#strengthChoice .choice-btn');

  const recTitle = document.getElementById('recDrinkTitle');
  const recDesc = document.getElementById('recDrinkDesc');

  if (!flavorBtns.length || !recTitle || !recDesc) return;

  const recommendations = {
    'fruit-medium': {
      title: 'Воронка V60 Finca El Diviso (Таби)',
      desc: 'Яркие ноты малинового варенья, ежевики и чистое послевкусие тёмного шоколада. Идеальный баланс сочности и плотности.'
    },
    'fruit-light': {
      title: 'Фильтр Batch Brew (Эфиопия Иргачефф)',
      desc: 'Легкое, чайное тело с оттенками бергамота, персика и белых цветов. Освежает и заряжает мягкой энергией.'
    },
    'fruit-bold': {
      title: 'Аэропресс Specialty (Колумбия Анаэробная)',
      desc: 'Концентрированный, густой ягодный сироп с сочной кислотностью красных ягод и глубоким винным тоном.'
    },
    'chocolate-medium': {
      title: 'Двойной Флэт Уайт на кокосовом молоке',
      desc: 'Плотный шот эспрессо с мягкой сливочно-ореховой сладостью. Бархатная шелковистая текстура.'
    },
    'chocolate-light': {
      title: 'Американо на зерне Бразилия Можиана',
      desc: 'Классический мягкий кофе с нотами жареного фундука, какао-бобов и карамели.'
    },
    'chocolate-bold': {
      title: 'Двойной Эспрессо (Доппио)',
      desc: 'Взрывная плотность, густая крема, ноты горького шоколада 85% и жареного миндаля.'
    },
    'milk-medium': {
      title: 'Флэт Уайт на овсяном молоке (Oat Flat White)',
      desc: 'Абсолютный хит кофейни YCP. Идеальное сочетание плотной кофейной основы и естественной овсяной сладости.'
    },
    'milk-light': {
      title: 'Капучино 350 мл / Церемониальная Матча',
      desc: 'Много шелковистой микропены, легкий кофейный или травяной чайный профиль.'
    },
    'milk-bold': {
      title: 'Сливочный Раф с мадагаскарской ванилью',
      desc: 'Плотный десертный напиток со взбитыми натуральными сливками и настоящей бурбонской ванилью.'
    },
    'clean-medium': {
      title: 'Воронка V60 Кения Киринъяга',
      desc: 'Кристальная чистота чашки, взрывная смородина, грейпфрут и искристая яблочная кислотность.'
    },
    'clean-light': {
      title: 'Холодный Колд Брю с апельсиновым фрешем',
      desc: 'Медленная 14-часовая экстракция холодным способом. Абсолютно чистый и тонизирующий напиток.'
    },
    'clean-bold': {
      title: 'Эспрессо Тоник на сухом индийском тонике',
      desc: 'Игристая горчинка хинина, яркий цитрусовый акцент и плотный спешелти эспрессо.'
    }
  };

  let currentFlavor = 'fruit';
  let currentStrength = 'medium';

  function updateRec() {
    const key = `${currentFlavor}-${currentStrength}`;
    const rec = recommendations[key] || recommendations['fruit-medium'];

    recTitle.style.opacity = '0';
    recDesc.style.opacity = '0';

    setTimeout(() => {
      recTitle.textContent = rec.title;
      recDesc.textContent = rec.desc;
      recTitle.style.opacity = '1';
      recDesc.style.opacity = '1';
    }, 150);
  }

  flavorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      flavorBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFlavor = btn.getAttribute('data-flavor');
      updateRec();
    });
  });

  strengthBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      strengthBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentStrength = btn.getAttribute('data-strength');
      updateRec();
    });
  });
}

/**
 * 5. Booking Form Handler
 */
function initBookingForm() {
  const form = document.getElementById('bookingForm');
  const successBox = document.getElementById('bookingSuccess');
  const resetBtn = document.getElementById('resetBookingBtn');

  if (!form || !successBox) return;

  // Phone input formatting helper
  const phoneInput = document.getElementById('bPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      let val = e.target.value.replace(/\D/g, '');
      if (val.startsWith('7') || val.startsWith('8')) val = val.substring(1);
      let formatted = '+7 (';
      if (val.length > 0) formatted += val.substring(0, 3);
      if (val.length >= 3) formatted += ') ' + val.substring(3, 6);
      if (val.length >= 6) formatted += '-' + val.substring(6, 8);
      if (val.length >= 8) formatted += '-' + val.substring(8, 10);
      e.target.value = val.length ? formatted : '';
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBookingBtn');
    if (btn) {
      btn.textContent = 'Отправка...';
      btn.disabled = true;
    }

    setTimeout(() => {
      form.style.display = 'none';
      successBox.style.display = 'block';
      if (btn) {
        btn.textContent = 'Отправить заявку';
        btn.disabled = false;
      }
    }, 600);
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      successBox.style.display = 'none';
    });
  }
}

/**
 * 6. Set Default Booking Date (Today)
 */
function initDefaultBookingDate() {
  const dateInput = document.getElementById('bDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
}

/**
 * 7. Header Shadow on Scroll
 */
function initScrollHeader() {
  const header = document.getElementById('header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.4)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}
