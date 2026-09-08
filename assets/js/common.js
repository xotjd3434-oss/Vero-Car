console.log('common.js 연결 성공');

// footer
fetch('../../components/footer.html')
    .then((response) => {
        console.log('footer 응답:', response);

        if (!response.ok) {
            throw new Error('footer를 불러오지 못했습니다.');
        }

        return response.text();
    })
    .then((data) => {
        console.log('footer 내용:', data);

        const footer = document.querySelector('#footer');

        if (footer) {
            footer.innerHTML = data;
        }
    })
    .catch((error) => {
        console.error('footer 불러오기 실패:', error);
    });



let mainData = [];

// JSON 데이터 가져오기
async function loadMainData() {
    try {
        const response = await fetch("../../assets/data/data.json");

        // 데이터를 정상적으로 가져오지 못한 경우
        if (!response.ok) {
            throw new Error("데이터를 불러오지 못했습니다.");
        }

        const data = await response.json();

        mainData = data;
    } catch (error) {
        console.error(error);
    }
}

//=====================quick-menu=====================

const topButton = document.querySelector('.quick-top');

if (topButton) {
    topButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

//=====================//quick-menu=====================


//===================== mobile menu =====================

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuDim = document.querySelector('.mobile-menu-dim');
const mobileMenuImg = document.querySelector('.mobile-menu-btn img');

if (mobileMenuBtn && mobileMenu && mobileMenuDim && mobileMenuImg) {
    const menuImg = '../../assets/img/header-img/List-m.png';
    const closeImg = '../../assets/img/header-img/X-m.png';

    function openMobileMenu() {
        mobileMenu.classList.add('open');
        mobileMenuDim.classList.add('open');

        mobileMenuImg.src = closeImg;

        mobileMenuBtn.setAttribute('aria-label', '메뉴 닫기');
        mobileMenuBtn.setAttribute('aria-expanded', 'true');

        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        mobileMenuDim.classList.remove('open');

        mobileMenuImg.src = menuImg;

        mobileMenuBtn.setAttribute('aria-label', '메뉴 열기');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');

        document.body.style.overflow = '';
    }

    mobileMenuBtn.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    mobileMenuDim.addEventListener('click', () => {
        closeMobileMenu();
    });
}