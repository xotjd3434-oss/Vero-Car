// =====================================================
// 마이페이지 관심 차량
// =====================================================

const mypageCarCards = document.querySelector(".car-cards");

// 관심목록과 동일한 관심 차량 ID
const mypageSavedIds = [1, 2, 3, 54, 88, 70];

fetch("../../assets/data/cars-100.json")
    .then(function (response) {
        if (!response.ok) {
            throw new Error(`HTTP 오류: ${response.status}`);
        }

        return response.json();
    })

    .then(function (cars) {
        const savedCars = cars.filter(function (car) {
            return mypageSavedIds.includes(car.id);
        });

        renderMypageCars(savedCars);
    })

    .catch(function (error) {
        console.log("마이페이지 차량 데이터 불러오기 실패:", error);
    });


// =====================================================
// 관심 차량 출력
// =====================================================

function renderMypageCars(cars) {
    mypageCarCards.innerHTML = cars
        .map(function (car) {

            const detail = [
                `${String(car.modelYear).slice(2)}/${String(car.regDate || "").slice(5, 7)}년식`,
                `${car.mileage.toLocaleString()}km`,
                car.region
            ]
                .filter(Boolean)
                .join(" ");

            return `
                <article class="mypage-car-card" data-id="${car.id}">

                    <div class="mypage-car-image">
                        <img
                            src="${car.thumbnail}"
                            alt="${car.modelName}"
                            class="car-photo"
                        >

                        <button
                            type="button"
                            class="mypage-heart-btn"
                            data-id="${car.id}"
                            aria-label="관심 차량"
                        >
                            <img
                                src="../../assets/img/wishlist-img/heart-on.png"
                                alt=""
                            >
                        </button>
                    </div>

                    <div class="mypage-car-text">

                        <h4 class="mypage-car-name">
                            ${car.modelName}
                        </h4>

                        <p class="mypage-car-detail">
                            ${detail}
                        </p>

                        <p class="mypage-car-price">

                            <strong>
                                ${car.price.toLocaleString()}
                            </strong>

                            <span>
                                만원
                            </span>

                        </p>

                    </div>

                </article>
            `;
        })
        .join("");
}

//=====================================================
// 더보기 클릭 이동
//==================================================== 
const moreBtn = document.querySelector('.list-title-etc');

moreBtn.addEventListener('click', function () {
    window.location.href = '../wishlist/wishlist.html';
});