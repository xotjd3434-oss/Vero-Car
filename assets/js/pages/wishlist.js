// ========================================
// VERO CAR - 관심목록
// ========================================


// =====================================================
// 1. HTML 요소 가져오기
// =====================================================

const wishlistBtns = document.querySelectorAll(".wishlistbtn");
const wishlistBtnArea = document.getElementById("wishlistBtnArea");

const savedArea = document.getElementById("SavedArea");
const recentArea = document.getElementById("RecentArea");
const compareArea = document.getElementById("CompareArea");

const modal = document.getElementById("carSelectModal");
const modalClose = document.querySelector(".modal-close");
const modalCompareBtn = document.querySelector(".modal-compare-btn");


// =====================================================
// 2. 데이터 저장 변수
// =====================================================

// 전체 차량
let allCars = [];

// 최근 본 차량
let recentCars = [];

// 관심 차량 id
let savedIds = [1, 2, 3, 54, 88, 70];

// 현재 비교 중인 차량
let compareCars = [];

// 자동 스크롤 중인지 확인
let isAutoScrolling = false;


// =====================================================
// 3. 처음 화면
// =====================================================

savedArea.style.display = "block";
recentArea.style.display = "block";
compareArea.style.display = "none";


// =====================================================
// 4. 상단 메뉴 버튼
// =====================================================

wishlistBtns.forEach(function (btn, index) {

    btn.addEventListener("click", function () {

        // 모든 버튼 active 제거
        wishlistBtns.forEach(function (button) {
            button.classList.remove("active");
        });

        // 클릭한 버튼 active
        btn.classList.add("active");


        // 남색 배경 이동
        wishlistBtnArea.style.setProperty(
            "--slider-x",
            `${index * 100}%`
        );


        const target = btn.dataset.target;


        // -----------------------------------------
        // 관심 차량
        // -----------------------------------------

        if (target === "saved") {

            savedArea.style.display = "block";
            recentArea.style.display = "block";
            compareArea.style.display = "none";

            isAutoScrolling = true;

            smoothScrollTo(savedArea, 1400);

            setTimeout(function () {
                isAutoScrolling = false;
            }, 1450);
        }


        // -----------------------------------------
        // 최근 본 차량
        // -----------------------------------------

        if (target === "recent") {

            savedArea.style.display = "block";
            recentArea.style.display = "block";
            compareArea.style.display = "none";

            isAutoScrolling = true;

            smoothScrollTo(recentArea, 1400);

            setTimeout(function () {
                isAutoScrolling = false;
            }, 1450);
        }


        // -----------------------------------------
        // 비교하기
        // -----------------------------------------

        if (target === "compare") {

            savedArea.style.display = "none";
            recentArea.style.display = "none";

            compareArea.style.display = "block";

            // 비교하기는 스크롤 이동 없음
        }

    });

});


// =====================================================
// 5. 부드러운 스크롤 함수
// =====================================================

function smoothScrollTo(target, duration = 1200) {

    const start = window.scrollY;

    const targetY =
        target.getBoundingClientRect().top +
        window.scrollY;

    const distance = targetY - start;

    const startTime = performance.now();


    function animation(currentTime) {

        const elapsed = currentTime - startTime;

        const progress =
            Math.min(elapsed / duration, 1);


        const ease =
            progress < 0.5
                ? 2 * progress * progress
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;


        window.scrollTo(
            0,
            start + distance * ease
        );


        if (progress < 1) {
            requestAnimationFrame(animation);
        }

    }


    requestAnimationFrame(animation);
}


// =====================================================
// 6. 스크롤 위치에 따라 상단 버튼 변경
// =====================================================

window.addEventListener("scroll", function () {

    // 자동 스크롤 중이면 실행하지 않음
    if (isAutoScrolling) {
        return;
    }

    // 비교하기 화면이면 실행하지 않음
    if (compareArea.style.display === "block") {
        return;
    }


    const recentTop =
        recentArea.getBoundingClientRect().top;


    // 최근 본 차량 영역
    if (recentTop <= 250) {

        wishlistBtns.forEach(function (button) {
            button.classList.remove("active");
        });

        wishlistBtns[1].classList.add("active");

        wishlistBtnArea.style.setProperty(
            "--slider-x",
            "100%"
        );

    }

    // 관심 차량 영역
    else {

        wishlistBtns.forEach(function (button) {
            button.classList.remove("active");
        });

        wishlistBtns[0].classList.add("active");

        wishlistBtnArea.style.setProperty(
            "--slider-x",
            "0%"
        );

    }

});


