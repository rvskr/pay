// Переменная для текущего языка
let currentLanguage = 'ru'; // Установите язык по умолчанию
let baseNotificationText; // Будем обновлять его в зависимости от языка
let notificationTimeout; // Таймер для временного уведомления
const THEME_STORAGE_KEY = 'themePreference'; // 'light' | 'dark' | null (системная)

// Функция получения перевода
function getTranslation(lang, key) {
    // Проверяем, что объект translations существует
    if (typeof translations === 'undefined') {
        console.warn('Translations not loaded yet');
        return key;
    }
    // Проверяем существование языка и ключа
    if (translations[lang] && translations[lang][key]) {
        return translations[lang][key];
    }
    // Если перевод не найден, пробуем русский как fallback
    if (lang !== 'ru' && translations['ru'] && translations['ru'][key]) {
        return translations['ru'][key];
    }
    // Если и русского нет, возвращаем ключ
    return key;
}

// Тема: применение и авто-детект
function applyTheme(mode) {
    const body = document.body;
    if (mode === 'light') {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
    } else if (mode === 'dark') {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
    }
    // Обновим визуальное состояние кнопки
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.classList.toggle('dark', body.classList.contains('dark-theme'));
        themeToggle.classList.toggle('light', body.classList.contains('light-theme'));
    }
}

function detectSystemTheme() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function loadStoredTheme() {
    try { return localStorage.getItem(THEME_STORAGE_KEY); } catch (_) { return null; }
}

function saveStoredTheme(modeOrNull) {
    try {
        if (!modeOrNull) localStorage.removeItem(THEME_STORAGE_KEY);
        else localStorage.setItem(THEME_STORAGE_KEY, modeOrNull);
    } catch (_) {}
}

// Вспомогательная функция копирования произвольного текста
function copyValue(text) {
    if (!text || typeof text !== 'string') {
        showNotification('Ошибка: нет текста для копирования');
        return;
    }
    navigator.clipboard.writeText(text).then(
        () => showNotification(getTranslation(currentLanguage, 'copySuccess') || 'Скопировано в буфер обмена!'),
        () => showNotification(getTranslation(currentLanguage, 'copyError') || 'Ошибка при копировании!')
    );
}

// Рендер списка способов оплаты из paymentData.paymentMethods (локализация из data.js)
function renderPaymentMethods() {
    const root = document.getElementById('payment-methods');
    if (!root) return;
    root.innerHTML = '';

    paymentData.paymentMethods.forEach((item) => {
        const values = item.values || {};

        const card = document.createElement('div');
        card.className = 'payment-method';

        const info = document.createElement('div');
        info.className = 'payment-info';
        card.appendChild(info);

        // Image block
        const imageWrap = document.createElement('div');
        imageWrap.className = 'payment-image';
        let imageInner = null;
        const openUrl = item.actions && item.actions.openFrom ? values[item.actions.openFrom] : null;
        if (openUrl) {
            const a = document.createElement('a');
            a.href = openUrl;
            a.target = '_blank';
            imageInner = a;
        } else {
            imageInner = document.createElement('div');
        }
        const img = document.createElement('img');
        img.src = item.logo || '';
        img.alt = item.alt || item.key;
        imageInner.appendChild(img);
        imageWrap.appendChild(imageInner);
        info.appendChild(imageWrap);

        // Details block
        const details = document.createElement('div');
        details.className = 'payment-details';
        const titleP = document.createElement('p');
        const titleStrong = document.createElement('strong');
        titleStrong.textContent = (item.title && item.title[currentLanguage]) || item.key;
        titleP.appendChild(titleStrong);
        details.appendChild(titleP);

        (item.fields || []).forEach((f) => {
            const p = document.createElement('p');
            const label = document.createElement('span');
            const labelText = f.label && f.label[currentLanguage] ? f.label[currentLanguage] : '';
            label.textContent = labelText;
            const value = document.createElement('span');
            const val = f.value ? (f.value[currentLanguage] || '') : (values[f.valueFrom] || '');
            value.textContent = val;
            p.appendChild(label);
            p.appendChild(document.createTextNode(' '));
            p.appendChild(value);
            details.appendChild(p);
        });
        info.appendChild(details);

        // Buttons
        const btns = document.createElement('div');
        btns.className = 'payment-buttons';

        if (item.actions?.copyFrom) {
            const copyBtn = document.createElement('button');
            copyBtn.className = 'copy-button';
            copyBtn.textContent = getTranslation(currentLanguage, 'copyButton') || 'Копировать';
            const copyVal = values[item.actions.copyFrom] || '';
            copyBtn.addEventListener('click', () => copyValue(copyVal));
            btns.appendChild(copyBtn);
        }

        if (item.actions?.openFrom && values[item.actions.openFrom]) {
            const openBtn = document.createElement('button');
            openBtn.className = 'open-button';
            openBtn.textContent = getTranslation(currentLanguage, 'openButton') || 'Открыть';
            openBtn.addEventListener('click', () => window.open(values[item.actions.openFrom], '_blank'));
            btns.appendChild(openBtn);
        }

        card.appendChild(btns);
        root.appendChild(card);
    });
}

