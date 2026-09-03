// ========================================
// VERO CAR - 관심목록
// ========================================


// ----------------------------------------
// 요소 가져오기
// ----------------------------------------

const wishlistBtns = document.querySelectorAll(".wishlistbtn");

const savedArea = document.getElementById("SavedArea");
const recentArea = document.getElementById("RecentArea");
const compareArea = document.getElementById("CompareArea");

const modal = document.getElementById("carSelectModal");
const modalClose = document.querySelector(".modal-close");

const addCarButtons = document.querySelectorAll(".add-car");


// ----------------------------------------
// 처음 화면
// 찜한 차량 + 최근 본 차량 같이 표시
// 비교하기는 숨김
// ----------------------------------------

savedArea.style.display = "block";
recentArea.style.display = "block";
compareArea.style.display = "none";


// ----------------------------------------
// 상단 버튼
// ----------------------------------------

wishlistBtns.forEach(function (btn) {

    btn.addEventListener("click", function () {

        const target = btn.dataset.target;


        // ----------------------------
        // 버튼 active
        // ----------------------------

        wishlistBtns.forEach(function (item) {
            item.classList.remove("active");
        });

        btn.classList.add("active");


        // ----------------------------
        // 찜한 차량
        // ----------------------------

        if (target === "saved") {

            // 비교 화면 숨김
            compareArea.style.display = "none";

            // 찜한 차량 + 최근 본 차량 표시
            savedArea.style.display = "block";
            recentArea.style.display = "block";

            return;
        }


        // ----------------------------
        // 최근 본 차량
        // ----------------------------

        if (target === "recent") {

            // 비교 화면 숨김
            compareArea.style.display = "none";

            // 찜한 차량 + 최근 본 차량 표시
            savedArea.style.display = "block";
            recentArea.style.display = "block";

            return;
        }


        // ----------------------------
        // 비교하기
        // ----------------------------

        if (target === "compare") {

            // 기존 관심목록 숨기기
            savedArea.style.display = "none";
            recentArea.style.display = "none";

            // 비교 영역 표시
            compareArea.style.display = "block";

        }

    });

});


// ========================================
// 차량 선택 팝업
// ========================================


// ----------------------------------------
// + 버튼 → 팝업 열기
// ----------------------------------------

addCarButtons.forEach(function (button) {

    button.addEventListener("click", function () {

        modal.classList.add("active");

    });

});


// ----------------------------------------
// X 버튼 → 팝업 닫기
// ----------------------------------------

if (modalClose) {

    modalClose.addEventListener("click", function () {

        modal.classList.remove("active");

    });

}


// ----------------------------------------
// 팝업 바깥쪽 클릭 → 닫기
// ----------------------------------------

if (modal) {

    modal.addEventListener("click", function (event) {

        if (event.target === modal) {

            modal.classList.remove("active");

        }

    });

}


// ----------------------------------------
// ESC → 팝업 닫기
// ----------------------------------------

document.addEventListener("keydown", function (event) {

    if (event.key === "Escape") {

        modal.classList.remove("active");

    }

});