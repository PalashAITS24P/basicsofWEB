
function setTimestamp() {
  const ts = document.getElementById('timestamp');
  ts.value = new Date().toISOString();
}

function validateFullName(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Please enter your full name (first and last).';
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length < 2) return 'Use at least first and last name (two words).';
  if (parts.some(p => p.length < 2)) return 'Each name must be at least 2 characters.';
  return '';
}

function validateEmail(value) {
  const trimmed = value.trim();
  if (!trimmed) return 'Email is required.';
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(trimmed)) return 'Please enter a valid email address.';
  return '';
}

function validatePhone(value) {
  const trimmed = value.trim().replace(/\s+/g, '');
  if (!trimmed) return 'Phone number is required.';
  const fiPattern = /^(?:\+358\d{8,10}|0\d{8,10})$/;
  if (!fiPattern.test(trimmed)) {
    return 'Use +358 followed by 8–10 digits (no leading 0), or 0 followed by 8–10 digits.';
  }
  return '';
}

function validateBirthDate(value) {
  if (!value) return 'Birth date is required.';
  const today = new Date();
  const date = new Date(value + 'T00:00:00');
  if (isNaN(date.getTime())) return 'Enter a valid date.';
  if (date > today) return 'Birth date cannot be in the future.';
  const minAgeDate = new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
  if (date > minAgeDate) return 'You must be at least 13 years old.';
  return '';
}

function validateTerms(checked) {
  return checked ? '' : 'You must accept the terms to submit.';
}

function setError(inputEl, errorEl, message) {
  errorEl.textContent = message;
  if (message) {
    inputEl.classList.remove('border-slate-300', 'focus:ring-blue-500');
    inputEl.classList.add('border-red-500', 'focus:ring-red-500');
  } else {
    inputEl.classList.remove('border-red-500', 'focus:ring-red-500');
    inputEl.classList.add('border-slate-300', 'focus:ring-blue-500');
  }
}

function clearErrors() {
  document.querySelectorAll('.text-red-600').forEach(e => (e.textContent = ''));
  document.querySelectorAll('input').forEach(i => {
    i.classList.remove('border-red-500', 'focus:ring-red-500');
    i.classList.add('border-slate-300', 'focus:ring-blue-500');
  });
}

function appendRow({ timestamp, fullName, email, phone, birthDate, terms }) {
  const tbody = document.getElementById('rows');
  const tr = document.createElement('tr');
  [timestamp, fullName, email, phone, birthDate, terms ? 'Yes' : 'No'].forEach(text => {
    const td = document.createElement('td');
    td.textContent = text;
    td.className = 'px-3 py-2 border-b border-slate-200';
    tr.appendChild(td);
  });
  tbody.appendChild(tr);
}

document.addEventListener('DOMContentLoaded', () => {
  setTimestamp();

  const form = document.getElementById('regForm');
  const clearBtn = document.getElementById('clearBtn');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrors();
    setTimestamp();

    const fullNameEl = document.getElementById('fullName');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const birthDateEl = document.getElementById('birthDate');
    const termsEl = document.getElementById('terms');
    const timestampEl = document.getElementById('timestamp');

    const errFullName = validateFullName(fullNameEl.value);
    const errEmail = validateEmail(emailEl.value);
    const errPhone = validatePhone(phoneEl.value);
    const errBirthDate = validateBirthDate(birthDateEl.value);
    const errTerms = validateTerms(termsEl.checked);

    setError(fullNameEl, document.getElementById('errFullName'), errFullName);
    setError(emailEl, document.getElementById('errEmail'), errEmail);
    setError(phoneEl, document.getElementById('errPhone'), errPhone);
    setError(birthDateEl, document.getElementById('errBirthDate'), errBirthDate);
    setError(termsEl, document.getElementById('errTerms'), errTerms);

    const hasErrors = [errFullName, errEmail, errPhone, errBirthDate, errTerms].some(Boolean);
    if (hasErrors) return;

    appendRow({
      timestamp: timestampEl.value,
      fullName: fullNameEl.value.trim(),
      email: emailEl.value.trim(),
      phone: phoneEl.value.trim(),
      birthDate: birthDateEl.value,
      terms: termsEl.checked
    });

    form.reset();
    setTimestamp();
  });

  clearBtn.addEventListener('click', () => {
    form.reset();
    clearErrors();
    setTimestamp();
  });
});