function initializeTranslations() {
    // Проверяем, что переводы загружены
    if (typeof translations === 'undefined') {
        console.warn('Translations not loaded, retrying in 100ms...');
        setTimeout(initializeTranslations, 100);
        return;
    }
    // Проверяем наличие данных платежей
    if (typeof paymentData === 'undefined') {
        console.warn('paymentData not loaded, retrying in 100ms...');
        setTimeout(initializeTranslations, 100);
        return;
    }
    
    baseNotificationText = getTranslation(currentLanguage, 'bankIconsClickable'); // Обновляем базовое уведомление
    document.getElementById('page-title').innerText = getTranslation(currentLanguage, 'paymentMethods'); // Заголовок страницы
    document.getElementById('payment-methods-title').innerText = getTranslation(currentLanguage, 'paymentMethods'); // Заголовок выбора способа оплаты
    document.getElementById('notification').innerText = getTranslation(currentLanguage, 'bankIconsClickable'); 

    // Рендер способов оплаты (динамически)
    renderPaymentMethods();

    // Блок контактов
    document.getElementById('contact-title').innerText = getTranslation(currentLanguage, 'contact');
    document.getElementById('phone-label').innerText = getTranslation(currentLanguage, 'phoneLabel');
    document.getElementById('telegram-label').innerText = getTranslation(currentLanguage, 'telegramLabel');
    document.getElementById('phone-number').innerText = getTranslation(currentLanguage, 'phoneLink');
    document.getElementById('telegram-link').innerText = getTranslation(currentLanguage, 'telegramLink');
    const phoneA = document.getElementById('phone-number');
    const tgA = document.getElementById('telegram-link');
    // Устанавливаем href только если данные контактов присутствуют в paymentData
    if (phoneA && paymentData.contacts?.phone?.href) phoneA.href = paymentData.contacts.phone.href;
    if (tgA && paymentData.contacts?.telegram?.href) tgA.href = paymentData.contacts.telegram.href;

    // Кнопки копирования и открытия (оставляем текстовыми)
    document.querySelectorAll('.copy-button').forEach(button => {
        button.innerText = getTranslation(currentLanguage, 'copyButton');
    });

    document.querySelectorAll('.open-button').forEach(button => {
        button.innerText = getTranslation(currentLanguage, 'openButton');
    });

    // Обновляем title атрибуты для иконочных кнопок
    document.getElementById('theme-toggle').title = getTranslation(currentLanguage, 'themeToggleToLight');
    document.getElementById('qr-button').title = getTranslation(currentLanguage, 'showQRCodeButton');
}

// Переключение темы
document.getElementById('theme-toggle').addEventListener('click', function() {
    const body = document.body;
    const currentlyDark = body.classList.contains('dark-theme');
    const next = currentlyDark ? 'light' : 'dark';
    applyTheme(next);
    saveStoredTheme(next); // явный выбор пользователя
    showNotification(getTranslation(currentLanguage, next === 'light' ? 'themeToggleToLight' : 'themeToggleToDark'));
});

// Переключение языка
function switchLanguage(lang) {
    currentLanguage = lang; // Обновляем текущий язык
    initializeTranslations(); // Обновляем тексты на странице (перерендер)

    // Уведомление о смене языка с проверкой на существование перевода
    const languageNames = {
        'ru': 'Русский',
        'ua': 'Українська', 
        'en': 'English'
    };
    
    const selectedText = getTranslation(lang, 'languageSelected');
    const languageName = languageNames[lang] || lang;
    
    if (selectedText && selectedText !== 'languageSelected') {
        showNotification(selectedText + languageName);
    } else {
        showNotification('Language selected: ' + languageName);
    }
}

// Удалена устаревшая функция copyText(elementId) — вместо неё используется copyValue(text)

