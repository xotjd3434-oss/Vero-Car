/* ==================================================
   HTML
================================================== */
const carGrid = document.querySelector('#carGrid');
const carCount = document.querySelector('#carCount');
const pagination = document.querySelector('#pagination');
const originTabs = document.querySelectorAll('.origin-tab');
const filterTitles = document.querySelectorAll('.filter-title');
const filterChecks = document.querySelectorAll('.check-row input');
const mileageMin = document.querySelector('#mileageMin');
const mileageMax = document.querySelector('#mileageMax');
const yearMin = document.querySelector('#yearMin');
const yearMax = document.querySelector('#yearMax');
const filterReset = document.querySelector('#filterReset');
const sortButtons = document.querySelectorAll('.sort-btn');
const carSearch = document.querySelector('#carSearch');
const searchBtn = document.querySelector('#searchBtn');

/* ==================================================
   상태
================================================== */

let cars = [];
let filteredCars = [];
let selectedOrigin = 'all';
let currentPage = 1;
const pageSize = 10;
let sortState = {
  type: null,
  direction: 'default'
};


/* * ==================================================
   JSON 데이터
================================================== */

function loadCars() {
  fetch('../../assets/data/cars-100.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('차량 데이터를 불러오지 못했습니다.');
      }

      return response.json();
    })
    .then(data => {
      cars = data.map(normalizeCar);

      updateFilterCounts(cars);

      applyFilters();
    })
    .catch(error => {
      console.warn(error);

      cars = fallbackCars;

      applyFilters();
    });
}


/* ==================================================
   JSON 속성 정리
================================================== */

function normalizeCar(car) {
  return {
    id: car.id,

    origin: String(car.origin || '국산').trim(),

    brand: car.brand || '',

    modelName:
      car.modelName ||
      car.model ||
      '차량명 없음',

    bodyType:
      car.bodyType ||
      car.sizeClass ||
      '',

    modelYear:
      Number(car.modelYear || car.year) || 0,

    regDate:
      car.regDate ||
      car.createdAt ||
      '2000-01-01',

    mileage:
      Number(car.mileage) || 0,

    region:
      car.region || '',

    price:
      Number(car.price) || 0,

    monthlyPayment:
      Number(car.monthlyPayment) ||
      Math.round((Number(car.price) * 10000) / 60),

    thumbnail:
      resolveImagePath(car.thumbnail),

    exteriorImages:
      Array.isArray(car.exteriorImages)
        ? car.exteriorImages.map(resolveImagePath)
        : [],

    interiorImages:
      Array.isArray(car.interiorImages)
        ? car.interiorImages.map(resolveImagePath)
        : [],

    exteriorColor:
      car.exteriorColor ||
      car.color ||
      '검정',

    tags:
      Array.isArray(car.tags)
        ? car.tags
        : []
  };
}
/* ==================================================
   차종 / 제조사 차량 개수
================================================== */

function updateFilterCounts(carData) {

  /* 차종 개수 */
  document
    .querySelectorAll('input[name="bodyType"]')
    .forEach(input => {

      const row = input.closest('.check-row');
      const countText = row.querySelector('.check-count');

      if (!countText) return;

      const count = carData.filter(car =>
        car.bodyType === input.value
      ).length;

      countText.textContent = `${count}대`;

    });


  /* 제조사 개수 */
  document
    .querySelectorAll('input[name="brand"]')
    .forEach(input => {

      const row = input.closest('.check-row');
      const countText = row.querySelector('.check-count');

      if (!countText) return;

      const count = carData.filter(car =>
        car.brand === input.value
      ).length;

      countText.textContent = `${count}대`;

    });

}

/* ==================================================
   이미지 경로
================================================== */

function resolveImagePath(path) {
  if (!path) {
    return '';
  }

  if (
    path.startsWith('http') ||
    path.startsWith('../') ||
    path.startsWith('/')
  ) {
    return path;
  }

  if (path.startsWith('assets/')) {
    return `../../${path}`;
  }

  return `../../assets/img/cars-json-img/${path}`;
}


/* ==================================================
   숫자 콤마
================================================== */

