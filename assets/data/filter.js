/* =========================================================
   VERO CAR — 내차사기 검색 · 필터
   data/cars.json + data/filters.json 기반
   ========================================================= */

/* ---------------------------------------------------------
   1. 상태값
   --------------------------------------------------------- */
var filterState = {
  origin: "all",      // all | 국산 | 수입
  bodyType: [],       // ["sedan", "suv"]
  brand: [],          // ["현대", "기아"]
  model: [],          // ["투싼"]
  price: [],          // ["p3", "p4"]
  mileage: [],        // ["m2"]
  year: [],           // ["y2023"]
  keyword: "",        // 검색어
  sort: "createdAt"
};

function filterReset() {
  filterState = {
    origin: "all", bodyType: [], brand: [], model: [],
    price: [], mileage: [], year: [], keyword: "", sort: "createdAt"
  };
}

/* ---------------------------------------------------------
   2. 그룹별 판정
   그룹 안에서는 OR, 그룹끼리는 AND
   --------------------------------------------------------- */
function matchOrigin(car, state) {
  return state.origin === "all" || car.origin === state.origin;
}

function matchBodyType(car, state, defs) {
  if (!state.bodyType.length) return true;
  return state.bodyType.some(function (key) {
    var d = defs.bodyType.find(function (x) { return x.key === key; });
    return d && car[d.field] === d.value;
  });
}

function matchBrand(car, state) {
  if (!state.brand.length) return true;
  return state.brand.indexOf(car.brand) > -1;
}

function matchModel(car, state) {
  if (!state.model.length) return true;
  return state.model.indexOf(car.model) > -1;
}

function matchRange(car, state, defs, group, field) {
  if (!state[group].length) return true;
  return state[group].some(function (key) {
    var d = defs[group].find(function (x) { return x.key === key; });
    return d && car[field] >= d.min && car[field] <= d.max;
  });
}

function matchKeyword(car, state) {
  var q = (state.keyword || "").trim().toLowerCase();
  if (!q) return true;
  var hay = [car.brand, car.modelName, car.model, car.trim, car.region]
    .join(" ").toLowerCase();
  return hay.indexOf(q) > -1;
}

/* ---------------------------------------------------------
   3. 필터 적용
   skipGroup: 카운트 계산용. 해당 그룹만 빼고 판정한다
   --------------------------------------------------------- */
function applyFilters(cars, state, defs, skipGroup) {
  return cars.filter(function (car) {
    if (skipGroup !== "origin"   && !matchOrigin(car, state)) return false;
    if (skipGroup !== "bodyType" && !matchBodyType(car, state, defs)) return false;
    if (skipGroup !== "brand"    && !matchBrand(car, state)) return false;
    if (skipGroup !== "model"    && !matchModel(car, state)) return false;
    if (skipGroup !== "price"    && !matchRange(car, state, defs, "price", "price")) return false;
    if (skipGroup !== "mileage"  && !matchRange(car, state, defs, "mileage", "mileage")) return false;
    if (skipGroup !== "year"     && !matchRange(car, state, defs, "year", "modelYear")) return false;
    if (!matchKeyword(car, state)) return false;
    return true;
  });
}

/* ---------------------------------------------------------
   4. 옵션별 카운트 재계산
   자기 그룹은 제외하고 센다.
   그래야 '벤츠(6)' 체크한 상태에서도 'BMW(3)'가 그대로 보인다
   --------------------------------------------------------- */
function countOptions(cars, state, defs) {
  var result = { origin: {}, bodyType: {}, brand: {}, model: {}, price: {}, mileage: {}, year: {} };

  var poolOrigin = applyFilters(cars, state, defs, "origin");
  result.origin.all = poolOrigin.length;
  result.origin["국산"] = poolOrigin.filter(function (c) { return c.origin === "국산"; }).length;
  result.origin["수입"] = poolOrigin.filter(function (c) { return c.origin === "수입"; }).length;

  var poolBody = applyFilters(cars, state, defs, "bodyType");
  defs.bodyType.forEach(function (d) {
    result.bodyType[d.key] = poolBody.filter(function (c) { return c[d.field] === d.value; }).length;
  });

  var poolBrand = applyFilters(cars, state, defs, "brand");
  ["국산", "수입"].forEach(function (o) {
    defs.brand[o].forEach(function (b) {
      result.brand[b.key] = poolBrand.filter(function (c) { return c.brand === b.key; }).length;
    });
  });

  var poolModel = applyFilters(cars, state, defs, "model");
  ["국산", "수입"].forEach(function (o) {
    defs.brand[o].forEach(function (b) {
      b.models.forEach(function (m) {
        result.model[m.key] = poolModel.filter(function (c) { return c.model === m.key; }).length;
      });
    });
  });

  [["price", "price"], ["mileage", "mileage"], ["year", "modelYear"]].forEach(function (pair) {
    var group = pair[0], field = pair[1];
    var pool = applyFilters(cars, state, defs, group);
    defs[group].forEach(function (d) {
      result[group][d.key] = pool.filter(function (c) {
        return c[field] >= d.min && c[field] <= d.max;
      }).length;
    });
  });

  return result;
}