// Показ уведомлений
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (!notification) {
        console.error('Notification element not found');
        return;
    }

    // Проверяем, что сообщение не undefined и не пустое
    const displayMessage = message && typeof message === 'string' ? message : 'Уведомление';

    // Скрываем предыдущее уведомление, если оно есть
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    if (isMobile) {
        // Мобильный «тост»: структура с текстом и кнопкой закрытия
        if (!notification.querySelector('.toast-text')) {
            notification.innerHTML = '<span class="toast-text"></span><button class="toast-close" type="button" aria-label="Close"></button>';
        }
        const textEl = notification.querySelector('.toast-text');
        textEl.textContent = displayMessage;

        // Показ тоста
        notification.classList.add('show');

        // Кнопка закрытия
        const closeBtn = notification.querySelector('.toast-close');
        if (closeBtn && !closeBtn._bound) {
            closeBtn.addEventListener('click', () => {
                notification.classList.remove('show');
            });
            closeBtn._bound = true;
        }

        // Свайп вверх для закрытия
        if (!notification._swipeBound) {
            let startY = null;
            let swiping = false;

            const onTouchStart = (e) => {
                const t = e.touches && e.touches[0];
                startY = t ? t.clientY : null;
                swiping = false;
            };

            const onTouchMove = (e) => {
                if (startY == null) return;
                const t = e.touches && e.touches[0];
                if (!t) return;
                const dy = t.clientY - startY; // вверх: отрицательное
                if (dy < -5) swiping = true;
                const offset = Math.max(-120, Math.min(0, dy));
                // Применяем временный сдвиг
                notification.style.transform = `translate(-50%, ${offset}px)`;
            };

            const onTouchEnd = () => {
                if (swiping) {
                    // Закрываем, если смахнули достаточно вверх
                    notification.classList.remove('show');
                }
                // Сбрасываем инлайновый стиль
                notification.style.transform = '';
                startY = null;
                swiping = false;
            };

            notification.addEventListener('touchstart', onTouchStart, { passive: true });
            notification.addEventListener('touchmove', onTouchMove, { passive: true });
            notification.addEventListener('touchend', onTouchEnd, { passive: true });
            notification.addEventListener('touchcancel', onTouchEnd, { passive: true });
            notification._swipeBound = true;
        }

        // Авто-скрытие через 3 секунды
        notificationTimeout = setTimeout(function() {
            notification.classList.remove('show');
            // На мобильных базовое сообщение не нужно поддерживать постоянно
        }, 1500);
    } else {
        // Десктоп: оставляем статичный баннер с возвратом базового текста
        notification.textContent = displayMessage;
        notification.style.visibility = 'visible';
        notificationTimeout = setTimeout(function() {
            const baseText = baseNotificationText || getTranslation(currentLanguage, 'bankIconsClickable') || 'Добро пожаловать!';
            notification.innerText = baseText; // Возвращаем базовое уведомление
        }, 1500);
    }
}

// Функция для показа модального окна с QR-кодом
function showQRCode(imageSrc) {
    const modal = document.getElementById('qr-modal');
    const qrImage = document.getElementById('qr-image');

    qrImage.src = imageSrc; // Устанавливаем источник изображения QR-кода
    modal.style.display = 'flex'; // Отображаем модальное окно
}

// Закрытие модального окна осуществляется кликом по оверлею (см. обработчик ниже)

// Закрытие модального окна при нажатии вне его области
window.onclick = function(event) {
    const modal = document.getElementById('qr-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Удалён неиспользуемый код анимации изображений


// Инициализация при загрузке страницы
function initializePage() {
    // Тема: применяем сохранённую или системную
    const stored = loadStoredTheme();
    const mode = stored || detectSystemTheme();
    applyTheme(mode);

    // Следим за изменением системной темы, если нет явного выбора
    const mq = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
    if (mq && !stored) {
        mq.addEventListener('change', (e) => {
            if (!loadStoredTheme()) {
                applyTheme(e.matches ? 'dark' : 'light');
            }
        });
    }

    // Тексты и остальной рендер
    initializeTranslations(); // Вызов инициализации переводов
}

// Функция для снятия фокуса с кнопок после клика
function removeFocusFromButtons() {
    // Добавляем обработчики для всех кнопок
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            // Снимаем фокус через небольшую задержку
            setTimeout(() => {
                this.blur();
            }, 100);
        });
    });
}

// Удалены обработчики специфичных touch-состояний как избыточные

// Функция для безопасной инициализации
function safeInitialize() {
    // Проверяем готовность DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', safeInitialize);
        return;
    }
    
    // Проверяем наличие переводов
    if (typeof translations === 'undefined') {
        console.warn('Translations not loaded, retrying...');
        setTimeout(safeInitialize, 100);
        return;
    }
    
    // Все готово, запускаем инициализацию
    initializePage();
    removeFocusFromButtons();
}

// Вызов безопасной инициализации
safeInitialize();
