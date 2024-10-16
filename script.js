// Переменная для текущего языка
let currentLanguage = 'ru'; // Установите язык по умолчанию
let baseNotificationText; // Будем обновлять его в зависимости от языка
let notificationTimeout; // Таймер для временного уведомления

// Функция получения перевода
function getTranslation(lang, key) {
    return translations[lang][key] || key; // Получаем перевод или возвращаем ключ, если перевод отсутствует
}

function initializeTranslations() {
    baseNotificationText = translations[currentLanguage].bankIconsClickable; // Обновляем базовое уведомление
    document.getElementById('page-title').innerText = translations[currentLanguage].paymentMethods; // Заголовок страницы
    document.getElementById('payment-methods-title').innerText = translations[currentLanguage].paymentMethods; // Заголовок выбора способа оплаты
    document.getElementById('notification').innerText = translations[currentLanguage].bankIconsClickable; 
    
 // Монобанк
 document.getElementById('monobank-title').innerText = translations[currentLanguage].monobank;
 document.getElementById('monobank-recipient-label').innerText = translations[currentLanguage].monobankRecipient;
 document.getElementById('monobank-recipient').innerText = translations[currentLanguage].recipientName; // Имя получателя
 document.getElementById('monobank-card-label').innerText = translations[currentLanguage].monobankCardNumber;

 // Приватбанк
 document.getElementById('privatbank-title').innerText = translations[currentLanguage].privatbank;
 document.getElementById('privatbank-recipient-label').innerText = translations[currentLanguage].privatbankRecipient;
 document.getElementById('privatbank-recipient').innerText = translations[currentLanguage].recipientName; // Имя получателя
 document.getElementById('privatbank-card-label').innerText = translations[currentLanguage].privatbankCardNumber;

 // А-Банк
 document.getElementById('abank-title').innerText = translations[currentLanguage].abank;
 document.getElementById('abank-recipient-label').innerText = translations[currentLanguage].abankRecipient;
 document.getElementById('abank-recipient').innerText = translations[currentLanguage].recipientName; // Имя получателя
 document.getElementById('abank-card-label').innerText = translations[currentLanguage].abankAccountNumber;


    // Binance Pay
    document.getElementById('binance-pay-title').innerText = translations[currentLanguage].binance;
    document.getElementById('binance-recipient-label').innerText = translations[currentLanguage].binanceRecipient;

    // Binance TRC20
    document.getElementById('binance-title').innerText = translations[currentLanguage].binance;
    document.getElementById('binance-wallet-label').innerText = translations[currentLanguage].binanceWallet;

    // Блок контактов
    document.getElementById('contact-title').innerText = translations[currentLanguage].contact;
    document.getElementById('phone-label').innerText = translations[currentLanguage].phoneLabel;
    document.getElementById('telegram-label').innerText = translations[currentLanguage].telegramLabel;
    document.getElementById('phone-number').innerText = translations[currentLanguage].phoneLink;
    document.getElementById('telegram-link').innerText = translations[currentLanguage].telegramLink;

    // Кнопка переключения темы
    document.getElementById('theme-toggle').innerText = translations[currentLanguage].themeToggleToLight; // Можно обновить в зависимости от темы

    // Кнопки копирования, открытия и QR-кода
    document.querySelectorAll('.copy-button').forEach(button => {
        button.innerText = translations[currentLanguage].copyButton;
    });

    document.querySelectorAll('.open-button').forEach(button => {
        button.innerText = translations[currentLanguage].openButton; // Перевод для кнопки "Открыть"
    });

    // Кнопка "Показать QR-код"
    document.getElementById('qr-button').innerText = translations[currentLanguage].showQRCodeButton; // Добавляем перевод для кнопки QR-кода
}

// Переключение темы
document.getElementById('theme-toggle').addEventListener('click', function() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggle.innerText = getTranslation(currentLanguage, 'themeToggleToLight');
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeToggle.innerText = getTranslation(currentLanguage, 'themeToggleToDark');
    }
});

// Переключение языка
function switchLanguage(lang) {
    currentLanguage = lang; // Обновляем текущий язык
    initializeTranslations(); // Обновляем тексты на странице

    // Уведомление о смене языка
    showNotification(getTranslation(lang, 'languageSelected') + ' ' + lang);
}

// Копирование текста в буфер обмена
function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    
    navigator.clipboard.writeText(text).then(function() {
        showNotification(getTranslation(currentLanguage, 'copySuccess')); // Используем перевод для успешного копирования
    }, function() {
        showNotification(getTranslation(currentLanguage, 'copyError')); // Используем перевод для ошибки копирования
    });
}

// Показ уведомлений
function showNotification(message) {
    const notification = document.getElementById('notification');

    // Скрываем предыдущее уведомление, если оно есть
    if (notificationTimeout) {
        clearTimeout(notificationTimeout);
    }

    notification.innerText = message; // Устанавливаем временное сообщение
    notification.style.visibility = 'visible';

    // Запускаем таймер для скрытия временного уведомления через 3 секунды
    notificationTimeout = setTimeout(function() {
        notification.innerText = baseNotificationText; // Возвращаем базовое уведомление
    }, 3000);
}

// Функция для показа модального окна с QR-кодом
function showQRCode(imageSrc) {
    const modal = document.getElementById('qr-modal');
    const qrImage = document.getElementById('qr-image');

    qrImage.src = imageSrc; // Устанавливаем источник изображения QR-кода
    modal.style.display = 'flex'; // Отображаем модальное окно
}

// Функция для закрытия модального окна
function closeModal() {
    const modal = document.getElementById('qr-modal');
    modal.style.display = 'none'; // Скрываем модальное окно
}

// Закрытие модального окна при нажатии вне его области
window.onclick = function(event) {
    const modal = document.getElementById('qr-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Инициализация перевода при загрузке
initializeTranslations(); // Вызов инициализации при загрузке страницы
