const filters = document.querySelectorAll('[data-filter]');

filters.forEach(filter => {
    const filterBtn = filter.querySelector('.filter-btn');
    const filterValue = filter.querySelector('.filter-value');
    const filterItems = filter.querySelectorAll('.filter-list button');

    // 필터 버튼 클릭
    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();

        // 다른 필터는 닫기
        filters.forEach(item => {
            if (item !== filter) {
                item.classList.remove('active');
            }
        });

        // 현재 필터 열기/닫기
        filter.classList.toggle('active');
    });

    // 목록 선택
    filterItems.forEach(item => {
        item.addEventListener('click', () => {
            filterValue.textContent = item.textContent;
            filter.classList.remove('active');
        });
    });
});

// 바깥 클릭하면 닫기
document.addEventListener('click', () => {
    filters.forEach(filter => {
        filter.classList.remove('active');
    });
});