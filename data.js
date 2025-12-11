// Простая и лёгкая для редактирования схема данных
// Всё хранится в одном массиве paymentMethods. Локализация заголовков и меток — внутри объекта метода.

const paymentData = {
  paymentMethods: [
    {
      key: 'monobank',
      title: { ru: 'Монобанк', ua: 'Монобанк', en: 'Monobank' },
      logo: 'img/mono.png',
      alt: 'Monobank',
      values: { number: '4441 1110 6846 4548', url: 'https://send.monobank.ua/AaWsPtYJK3' },
      fields: [
        { label: { ru: "Имя получателя:", ua: "Ім'я отримувача:", en: 'Recipient:' }, value: { ru: 'Роман Р.', ua: 'Роман Р.', en: 'Roman R.' } },
        { label: { ru: 'Карта:', ua: 'Картка:', en: 'Card:' }, valueFrom: 'number' }
      ],
      actions: { copyFrom: 'number', openFrom: 'url' }
    },
    {
      key: 'privatbank',
      title: { ru: 'Приватбанк', ua: 'Приватбанк', en: 'PrivatBank' },
      logo: 'img/privat24.png',
      alt: 'PrivatBank',
      values: { number: '4149 4390 2762 3200', url: 'https://www.privat24.ua/send/dp8a1' },
      fields: [
        { label: { ru: "Имя получателя:", ua: "Ім'я отримувача:", en: 'Recipient:' }, value: { ru: 'Роман Р.', ua: 'Роман Р.', en: 'Roman R.' } },
        { label: { ru: 'Карта:', ua: 'Картка:', en: 'Card:' }, valueFrom: 'number' }
      ],
      actions: { copyFrom: 'number', openFrom: 'url' }
    },
    {
      key: 'abank',
      title: { ru: 'А-Банк', ua: 'А-Банк', en: 'A-Bank' },
      logo: 'img/abank.webp',
      alt: 'A-Bank',
      values: { number: '4323 3473 7699 5392', url: 'https://pay.a-bank.com.ua/card/35xfUu4sUzXgJxA6' },
      fields: [
        { label: { ru: "Имя получателя:", ua: "Ім'я отримувача:", en: 'Recipient:' }, value: { ru: 'Роман Р.', ua: 'Роман Р.', en: 'Roman R.' } },
        { label: { ru: 'Карта:', ua: 'Картка:', en: 'Card:' }, valueFrom: 'number' }
      ],
      actions: { copyFrom: 'number', openFrom: 'url' }
    },
    {
      key: 'binancePay',
      title: { ru: 'Binance Pay', ua: 'Binance Pay', en: 'Binance Pay' },
      logo: 'img/binance.png',
      alt: 'Binance',
      values: { id: '97301846', url: 'https://app.binance.com/uni-qr/DSKD2zJU' },
      fields: [
        { label: { ru: 'ID:', ua: 'ID:', en: 'ID:' }, valueFrom: 'id' }
      ],
      actions: { copyFrom: 'id', openFrom: 'url' }
    },
    {
      key: 'binanceTRC20',
      title: { ru: 'Binance TRC20 (USDT)', ua: 'Binance TRC20 (USDT)', en: 'Binance TRC20 (USDT)' },
      logo: 'img/USDT-TRC20.png',
      alt: 'USDT-TRC20',
      values: { wallet: 'TDuGEsovbirWiN2RgVnNWfUmc9doCTC18c' },
      fields: [
        { label: { ru: 'TRC20:', ua: 'TRC20:', en: 'TRC20:' }, valueFrom: 'wallet' }
      ],
      actions: { copyFrom: 'wallet' }
    }
  ]
};
