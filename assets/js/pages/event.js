const slides = document.querySelectorAll('.promotion-slide');
const dots = document.querySelectorAll('.promotion-pagination button');
const prevBtn = document.querySelector('.promotion-prev');
const nextBtn = document.querySelector('.promotion-next');
const promotionBanner = document.querySelector('.promotion-banner');

let currentIndex = 0;
let autoSlide;
let touchStartX = 0;
let touchEndX = 0;

/* 현재 슬라이드 보여주기 */
function showSlide(index) {
  if (!slides.length) return;

  if (index < 0) {
    index = slides.length - 1;
  }

  if (index >= slides.length) {
    index = 0;
  }

  slides.forEach((slide) => {
    slide.classList.remove('active');
  });

  dots.forEach((dot) => {
    dot.classList.remove('active');
  });

  slides[index].classList.add('active');

  if (dots[index]) {
    dots[index].classList.add('active');
  }

  currentIndex = index;
}

/* 자동 슬라이드 */
function startAutoSlide() {
  clearInterval(autoSlide);

  autoSlide = setInterval(() => {
    showSlide(currentIndex + 1);
  }, 5000);
}

/* 페이지네이션 */
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    showSlide(index);
    startAutoSlide();
  });
});

/* 이전 */
if (prevBtn) {
  prevBtn.addEventListener('click', () => {
    showSlide(currentIndex - 1);
    startAutoSlide();
  });
}

/* 다음 */
if (nextBtn) {
  nextBtn.addEventListener('click', () => {
    showSlide(currentIndex + 1);
    startAutoSlide();
  });
}

/* 모바일 터치 시작 */
if (promotionBanner) {
  promotionBanner.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].clientX;
    },
    { passive: true }
  );

  /* 모바일 터치 끝 */
  promotionBanner.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].clientX;

      const moveX = touchStartX - touchEndX;

      /* 50px 이상 움직였을 때만 슬라이드 */
      if (Math.abs(moveX) < 50) return;

      /* 왼쪽으로 밀기 → 다음 */
      if (moveX > 0) {
        showSlide(currentIndex + 1);
      }

      /* 오른쪽으로 밀기 → 이전 */
      if (moveX < 0) {
        showSlide(currentIndex - 1);
      }

      startAutoSlide();
    },
    { passive: true }
  );
}

/* 첫 화면 */
showSlide(0);

/* 자동재생 시작 */
startAutoSlide();