function numberFormat(number) {
  return Number(number).toLocaleString('ko-KR');
}


/* ==================================================
   카드 렌더링
================================================== */

function renderCars() {
  carGrid.innerHTML = '';

  const start = (currentPage - 1) * pageSize;

  const end = start + pageSize;

  const pageCars = filteredCars.slice(start, end);


  if (pageCars.length === 0) {
    carGrid.innerHTML = `
            <p class="no-result">
                조건에 맞는 차량이 없습니다.
            </p>
        `;

    return;
  }


  pageCars.forEach(car => {

    const card = document.createElement('article');

    card.className = 'car-card';

    card.innerHTML = `
  <div class="car-card-image" data-id="${car.id}">

    <img
      src="${car.thumbnail}"
      alt="${car.modelName}"
      class="car-main-image"
    >

    <button 
  type="button" 
  class="heart-btn" 
  data-id="${car.id}" 
  aria-label="관심차량" 
> 
  <img 
    src="../../assets/img/buy-img/heart-off.png" 
    alt="찜하기" 
    class="heart-icon"
  >
</button>

    <!-- 외부 / 내부 -->
    <div class="gallery-tabs ${car.exteriorImages.length === 0 &&
        car.interiorImages.length === 0
        ? 'hidden'
        : ''
      }">
      <button
        type="button"
        class="gallery-tab"
        data-gallery="exterior"
      >
        외부
      </button>

      <button
        type="button"
        class="gallery-tab"
        data-gallery="interior"
      >
        내부
      </button>
    </div>

    <!-- 처음에는 숨김 -->
    <div class="gallery-thumbs hidden"></div>

  </div>

  <a
    href="../Car%20Detail%20Page/cardetailpage.html?id=${car.id}"
    class="car-card-link"
  >
    <div class="car-card-body">

      <h3 class="car-name">
        ${car.modelName}
      </h3>

      <p class="car-meta">
        ${String(car.regDate).slice(2, 7).replace('-', '/')}년식
        (${String(car.modelYear).slice(2)}년형)
        ${numberFormat(car.mileage)}km
        ${car.region}
      </p>

      <div class="car-price-box">

        <div class="car-price">
          <strong>
            ${numberFormat(car.price)}
          </strong>
          <span>만원</span>
        </div>

        <p class="car-monthly">
          60개월시 월
          ${numberFormat(car.monthlyPayment)}원
        </p>

      </div>

      <div class="car-tags">
        ${car.tags.map(tag => {
        const isSeat = tag.includes('시트');

        const seatColor = isSeat
          ? tag.replace(' 시트', '')
          : '';

        return `
            <span class="car-tag ${isSeat ? 'seat-tag' : ''}">
              ${isSeat
            ? `<span
                      class="seat-color"
                      style="background:${getTagColor(seatColor)}"
                    ></span>`
            : ''
          }
              ${tag}
            </span>
          `;
      }).join('')}
      </div>

    </div>
  </a>
`;

    carGrid.appendChild(card);
  });


  bindHeartButtons();
  bindGallery();
}


/* ==================================================
   태그 색상
================================================== */

function getTagColor(color) {
  const colors = {
    검정: '#000000',
    블랙: '#000000',
    흰색: '#ffffff',
    화이트: '#ffffff',
    그레이: '#a5adb7',
    회색: '#a5adb7',
    브라운: '#8b5e3c',
    베이지: '#d9c6a5',
    네이비: '#14224d',
    블루: '#2563eb',
    빨강: '#ef4444',
    레드: '#ef4444'
  };

  return colors[color] || '#000';
}


/* ==================================================
   필터
================================================== */

