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
  type: 'date',
  direction: 'desc'
};


/* ==================================================
   테스트용 fallback 데이터
================================================== */

const fallbackCars = [
  {
    id: 1,
    origin: '국산',
    brand: '현대',
    modelName: '더 올 뉴 투싼 1.6 터보 2WD 모던',
    bodyType: 'SUV',
    modelYear: 2022,
    regDate: '2022-06-01',
    mileage: 28450,
    region: '경기',
    price: 2450,
    monthlyPayment: 540000,
    thumbnail: '../../assets/img/cars-json-img/투싼 흰색.png',
    exteriorColor: '검정',
    owners: 1,
    accidentFree: true
  },
  {
    id: 2,
    origin: '수입',
    brand: '벤츠',
    modelName: '벤츠 E클래스 (W213) E350 4매틱 AMG 라인',
    bodyType: '중형차',
    modelYear: 2022,
    regDate: '2022-09-01',
    mileage: 36400,
    region: '경기',
    price: 6700,
    monthlyPayment: 1276688,
    thumbnail: '../../assets/img/cars-json-img/e클래스검정.png',
    exteriorColor: '검정',
    owners: 1,
    accidentFree: true
  },
  {
    id: 3,
    origin: '수입',
    brand: '아우디',
    modelName: '아우디 A6 45 TFSI 콰트로 프리미엄',
    bodyType: '중형차',
    modelYear: 2022,
    regDate: '2022-09-01',
    mileage: 41200,
    region: '서울',
    price: 4180,
    monthlyPayment: 700000,
    thumbnail: '../../assets/img/cars-json-img/a6 흰색.png',
    exteriorColor: '검정',
    owners: 1,
    accidentFree: true
  },
  {
    id: 4,
    origin: '국산',
    brand: '현대',
    modelName: '현대 아반떼 (CN7) 1.6 가솔린 인스퍼레이션',
    bodyType: '준중형차',
    modelYear: 2022,
    regDate: '2022-06-01',
    mileage: 37200,
    region: '인천',
    price: 1780,
    monthlyPayment: 300000,
    thumbnail: '../../assets/img/cars-json-img/아반떼 검정.png',
    exteriorColor: '검정',
    owners: 1,
    accidentFree: true
  },
  {
    id: 5,
    origin: '국산',
    brand: '현대',
    modelName: '현대 팰리세이드 3.8 가솔린 8인승 캘리그래피',
    bodyType: 'SUV',
    modelYear: 2022,
    regDate: '2022-04-01',
    mileage: 61800,
    region: '서울',
    price: 4180,
    monthlyPayment: 700000,
    thumbnail: '../../assets/img/cars-json-img/현대 팰리세이드.png',
    exteriorColor: '브라운',
    owners: 1,
    accidentFree: true
  },
  {
    id: 6,
    origin: '국산',
    brand: '현대',
    modelName: '현대 그랜저 (GN7) 2.5 가솔린 캘리그래피',
    bodyType: '대형차',
    modelYear: 2024,
    regDate: '2023-09-01',
    mileage: 18600,
    region: '서울',
    price: 4290,
    monthlyPayment: 720000,
    thumbnail: '../../assets/img/cars-json-img/그랜저신형 검정.png',
    exteriorColor: '검정',
    owners: 1,
    accidentFree: true
  },
  {
    id: 7,
    origin: '국산',
    brand: '기아',
    modelName: '기아 쏘렌토 (MQ4) 1.6 터보 하이브리드 시그니처',
    bodyType: 'SUV',
    modelYear: 2023,
    regDate: '2023-10-01',
    mileage: 38500,
    region: '경기',
    price: 3890,
    monthlyPayment: 650000,
    thumbnail: '../../assets/img/cars-json-img/쏘렌토 흰색.png',
    exteriorColor: '검정',
    owners: 1,
    accidentFree: true
  },
  {
    id: 8,
    origin: '국산',
    brand: '현대',
    modelName: '현대 캐스퍼 1.0 터보 인스퍼레이션',
    bodyType: '경차',
    modelYear: 2023,
    regDate: '2023-06-01',
    mileage: 12800,
    region: '대전',
    price: 1590,
    monthlyPayment: 270000,
    thumbnail: '../../assets/img/cars-json-img/캐스퍼아이보리.png',
    exteriorColor: '그레이',
    owners: 1,
    accidentFree: true
  },
  {
    id: 9,
    origin: '수입',
    brand: '테슬라',
    modelName: '테슬라 모델 3 롱레인지 AWD',
    bodyType: '중형차',
    modelYear: 2023,
    regDate: '2022-11-01',
    mileage: 42300,
    region: '서울',
    price: 3880,
    monthlyPayment: 650000,
    thumbnail: '../../assets/img/cars-json-img/테슬라모델3 네이비.png',
    exteriorColor: '검정',
    owners: 1,
    accidentFree: true
  },
  {
    id: 10,
    origin: '국산',
    brand: '기아',
    modelName: '기아 K5 1.6 터보 노블레스',
    bodyType: '중형차',
    modelYear: 2022,
    regDate: '2022-03-01',
    mileage: 43700,
    region: '대전',
    price: 2480,
    monthlyPayment: 410000,
    thumbnail: '../../assets/img/cars-json-img/k5 흰색.png',
    exteriorColor: '그레이',
    owners: 1,
    accidentFree: true
  }
];


