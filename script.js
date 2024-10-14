// Переменная для текущего языка
let currentLanguage = 'ru'; // Установите язык по умолчанию

// Функция получения перевода
function getTranslation(lang, key) {
    return translations[lang][key] || key;
}

// Инициализация перевода при загрузке
function initializeTranslations() {
    const body = document.body;

    // Обновляем тексты на странице
    document.getElementById('monobank-title').innerText = getTranslation(currentLanguage, 'monobank');
    document.getElementById('monobank-card-label').innerText = getTranslation(currentLanguage, 'monobankCardNumber');
    document.getElementById('monobank-recipient-label').innerText = getTranslation(currentLanguage, 'monobankRecipient');

    document.getElementById('privatbank-title').innerText = getTranslation(currentLanguage, 'privatbank');
    document.getElementById('privatbank-card-label').innerText = getTranslation(currentLanguage, 'privatbankCardNumber');
    document.getElementById('privatbank-recipient-label').innerText = getTranslation(currentLanguage, 'privatbankRecipient');

    document.getElementById('abank-title').innerText = getTranslation(currentLanguage, 'abank');
    document.getElementById('abank-account-label').innerText = getTranslation(currentLanguage, 'abankAccountNumber');
    document.getElementById('abank-recipient-label').innerText = getTranslation(currentLanguage, 'abankRecipient');

    document.getElementById('binance-title').innerText = getTranslation(currentLanguage, 'binance');
    document.getElementById('binance-wallet-label').innerText = getTranslation(currentLanguage, 'binanceWallet');
    document.getElementById('binance-recipient-label').innerText = getTranslation(currentLanguage, 'binanceRecipient');

    document.getElementById('payment-methods-title').innerText = getTranslation(currentLanguage, 'paymentMethods');

    // Обновляем текст кнопок копирования
    const copyButtons = document.querySelectorAll('.copy-button');
    copyButtons.forEach(button => {
        button.innerText = getTranslation(currentLanguage, 'copyButton');
    });

    // Обновляем текст кнопки смены темы
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.innerText = body.classList.contains('dark-theme')
        ? getTranslation(currentLanguage, 'themeToggleToLight')
        : getTranslation(currentLanguage, 'themeToggleToDark');
}

// Переключение темы
document.getElementById('theme-toggle').addEventListener('click', function() {
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');

    if (body.classList.contains('dark-theme')) {
        body.classList.remove('dark-theme');
        body.classList.add('light-theme');
        themeToggle.innerText = getTranslation(currentLanguage, 'themeToggleToLight'); // Исправлено
    } else {
        body.classList.remove('light-theme');
        body.classList.add('dark-theme');
        themeToggle.innerText = getTranslation(currentLanguage, 'themeToggleToDark'); // Исправлено
    }
});

// Переключение языка
function switchLanguage(lang) {
    currentLanguage = lang; // Обновляем текущий язык
    initializeTranslations(); // Обновляем тексты на странице

    // Уведомление о смене языка
    showNotification(getTranslation(lang, 'languageSelected') + lang);
}

// Копирование текста в буфер обмена
function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text).then(function() {
        showNotification(getTranslation(currentLanguage, 'copySuccess'));
    }, function() {
        showNotification(getTranslation(currentLanguage, 'copyError'));
    });
}

// Показ уведомлений
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.innerText = message;
    notification.style.visibility = 'visible';

    setTimeout(function() {
        notification.style.visibility = 'hidden';
    }, 5000);
}

// Инициализация перевода при загрузке
initializeTranslations();