function applyFilters() {

  filteredCars = [...cars];


  /* 국산 / 수입 */

  if (selectedOrigin !== 'all') {
    filteredCars = filteredCars.filter(car => {
      return car.origin === selectedOrigin;
    });
  }


  /* 검색 */

  const keyword = carSearch.value.trim().toLowerCase();

  if (keyword) {
    filteredCars = filteredCars.filter(car => {

      const text =
        `${car.brand} ${car.modelName}`.toLowerCase();

      return text.includes(keyword);
    });
  }


  /* 체크박스 */

  const bodyTypes = getCheckedValues('bodyType');

  const brands = getCheckedValues('brand');


  if (bodyTypes.length > 0) {
    filteredCars = filteredCars.filter(car => {
      return bodyTypes.some(type => {
        return car.bodyType.includes(type);
      });
    });
  }


  if (brands.length > 0) {
    filteredCars = filteredCars.filter(car => {
      return brands.includes(car.brand);
    });
  }


  /* 주행거리 */

  const minMileage =
    Number(mileageMin.value);

  const maxMileage =
    Number(mileageMax.value);


  if (mileageMin.value !== '') {
    filteredCars = filteredCars.filter(car => {
      return car.mileage >= minMileage;
    });
  }


  if (mileageMax.value !== '') {
    filteredCars = filteredCars.filter(car => {
      return car.mileage <= maxMileage;
    });
  }


  /* 연식 */

  const minYear =
    Number(yearMin.value);

  const maxYear =
    Number(yearMax.value);


  if (yearMin.value !== '') {
    filteredCars = filteredCars.filter(car => {
      return car.modelYear >= minYear;
    });
  }


  if (yearMax.value !== '') {
    filteredCars = filteredCars.filter(car => {
      return car.modelYear <= maxYear;
    });
  }


  sortCars();


  carCount.textContent =
    filteredCars.length;


  currentPage = 1;


  renderCars();

  renderPagination();
}


/* ==================================================
   체크된 값
================================================== */

function getCheckedValues(name) {
  return [
    ...document.querySelectorAll(
      `input[name="${name}"]:checked`
    )
  ].map(input => input.value);
}


/* ==================================================
   DROPDOWN
================================================== */

filterTitles.forEach(button => {

  button.addEventListener('click', () => {

    const group =
      button.closest('.filter-group');

    const isOpen =
      group.classList.toggle('open');


    button.setAttribute(
      'aria-expanded',
      isOpen
    );

  });

});


/* ==================================================
   국산 / 수입
================================================== */

function normalizeOrigin(value) {
  if (!value) return 'all';

  const origin = String(value).trim();

  if (
    origin === 'all' ||
    origin === '전체'
  ) {
    return 'all';
  }

  if (
    origin === '국산' ||
    origin === '국산차' ||
    origin === 'domestic'
  ) {
    return '국산';
  }

  if (
    origin === '수입' ||
    origin === '수입차' ||
    origin === 'import'
  ) {
    return '수입';
  }

  return origin;
}

originTabs.forEach(tab => {
  tab.addEventListener('click', () => {

    /* 국산/수입 버튼 중 기존 선택 제거 */
    originTabs.forEach(item => {
      item.classList.remove('active');
    });

    /* 지금 누른 버튼만 선택 */
    tab.classList.add('active');

    selectedOrigin =
      normalizeOrigin(tab.dataset.origin);

    /* 국산 → 수입 변경 시 기존 브랜드 선택 해제 */
    document
      .querySelectorAll('input[name="brand"]')
      .forEach(input => {
        input.checked = false;
      });

    applyFilters();
  });
});


/* ==================================================
   CHECKBOX
================================================== */

filterChecks.forEach(input => {

  input.addEventListener('change', () => {

    if (input.checked) {

      const sameGroup =
        document.querySelectorAll(
          `input[name="${input.name}"]`
        );

      sameGroup.forEach(item => {

        if (item !== input) {
          item.checked = false;
        }

      });
    }

    applyFilters();
  });

});

/* ==================================================
   RANGE
================================================== */

[
  mileageMin,
  mileageMax,
  yearMin,
  yearMax
].forEach(input => {

  input.addEventListener(
    'input',
    applyFilters
  );

});


/* ==================================================
   검색
================================================== */

searchBtn.addEventListener(
  'click',
  applyFilters
);


carSearch.addEventListener(
  'keydown',
  event => {

    if (event.key === 'Enter') {
      applyFilters();
    }

  }
);


/* ==================================================
   정렬
================================================== */

