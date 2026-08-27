console.log('common.js 연결 성공');

// footer
fetch('components/footer.html')
    .then((response) => {
        console.log('footer 응답:', response);

        return response.text();
    })
    .then((data) => {
        console.log('footer 내용:', data);

        document.querySelector('#footer').innerHTML = data;
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

