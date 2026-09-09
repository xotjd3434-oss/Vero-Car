const slides = document.querySelectorAll('.promotion-slide');
const dots = document.querySelectorAll('.promotion-pagination button');
const prevBtn = document.querySelector('.promotion-prev');
const nextBtn = document.querySelector('.promotion-next');
let currentIndex = 0;

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  slides[index].classList.add('active');
  dots[index].classList.add('active');
  currentIndex = index;
}

dots.forEach((dot, index) => {
  dot.addEventListener('click', () => showSlide(index));
});

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}, 5000);