// =====================================================
// 7. 차량 데이터 가져오기
// =====================================================

fetch("../../assets/data/cars-100.json")

    .then(function (response) {

        if (!response.ok) {

            throw new Error(
                `HTTP 오류: ${response.status}`
            );

        }

        return response.json();

    })

    .then(function (cars) {

        allCars = cars;


        // -----------------------------------------
        // 최근 본 차량
        // -----------------------------------------

        const recentIds =
            [54, 88, 72, 21, 55, 100];

        recentCars = allCars.filter(function (car) {

            return recentIds.includes(car.id);

        });


        // -----------------------------------------
        // 관심 차량
        // -----------------------------------------

        renderSavedCars();


        // -----------------------------------------
        // 최근 본 차량
        // -----------------------------------------

        renderRecentCars();


        // -----------------------------------------
        // 비교 모달
        // -----------------------------------------

        renderModalRecentCars();


        // -----------------------------------------
        // 비교 화면
        // 처음에는 3칸 전부 빈 상태
        // -----------------------------------------

        renderCompareCars();

    })

    .catch(function (error) {

        console.log(
            "차량 데이터 불러오기 실패:",
            error
        );

    });


// =====================================================
// 8. 관심 / 최근 차량 카드 HTML 만들기
// =====================================================

function createCarCard(car) {

    const isSaved =
        savedIds.includes(car.id);


    const detail = [

        `${String(car.modelYear).slice(2)}년식`,

        `${car.mileage.toLocaleString()}km`,

        car.region

    ]
        .filter(Boolean)
        .join(" / ");


    return `
        <div
            class="car-card"
            data-id="${car.id}"
        >

            <img
                src="${car.thumbnail}"
                alt="${car.modelName}"
                class="car-img"
            >


            <div class="car-text">

                <div class="car-name-row">

                    <h4 class="car-name">
                        ${car.modelName}
                    </h4>


                    <button
                        type="button"
                        class="heart-btn ${isSaved ? "active" : ""}"
                        data-id="${car.id}"
                    >

                        <img
                            src="${isSaved
            ? "../../assets/img/wishlist-img/heart-on.png"
            : "../../assets/img/wishlist-img/heart-off.png"
        }"
                            alt="관심 차량"
                        >

                    </button>

                </div>


                <p class="car-detail">
                    ${detail}
                </p>


                <p class="car-price">

                    <span class="price-number">
                        ${car.price.toLocaleString()}
                    </span>

                    <span class="price-unit">
                        만원
                    </span>

                </p>

            </div>

        </div>
    `;
}


// =====================================================
// 9. 관심 차량 출력
// =====================================================

function renderSavedCars() {

    const savedCards =
        document.getElementById("SavedCards");


    const savedCars =
        allCars.filter(function (car) {

            return savedIds.includes(car.id);

        });


    savedCards.innerHTML =
        savedCars
            .map(function (car) {

                return createCarCard(car);

            })
            .join("");
}


// =====================================================
// 10. 최근 본 차량 출력
// =====================================================

function renderRecentCars() {

    const recentCards =
        document.getElementById("RecentCards");


    recentCards.innerHTML =
        recentCars
            .map(function (car) {

                return createCarCard(car);

            })
            .join("");
}


// =====================================================
// 11. 하트 클릭
// 관심 등록 / 취소
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const heartBtn =
            event.target.closest(".heart-btn");


        if (!heartBtn) {
            return;
        }


        const carId =
            Number(heartBtn.dataset.id);


        const isSaved =
            savedIds.includes(carId);


        // -----------------------------------------
        // 이미 관심 차량
        // → 관심 취소
        // -----------------------------------------

        if (isSaved) {

            savedIds =
                savedIds.filter(function (id) {

                    return id !== carId;

                });

        }

        // -----------------------------------------
        // 관심 차량 아님
        // → 관심 등록
        // -----------------------------------------

        else {

            savedIds.push(carId);

        }


        // 두 영역 다시 그리기
        renderSavedCars();
        renderRecentCars();

    }
);


// =====================================================
// 12. 비교하기 모달 최근 본 차량 출력
// =====================================================