/* ---------------------------------------------------------
   5. 정렬
   --------------------------------------------------------- */
function sortCars(cars, sortKey, defs) {
  var d = defs.sort.find(function (x) { return x.key === sortKey; }) || defs.sort[0];
  var dir = d.order === "asc" ? 1 : -1;
  return cars.slice().sort(function (a, b) {
    if (a[d.field] < b[d.field]) return -1 * dir;
    if (a[d.field] > b[d.field]) return 1 * dir;
    return 0;
  });
}

/* ---------------------------------------------------------
   6. 배지 생성
   Tier A 짧은 주행거리 → Tier D 시트색상 → Tier C 1인신조 → Tier B 검증이력
   카드당 최대 3개, Tier A는 1개까지
   --------------------------------------------------------- */
var LOW_MILEAGE_LIMIT = 20000;

var SEAT_COLORS = {
  black: { label: "블랙 시트",   hex: "#111111" },
  beige: { label: "베이지 시트", hex: "#E8DCC4" },
  gray:  { label: "그레이 시트", hex: "#9CA3AF" },
  brown: { label: "브라운 시트", hex: "#6B4423" },
  white: { label: "화이트 시트", hex: "#F5F5F5" },
  red:   { label: "레드 시트",   hex: "#8B1A1A" }
};

function buildBadges(car, max) {
  max = max || 3;
  var pool = [];
  var h = car.history;

  if (car.mileage <= LOW_MILEAGE_LIMIT)
    pool.push({ tier: "A", key: "lowMileage", label: "짧은 주행거리" });

  if (car.seatColor && SEAT_COLORS[car.seatColor])
    pool.push({
      tier: "D", key: "seat",
      label: SEAT_COLORS[car.seatColor].label,
      dot: SEAT_COLORS[car.seatColor].hex
    });

  if (h.owners === 1)
    pool.push({ tier: "C", key: "oneOwner", label: "1인 신조" });

  if (h.accidentFree)  pool.push({ tier: "B", key: "accidentFree", label: "무사고" });
  if (h.insuranceFree) pool.push({ tier: "B", key: "noInsurance",  label: "보험 이력 없음" });
  if (h.floodFree)     pool.push({ tier: "B", key: "noFlood",      label: "침수 이력 없음" });

  return pool.slice(0, max);
}

/* 상세페이지 이력 아이콘 6종 (표시 여부만 판단) */
function buildHistoryIcons(car) {
  var h = car.history;
  return [
    { key: "accidentFree",      label: "무사고",        on: h.accidentFree },
    { key: "floodFree",         label: "침수 이력 없음", on: h.floodFree },
    { key: "mileageNormal",     label: "주행거리 정상",  on: h.mileageNormal },
    { key: "insuranceFree",     label: "보험이력 없음",  on: h.insuranceFree },
    { key: "commercialUseFree", label: "용도 이력 없음", on: h.commercialUseFree },
    { key: "oneOwner",          label: "1인신조",       on: h.owners === 1 }
  ];
}

/* ---------------------------------------------------------
   7. 표시용 포맷
   --------------------------------------------------------- */
function formatTitle(car) {
  return car.modelName + " " + car.trim;
}

function formatSpec(car) {
  var p = car.regDate.split("-");
  return p[0].slice(2) + "/" + p[1] + "년식 "
       + "(" + String(car.modelYear).slice(2) + "년형) "
       + car.mileage.toLocaleString() + "km "
       + car.region;
}

function formatPrice(car) {
  return car.price.toLocaleString();
}

/* 월 납입금: 단순 분할 (이자 미반영). 실제 조건 확정 시 이 함수만 수정 */
function formatMonthly(car) {
  var won = Math.round(car.price * 10000 / car.installmentMonths / 10000) * 10000;
  return won.toLocaleString();
}

/* ---------------------------------------------------------
   8. 찜하기 (localStorage)
   --------------------------------------------------------- */
var LIKE_KEY = "verocar_likes";

function getLikes() {
  try { return JSON.parse(localStorage.getItem(LIKE_KEY)) || []; }
  catch (e) { return []; }
}

function isLiked(id) {
  return getLikes().indexOf(id) > -1;
}

function toggleLike(id) {
  var likes = getLikes();
  var i = likes.indexOf(id);
  if (i > -1) likes.splice(i, 1);
  else likes.push(id);
  localStorage.setItem(LIKE_KEY, JSON.stringify(likes));
  return i === -1;
}

/* ---------------------------------------------------------
   9. 최근 본 차량 (최대 5대)
   --------------------------------------------------------- */
var RECENT_KEY = "verocar_recent";
var RECENT_MAX = 5;

function getRecent() {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY)) || []; }
  catch (e) { return []; }
}

function addRecent(id) {
  var list = getRecent().filter(function (x) { return x !== id; });
  list.unshift(id);
  localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, RECENT_MAX)));
}
