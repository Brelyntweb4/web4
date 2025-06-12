document.addEventListener('DOMContentLoaded', () => {
  const payBtns = document.querySelectorAll('.pay-method');
  let currentPay = 'PayPal';
  payBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      payBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentPay = btn.textContent.trim();
    });
  });
  const form = document.getElementById('buyForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const sum = form.querySelector('input[type="number"]').value;
      alert(`Отправлен запрос на покупку ${sum} BRY через ${currentPay}. (Заглушка — интеграция позже)`);
    });
  }
});