function renderModalRecentCars() {

    const modalRecentList =
        document.querySelector(
            ".modal-recent-car-list"
        );


    modalRecentList.innerHTML =
        recentCars
            .map(function (car) {

                const isCompared =
                    compareCars.some(
                        function (compareCar) {

                            return (
                                compareCar.id === car.id
                            );

                        }
                    );


                return `
                    <label class="modal-car-card">

                        <input
                            type="checkbox"
                            class="compare-check"
                            value="${car.id}"
                            ${isCompared ? "checked" : ""}
                        >


                        <div class="modal-car-image">

                            <img
                                src="${car.thumbnail}"
                                alt="${car.modelName}"
                            >

                        </div>


                        <div class="modal-car-info">

                            <h4>
                                ${car.modelName}
                            </h4>


                            <p>
                                ${String(car.modelYear).slice(2)}년식 /
                                ${car.mileage.toLocaleString()}km /
                                ${car.region || ""}
                            </p>


                            <div class="modal-car-price">

                                <strong>
                                    ${car.price.toLocaleString()}
                                </strong>

                                <span>
                                    만원
                                </span>

                            </div>

                        </div>

                    </label>
                `;

            })
            .join("");
}


// =====================================================
// 13. + 등록 버튼 클릭
// 새로 만들어진 + 버튼도 전부 작동
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const addBtn =
            event.target.closest(".add-car");


        if (!addBtn) {
            return;
        }


        // 모달을 열 때마다
        // 현재 비교 중인 차량 체크 상태 다시 표시
        renderModalRecentCars();


        modal.classList.add("active");

    }
);


// =====================================================
// 14. 모달 X 닫기
// =====================================================

if (modalClose) {

    modalClose.addEventListener(
        "click",
        function () {

            modal.classList.remove("active");

        }
    );

}


// =====================================================
// 15. 모달 바깥 클릭 닫기
// =====================================================

if (modal) {

    modal.addEventListener(
        "click",
        function (event) {

            if (event.target === modal) {

                modal.classList.remove("active");

            }

        }
    );

}


// =====================================================
// 16. ESC로 모달 닫기
// =====================================================

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            modal.classList.remove("active");

        }

    }
);


// =====================================================
// 17. 비교 차량 최대 3대 선택
// =====================================================

document.addEventListener(
    "change",
    function (event) {

        if (
            !event.target.classList.contains(
                "compare-check"
            )
        ) {
            return;
        }


        const checked =
            document.querySelectorAll(
                ".compare-check:checked"
            );


        if (checked.length > 3) {

            event.target.checked = false;

            alert(
                "비교 차량은 최대 3대까지 선택할 수 있습니다."
            );

        }

    }
);


// =====================================================
// 18. 모달 - 선택한 차량 비교하기
// =====================================================

modalCompareBtn.addEventListener(
    "click",
    function () {

        const checked =
            document.querySelectorAll(
                ".compare-check:checked"
            );


        if (checked.length === 0) {

            alert(
                "비교할 차량을 선택해주세요."
            );

            return;
        }


        if (checked.length > 3) {

            alert(
                "비교 차량은 최대 3대까지 선택할 수 있습니다."
            );

            return;
        }


        const selectedIds =
            Array.from(checked)
                .map(function (checkbox) {

                    return Number(
                        checkbox.value
                    );

                });


        // 현재 비교 차량 저장
        compareCars =
            recentCars.filter(function (car) {

                return selectedIds.includes(
                    car.id
                );

            });


        // 비교 영역 다시 출력
        renderCompareCars();


        // 모달 닫기
        modal.classList.remove("active");

    }
);


// =====================================================
// 19. 비교 차량 출력
// =====================================================

