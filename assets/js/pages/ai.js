// ----------------------------------------
// 원형 점수 애니메이션
// ----------------------------------------

const scoreCircles = document.querySelectorAll('.score-circle');

const scoreObserver = new IntersectionObserver((entries) => {

    entries.forEach((entry) => {

        if (entry.isIntersecting) {

            const circle = entry.target;

            // data-score 가져오기
            const score = Number(circle.dataset.score);

            // 움직이는 원
            const progress = circle.querySelector('.score-progress');

            // 가운데 숫자
            const scoreNumber = circle.querySelector('.score-text strong');

            // 원 둘레
            const circumference = 314;

            // 최종 위치 계산
            const offset =
                circumference - (circumference * score / 100);


            // -----------------------------
            // 원 애니메이션
            // -----------------------------
            progress.style.strokeDashoffset = offset;


            // -----------------------------
            // 숫자 카운트업
            // -----------------------------

            let currentScore = 1;

            // 처음에는 1
            scoreNumber.textContent = currentScore;

            const duration = 1800;
            const startTime = performance.now();


            function countUp(currentTime) {

                const elapsed = currentTime - startTime;

                // 0 ~ 1 사이 진행률
                const progressRate =
                    Math.min(elapsed / duration, 1);


                // 1부터 목표 점수까지 증가
                currentScore = Math.floor(
                    1 + (score - 1) * progressRate
                );


                scoreNumber.textContent = currentScore;


                // 아직 애니메이션이 끝나지 않았다면
                if (progressRate < 1) {

                    requestAnimationFrame(countUp);

                } else {

                    // 마지막 숫자 정확하게 맞춤
                    scoreNumber.textContent = score;
                }
            }


            requestAnimationFrame(countUp);


            // 한 번 실행 후 감시 종료
            scoreObserver.unobserve(circle);
        }

    });

}, {
    threshold: 0.4
});


scoreCircles.forEach((circle) => {

    scoreObserver.observe(circle);

});