const sortLabels = {
  date: '등록일',
  price: '가격',
  mileage: '주행거리',
  year: '연식'
};


/* 정렬 버튼을 처음 상태로 되돌리는 함수 */
function resetSortButtons() {
  sortButtons.forEach(button => {
    button.classList.remove('active');
    button.textContent = sortLabels[button.dataset.sort];
  });

  document
    .querySelector('[data-sort="date"]')
    .classList.add('active');
}


/* 정렬 버튼 클릭 */
sortButtons.forEach(button => {
  button.addEventListener('click', () => {

    const type = button.dataset.sort;


    /* 다른 버튼을 처음 클릭했을 때 */
    if (
      sortState.type !== type ||
      button.textContent === sortLabels[type]
    ) {
      sortState.type = type;
      sortState.direction = 'desc';
    }


    /* 같은 버튼을 다시 클릭했을 때 */
    else {
      if (sortState.direction === 'desc') {
        sortState.direction = 'asc';
      }

      else if (sortState.direction === 'asc') {

        /* 3번째 클릭 → 처음 상태로 복귀 */
        sortState.type = 'date';
        sortState.direction = 'desc';

        resetSortButtons();

        sortCars();

        currentPage = 1;

        renderCars();

        renderPagination();

        return;
      }
    }


    /* active 초기화 */
    sortButtons.forEach(item => {
      item.classList.remove('active');
    });


    /* 현재 누른 버튼 active */
    button.classList.add('active');


    /* 버튼 글씨 변경 */
    changeSortText(button);


    /* 실제 차량 정렬 */
    sortCars();


    /* 정렬하면 1페이지로 */
    currentPage = 1;


    renderCars();

    renderPagination();

  });
});


/* ==================================================
   정렬 버튼 글씨 변경
================================================== */

function changeSortText(button) {

  /* 다른 버튼들은 기본 글씨로 */
  sortButtons.forEach(item => {
    if (item !== button) {
      item.textContent = sortLabels[item.dataset.sort];
    }
  });


  const type = sortState.type;
  const direction = sortState.direction;


  if (type === 'date') {
    button.textContent =
      direction === 'desc'
        ? '최신순'
        : '오래된순';
  }


  if (type === 'price') {
    button.textContent =
      direction === 'desc'
        ? '가격 높은순'
        : '가격 낮은순';
  }


  if (type === 'mileage') {
    button.textContent =
      direction === 'desc'
        ? '주행거리 많은순'
        : '주행거리 적은순';
  }


  if (type === 'year') {
    button.textContent =
      direction === 'desc'
        ? '최근연식순'
        : '오래된연식순';
  }

}


/* ==================================================
   실제 정렬
================================================== */

function sortCars() {

  const direction =
    sortState.direction === 'desc'
      ? -1
      : 1;


  filteredCars.sort((a, b) => {

    if (sortState.type === 'date') {
      return (
        new Date(a.regDate) -
        new Date(b.regDate)
      ) * direction;
    }


    if (sortState.type === 'price') {
      return (
        a.price -
        b.price
      ) * direction;
    }


    if (sortState.type === 'mileage') {
      return (
        a.mileage -
        b.mileage
      ) * direction;
    }


    if (sortState.type === 'year') {
      return (
        a.modelYear -
        b.modelYear
      ) * direction;
    }


    return 0;

  });


  /* 투싼 id 1은 항상 맨 앞 */
  const tucsonIndex =
    filteredCars.findIndex(car => car.id === 1);


  if (tucsonIndex > 0) {
    const tucson =
      filteredCars.splice(tucsonIndex, 1)[0];

    filteredCars.unshift(tucson);
  }

}


/* ==================================================
   FILTER RESET
================================================== */

filterReset.addEventListener('click', () => {

  selectedOrigin = 'all';


  originTabs.forEach(tab => {
    tab.classList.toggle(
      'active',
      tab.dataset.origin === 'all'
    );
  });


  filterChecks.forEach(input => {
    input.checked = false;
  });


  mileageMin.value = '';
  mileageMax.value = '';

  yearMin.value = '';
  yearMax.value = '';

  carSearch.value = '';


  /* 정렬도 처음 상태 */
  sortState = {
    type: 'date',
    direction: 'desc'
  };


  resetSortButtons();


  currentPage = 1;


  applyFilters();

});

