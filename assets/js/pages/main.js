/* ========================================
   Main Swiper
======================================== */

const mainSwiper = new Swiper('.main-swiper', {
  loop: true,
  speed: 800,
  autoplay: {
    delay: 4000,
    disableOnInteraction: false
  },

  pagination: {
    el: '.swiper-pagination',
    clickable: true
  },

  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev'
  }
});

/* ========================================
   Search Filter
======================================== */

const filterItems =
  document.querySelectorAll('.filter-item');

const filterButtons =
  document.querySelectorAll('.filter-btn');

/* 모든 필터 닫기 */

function closeFilterMenus() {
  filterItems.forEach((item) => {
    item.classList.remove('is-open');
  });

  filterButtons.forEach((button) => {
    button.setAttribute(
      'aria-expanded',
      'false'
    );
  });
}

/* 필터 버튼 */

filterButtons.forEach((button) => {
  button.addEventListener(
    'click',
    function (event) {
      event.stopPropagation();

      const currentItem =
        button.closest('.filter-item');

      const isOpen =
        currentItem.classList.contains(
          'is-open'
        );

      closeFilterMenus();

      if (!isOpen) {

        currentItem.classList.add(
          'is-open'
        );

        button.setAttribute(
          'aria-expanded',
          'true'
        );
      }
    }
  );
});

/* ========================================
   Filter Menu 선택
======================================== */

const filterMenuButtons =
  document.querySelectorAll(
    '.filter-menu button'
  );

filterMenuButtons.forEach((menuButton) => {
  menuButton.addEventListener(
    'click',
    function () {

      const filterItem =
        menuButton.closest('.filter-item');

      const filterButton =
        filterItem.querySelector(
          '.filter-btn'
        );

      const selectedText =
        menuButton.textContent;

      console.log(
        '선택한 조건:',
        selectedText
      );

      closeFilterMenus();

    }
  );
});

/* ========================================
   바깥 클릭하면 닫기
======================================== */

document.addEventListener(
  'click',
  function () {

    closeFilterMenus();
  }
);


/* ========================================
   검색 버튼
======================================== */

const searchButton =
  document.querySelector('.search-btn');

searchButton.addEventListener(
  'click',
  function () {
    console.log(
      '차량 검색 실행'
    );
  }
);