function renderCompareCars() {

    const compareSlots =
        document.querySelectorAll(
            ".compare-car"
        );


    compareSlots.forEach(
        function (slot, index) {

            const car =
                compareCars[index];


            // ======================================
            // 빈 자리
            // ======================================

            if (!car) {

                slot.classList.remove(
                    "has-car"
                );


                slot.innerHTML = `
                    <div class="empty-compare">

                        <button
                            type="button"
                            class="add-car"
                        >

                            <span>

                                <img
                                    src="../../assets/img/wishlist-img/plus.png"
                                    alt=""
                                >

                            </span>


                            <p>
                                비교할 차량을<br>
                                등록해주세요.
                            </p>

                        </button>

                    </div>
                `;


                return;
            }


            // ======================================
            // 차량 있는 자리
            // ======================================

            slot.classList.add(
                "has-car"
            );


            slot.innerHTML = `

                <div class="compare-image">


                    <button
                        type="button"
                        class="delete-car"
                        data-id="${car.id}"
                    >

                        <img
                            src="../../assets/img/wishlist-img/X.png"
                            alt="삭제"
                        >

                    </button>


                    <img
                        src="${car.thumbnail}"
                        alt="${car.modelName}"
                    >

                </div>


                <div class="car-info">


                    <div class="info-row">

                        <span class="info-title">
                            차량명
                        </span>

                        <span class="info-value">
                            ${car.modelName}
                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            차종
                        </span>

                        <span class="info-value">
                            ${car.bodyType || "-"}
                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            가격
                        </span>

                        <span class="info-value">
                            ${car.price.toLocaleString()}만원
                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            연식
                        </span>

                        <span class="info-value">
                            ${car.modelYear}년
                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            주행거리
                        </span>

                        <span class="info-value">
                            ${car.mileage.toLocaleString()}km
                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            연료/배기량
                        </span>

                        <span class="info-value">

                            ${car.fuel || "-"}

                            ${car.displacement
                    ? " / " +
                    car.displacement.toLocaleString() +
                    "cc"
                    : ""
                }

                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            색상
                        </span>

                        <span class="info-value">
                            ${car.exteriorColor ||
                car.color ||
                "-"
                }
                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            사고유무
                        </span>

                        <span class="info-value">

                            ${car.accidentFree === true
                    ? "무사고"
                    : car.accidentFree === false
                        ? "사고이력 있음"
                        : "-"
                }

                        </span>

                    </div>


                    <div class="info-row">

                        <span class="info-title">
                            판매위치
                        </span>

                        <span class="info-value">
                            ${car.region || "-"}
                        </span>

                    </div>

                </div>


                <div class="option-area">


                    <div class="option-tabs">

                        <button
                            type="button"
                            class="active"
                        >
                            외관
                        </button>

                        <button type="button">
                            내장
                        </button>

                        <button type="button">
                            안전
                        </button>

                        <button type="button">
                            편의
                        </button>

                    </div>


                    <ul class="option-list">

                        ${createCompareOptions(car)}

                    </ul>


                </div>
            `;

        }
    );

}


// =====================================================
// 20. 비교 차량 X 버튼 삭제
// =====================================================

document.addEventListener(
    "click",
    function (event) {

        const deleteBtn =
            event.target.closest(
                ".delete-car"
            );


        if (!deleteBtn) {
            return;
        }


        const carId =
            Number(
                deleteBtn.dataset.id
            );


        // 선택 차량 제거
        compareCars =
            compareCars.filter(
                function (car) {

                    return (
                        car.id !== carId
                    );

                }
            );


        // 화면 다시 그리기
        renderCompareCars();

    }
);


// =====================================================
// 21. 비교 차량 외관 옵션
// =====================================================

function createCompareOptions(car) {

    const exteriorOptions = [

        {
            name: "LED 헤드 라이트",
            aliases: [
                "LED 헤드 라이트",
                "LED헤드라이트"
            ]
        },

        {
            name: "HID 헤드 라이트",
            aliases: [
                "HID 헤드 라이트",
                "HID헤드라이트"
            ]
        },

        {
            name: "전동접이사이드미러",
            aliases: [
                "전동접이사이드미러",
                "전동접이 사이드미러"
            ]
        },

        {
            name: "어댑티브 헤드램프",
            aliases: [
                "어댑티브 헤드램프"
            ]
        },

        {
            name: "선루프",
            aliases: [
                "선루프"
            ]
        },

        {
            name: "루프랙",
            aliases: [
                "루프랙"
            ]
        },

        {
            name: "알루미늄 휠",
            aliases: [
                "알루미늄 휠",
                "알루미늄휠"
            ]
        }

    ];


    return exteriorOptions
        .map(function (option) {

            const hasOption =
                Array.isArray(car.options) &&
                option.aliases.some(
                    function (alias) {

                        return car.options.includes(
                            alias
                        );

                    }
                );


            return `
                <li class="${hasOption ? "has-option" : ""}">


                    <img
                        src="../../assets/img/wishlist-img/CheckCircle.png"
                        class="check active"
                        alt=""
                    >


                    <img
                        src="../../assets/img/wishlist-img/CheckCircle회색.png"
                        class="check disabled"
                        alt=""
                    >


                    <div class="option-name">
                        ${option.name}
                    </div>


                </li>
            `;

        })
        .join("");

}