/* ==================================================
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

    origin: car.origin || '국산',

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

    exteriorColor:
      car.exteriorColor ||
      car.color ||
      '검정',

    owners:
      Number(car.owners) || 1,

    accidentFree:
      car.accidentFree !== false
  };
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


    const ownerTag =
      car.owners === 1
        ? '1인 신조'
        : `${car.owners}인 소유`;


    const insuranceTag =
      car.accidentFree
        ? '보험 이력 없음'
        : '보험 이력 있음';


    card.innerHTML = `
            <div class="car-card-image">

                <img
                    src="${car.thumbnail}"
                    alt="${car.modelName}"
                >

                <button
                    type="button"
                    class="heart-btn"
                    data-id="${car.id}"
                    aria-label="관심차량"
                >
                    ♡
                </button>

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

                            <span>
                                만원
                            </span>
                        </div>

                        <p class="car-monthly">
                            60개월시 월
                            ${numberFormat(car.monthlyPayment)}원
                        </p>

                    </div>


                    <div class="car-tags">

                        <span
                            class="car-tag car-tag-color"
                            style="--tag-color:${getTagColor(car.exteriorColor)}"
                        >
                            ${car.exteriorColor} 시트
                        </span>

                        <span class="car-tag">
                            ${ownerTag}
                        </span>

                        <span class="car-tag">
                            ${insuranceTag}
                        </span>

                    </div>

                </div>

            </a>
        `;


    carGrid.appendChild(card);
  });


  bindHeartButtons();
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

originTabs.forEach(tab => {

  tab.addEventListener('click', () => {

    originTabs.forEach(item => {
      item.classList.remove('active');
    });


    tab.classList.add('active');


    selectedOrigin =
      tab.dataset.origin;


    applyFilters();

  });

});


/* ==================================================
   CHECKBOX
================================================== */

filterChecks.forEach(input => {

  input.addEventListener(
    'change',
    applyFilters
  );

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

sortButtons.forEach(button => {

  button.addEventListener('click', () => {

    const type =
      button.dataset.sort;


    /* 같은 버튼 다시 누르면 방향 변경 */

    if (sortState.type === type) {

      sortState.direction =
        sortState.direction === 'desc'
          ? 'asc'
          : 'desc';

    } else {

      sortState.type = type;

      sortState.direction = 'desc';

    }


    sortButtons.forEach(item => {
      item.classList.remove('active');
    });


    button.classList.add('active');


    changeSortText(button);


    sortCars();

    currentPage = 1;

    renderCars();

    renderPagination();

  });

});


/* ==================================================
   정렬 버튼 글씨 변경
================================================== */

function changeSortText(button) {

  sortButtons.forEach(item => {

    if (item !== button) {

      const labels = {
        date: '등록일',
        price: '가격',
        mileage: '주행거리',
        year: '연식'
      };

      item.textContent =
        labels[item.dataset.sort];

    }

  });


  const type =
    sortState.type;

  const direction =
    sortState.direction;


  if (type === 'date') {

    button.textContent =
      direction === 'desc'
        ? '최신순'
        : '오래된순';

  }


  if (type === 'price') {

    button.textContent =
      direction === 'desc'
        ? '높은순'
        : '낮은순';

  }


  if (type === 'mileage') {

    button.textContent =
      direction === 'desc'
        ? '많은순'
        : '적은순';

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


  sortState = {
    type: 'date',
    direction: 'desc'
  };


  sortButtons.forEach(button => {

    button.classList.remove('active');

    const labels = {
      date: '등록일',
      price: '가격',
      mileage: '주행거리',
      year: '연식'
    };


    button.textContent =
      labels[button.dataset.sort];

  });


  document
    .querySelector('[data-sort="date"]')
    .classList.add('active');


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


      button.textContent =
        button.classList.contains('active')
          ? '♥'
          : '♡';

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


    nextButton.textContent =
      '›';


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