const header = document.querySelector('[data-header]');
const navToggle = document.querySelector('[data-nav-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
const filters = document.querySelectorAll('[data-filter]');
const products = document.querySelectorAll('[data-category]');
const contactForm = document.querySelector('[data-contact-form]');
const formNote = document.querySelector('[data-form-note]');

function setHeaderState() {
  header.classList.toggle('scrolled', window.scrollY > 20);
}

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

navToggle.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});

mobileNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

filters.forEach((button) => {
  button.addEventListener('click', () => {
    const category = button.dataset.filter;

    filters.forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle('active', selected);
      filter.setAttribute('aria-selected', String(selected));
    });

    products.forEach((product) => {
      product.hidden = category !== 'all' && product.dataset.category !== category;
    });
  });
});

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const data = new FormData(contactForm);
  const subject = `Anfrage SchwarzwaldWerk: ${data.get('topic')}`;
  const body = [
    `Name: ${data.get('name')}`,
    `E-Mail: ${data.get('email')}`,
    `Thema: ${data.get('topic')}`,
    '',
    data.get('message')
  ].join('\n');

  window.location.href = `mailto:werkstatt@schwarzwaldwerk.de?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  formNote.textContent = 'Die E-Mail wurde vorbereitet.';
});