/* ==================================================
   HEART
================================================== */

function bindHeartButtons() {
  const heartButtons =
    document.querySelectorAll('.heart-btn');

  heartButtons.forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();

      button.classList.toggle('active');

      const heartIcon =
        button.querySelector('.heart-icon');

      heartIcon.src =
        button.classList.contains('active')
          ? '../../assets/img/buy-img/heart-on.png'
          : '../../assets/img/buy-img/heart-off.png';
    });
  });
}
/* ==================================================
   외부 / 내부 이미지 갤러리
================================================== */

function bindGallery() {

  const imageAreas =
    document.querySelectorAll('.car-card-image');

  imageAreas.forEach(area => {

    const carId =
      Number(area.dataset.id);

    const car =
      filteredCars.find(car => car.id === carId);

    if (!car) return;

    const mainImage =
      area.querySelector('.car-main-image');

    const tabs =
      area.querySelectorAll('.gallery-tab');

    const thumbArea =
      area.querySelector('.gallery-thumbs');

    if (!mainImage || !thumbArea) return;


    /* 오른쪽 썸네일 만들기 */
    function renderThumbs(images) {

      thumbArea.innerHTML = '';

      if (images.length === 0) {
        thumbArea.classList.add('hidden');
        return;
      }

      thumbArea.classList.remove('hidden');

      images.forEach((image, index) => {

        const button =
          document.createElement('button');

        button.type = 'button';

        button.className =
          index === 0
            ? 'gallery-thumb active'
            : 'gallery-thumb';

        button.innerHTML = `
          <img src="${image}" alt="">
        `;

        button.addEventListener('click', event => {

          event.preventDefault();
          event.stopPropagation();

          mainImage.src = image;

          thumbArea
            .querySelectorAll('.gallery-thumb')
            .forEach(item => {
              item.classList.remove('active');
            });

          button.classList.add('active');

        });

        thumbArea.appendChild(button);

      });

      mainImage.src = images[0];
    }


    /* 외부 / 내부 버튼 클릭 */
    tabs.forEach(tab => {

      tab.addEventListener('click', event => {

        event.preventDefault();
        event.stopPropagation();

        tabs.forEach(item => {
          item.classList.remove('active');
        });

        tab.classList.add('active');


        /* 외부 */
        if (tab.dataset.gallery === 'exterior') {

          renderThumbs(
            car.exteriorImages.length > 0
              ? car.exteriorImages
              : [car.thumbnail]
          );

        }


        /* 내부 */
        if (tab.dataset.gallery === 'interior') {

          renderThumbs(
            car.interiorImages
          );

        }

      });

    });

  });

}


/* ==================================================
   PAGINATION
================================================== */

function renderPagination() {

  pagination.innerHTML = '';


  const pageCount =
    Math.ceil(
      filteredCars.length / pageSize
    );


  if (pageCount <= 1) {
    return;
  }


  for (
    let page = 1;
    page <= pageCount;
    page++
  ) {

    const button =
      document.createElement('button');


    button.type =
      'button';


    button.className =
      'page-btn';


    button.textContent =
      page;


    if (page === currentPage) {
      button.classList.add('active');
    }


    button.addEventListener('click', () => {

      currentPage = page;


      renderCars();

      renderPagination();


      document
        .querySelector('.buy-content')
        .scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });

    });


    pagination.appendChild(button);

  }


  /* 다음 버튼 */

  if (currentPage < pageCount) {

    const nextButton =
      document.createElement('button');


    nextButton.type =
      'button';


    nextButton.className =
      'page-btn page-next';


    nextButton.innerHTML = `
         <img src="../../assets/img/buy-img/다음페이지.png" alt="다음 페이지">`;


    nextButton.addEventListener('click', () => {

      currentPage++;


      renderCars();

      renderPagination();

    });


    pagination.appendChild(nextButton);

  }

}


/* ==================================================
   시작
================================================== */

loadCars();