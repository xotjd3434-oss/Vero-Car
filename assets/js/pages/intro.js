/* ==================================================
   VERO CAR INTRO
================================================== */
(function () {
  'use strict';

  function initIntro() {
    /* ==================================================
       COMMON
    ================================================== */
    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function easeOutCubic(value) {
      return 1 - Math.pow(1 - value, 3);
    }

    function easeInOutCubic(value) {
      return value < 0.5
        ? 4 * value * value * value
        : 1 - Math.pow(-2 * value + 2, 3) / 2;
    }

    /* ==================================================
       01. HERO VIDEO SOUND
    ================================================== */
    const heroVideo = document.querySelector('.hero-video');
    const soundBtn = document.querySelector('.sound-btn');

    if (heroVideo && soundBtn) {
      function updateSoundButton() {
        const soundOn = !heroVideo.muted;

        soundBtn.classList.toggle('is-sound-on', soundOn);
        soundBtn.setAttribute(
          'aria-label',
          soundOn ? '소리 끄기' : '소리 켜기'
        );
      }

      soundBtn.addEventListener('click', function () {
        heroVideo.muted = !heroVideo.muted;
        updateSoundButton();
      });

      heroVideo.addEventListener('volumechange', updateSoundButton);
      updateSoundButton();
    }

    /* ==================================================
   02. SLOGAN
================================================== */
    const sloganSection = document.querySelector('.slogan-section');
    const sloganSticky = document.querySelector('.slogan-sticky');
    const sloganScene = document.querySelector('.slogan-scene');
    const sloganContent = document.querySelector('.slogan-content');
    const motionPreference = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    );

    function updateSlogan() {
      if (
        !sloganSection ||
        !sloganSticky ||
        !sloganScene ||
        !sloganContent
      ) return;

      const rect = sloganSection.getBoundingClientRect();
      const scrollRange =
        sloganSection.offsetHeight - sloganSticky.offsetHeight;

      const progress = scrollRange > 0
        ? clamp(-rect.top / scrollRange, 0, 1)
        : 0;

      /* 시작과 끝을 완만하게 연결 */
      const eased = progress * progress * (3 - 2 * progress);
      const reduceMotion = motionPreference.matches;

      const scale = reduceMotion ? 1 : 1 + eased * 2;
      const moveX = reduceMotion ? 0 : eased * -1.5;
      const moveY = reduceMotion ? 0 : eased * -20;
      const textMove = reduceMotion ? 0 : eased * 25;

      /* 초반에는 문구 유지, 확대되면서 서서히 사라짐 */
      const textProgress = clamp((progress - 0.05) / 0.35, 0, 1);
      const textEase =
        textProgress * textProgress * (3 - 2 * textProgress);

      sloganScene.style.transform =
        `translate3d(${moveX}vw, ${moveY}vh, 0) scale(${scale})`;

      sloganContent.style.opacity = String(1 - textEase);
      sloganContent.style.transform =
        `translate(-50%, calc(-63% - ${textMove}px))`;
    }

    /* ==================================================
       03. STORY LIGHT
    ================================================== */
    const storySection = document.querySelector('.story-section');
    const storyPaths = document.querySelectorAll('.story-path');
    const storyItems = document.querySelectorAll('.story-item');
    const storyResult = document.querySelector('.story-result');

    const pathData = Array.from(storyPaths, function (path) {
      const length = path.getTotalLength();

      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;

      return { path, length };
    });

    function updateStory() {
      if (!storySection || !pathData.length) return;

      const firstPath = pathData[0];
      const svg = firstPath.path.ownerSVGElement;

      if (!svg || firstPath.length <= 0) return;

      const svgRect = svg.getBoundingClientRect();
      const viewBox = svg.viewBox.baseVal;

      if (svgRect.height <= 0 || viewBox.height <= 0) return;

      /* 선 끝이 따라갈 화면 위치: 위에서 60% */
      const focusY = window.innerHeight * 0.60;

      /* 화면 좌표를 SVG 내부 좌표로 변환 */
      const targetY =
        viewBox.y +
        ((focusY - svgRect.top) / svgRect.height) * viewBox.height;

      const startPoint = firstPath.path.getPointAtLength(0);
      const endPoint = firstPath.path.getPointAtLength(firstPath.length);

      let drawLength = 0;

      if (targetY >= endPoint.y) {
        drawLength = firstPath.length;
      } else if (targetY > startPoint.y) {
        /*
          현재 곡선은 위에서 아래로 이어지므로
          목표 높이에 해당하는 선의 길이를 찾음
        */
        let low = 0;
        let high = firstPath.length;

        for (let i = 0; i < 18; i++) {
          const middle = (low + high) / 2;
          const point = firstPath.path.getPointAtLength(middle);

          if (point.y < targetY) {
            low = middle;
          } else {
            high = middle;
          }
        }

        drawLength = (low + high) / 2;
      }

      /* 모든 빛 레이어를 같은 위치까지 그림 */
      const progress = drawLength / firstPath.length;

      pathData.forEach(function (item) {
        item.path.style.strokeDashoffset =
          item.length * (1 - progress);
      });

      /* 실제 선 끝의 화면 위치 */
      const tip = firstPath.path.getPointAtLength(drawLength);
      const lineTipTop =
        svgRect.top +
        ((tip.y - viewBox.y) / viewBox.height) * svgRect.height;

      /* 선이 문구에 도착하면 표시, 되감기면 숨김 */
      storyItems.forEach(function (item) {
        if (!item.offsetParent) return;

        const parentTop =
          item.offsetParent.getBoundingClientRect().top;

        const itemTop = parentTop + item.offsetTop;

        item.classList.toggle(
          'active',
          drawLength > 0 && lineTipTop >= itemTop + 20
        );
      });
    }

    /* ==================================================
03. RESULT
화면에 다시 들어올 때마다 문구 + 숫자 재생
================================================== */
    const resultNumbers = document.querySelectorAll(
      '.story-result .count-number'
    );

    let resultFrame = null;
    let resultPlaying = false;

    function resetResult() {
      if (resultFrame !== null) {
        cancelAnimationFrame(resultFrame);
        resultFrame = null;
      }

      resultPlaying = false;
      storyResult.classList.remove('active');

      resultNumbers.forEach(function (element) {
        element.textContent = '0';
      });
    }

    function playResult() {
      if (resultPlaying) return;
      resultPlaying = true;

      storyResult.classList.add('active');

      const duration = 1600;
      let startTime = null;

      function animate(time) {
        if (startTime === null) startTime = time;

        const progress = clamp(
          (time - startTime) / duration,
          0,
          1
        );

        const eased = easeOutCubic(progress);

        resultNumbers.forEach(function (element) {
          const target = Number(element.dataset.target);

          if (!Number.isFinite(target)) return;

          element.textContent =
            Math.floor(target * eased).toLocaleString('ko-KR');
        });

        if (progress < 1) {
          resultFrame = requestAnimationFrame(animate);
        } else {
          resultFrame = null;
        }
      }

      resultFrame = requestAnimationFrame(animate);
    }

    if (storyResult) {
      const resultObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            playResult();
          } else {
            resetResult();
          }
        });
      }, {
        threshold: 0
      });

      resultObserver.observe(storyResult);
    }

    /* ==================================================
       04. THE VERO WAY
    ================================================== */
    const whySection = document.querySelector('.intro-why-section');

    function updateWhySection() {
      if (!whySection) return;

      const rect = whySection.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      /* 섹션이 화면에서 완전히 벗어나면 애니메이션 초기화 */
      if (rect.bottom <= 0 || rect.top >= windowHeight) {
        whySection.classList.remove('is-active');
        return;
      }

      /* 위·아래 어느 방향으로 들어오든 충분히 보이면 실행 */
      const visibleHeight =
        Math.min(rect.bottom, windowHeight) - Math.max(rect.top, 0);

      if (visibleHeight >= windowHeight * 0.3) {
        whySection.classList.add('is-active');
      }
    }

    /* ==================================================
       06. DRIVE SLIDER
    ================================================== */
    const driveSlider = document.querySelector('.drive-slider');
    const driveNext = document.querySelector('.drive-next');
    const drivePrev = document.querySelector('.drive-prev');

    if (driveSlider && driveNext && drivePrev) {
      let driveLocked = false;

      function moveDrive(direction, count = 1) {
        if (driveLocked) return;
        if (driveSlider.children.length < 2) return;

        driveLocked = true;

        for (let i = 0; i < count; i++) {
          if (direction === 'next') {
            driveSlider.append(driveSlider.firstElementChild);
          } else {
            driveSlider.prepend(driveSlider.lastElementChild);
          }
        }

        window.setTimeout(function () {
          driveLocked = false;
        }, 800);
      }

      driveNext.addEventListener('click', function () {
        moveDrive('next');
      });

      drivePrev.addEventListener('click', function () {
        moveDrive('prev');
      });

      driveSlider.addEventListener('click', function (event) {
        const card = event.target.closest('.drive-item');

        if (!card || !driveSlider.contains(card)) return;

        const items = Array.from(driveSlider.children);
        const index = items.indexOf(card);

        if (index >= 2) {
          moveDrive('next', index - 1);
        }
      });
    }












    /* ==================================================
     07. ENDING
     첫 사진 후퇴 → 두 번째 사진 등장
  ================================================== */
    const endingSection = document.querySelector('.ending-section');
    const endingSticky = document.querySelector('.ending-sticky');
    const endingCard01 = document.querySelector('.ending-card-01');
    const endingCard02 = document.querySelector('.ending-card-02');
    const endingMessage = document.querySelector('.ending-message');
    const endingBrand = document.querySelector('.ending-brand');

    function endingEase(value) {
      return value * value * (3 - 2 * value);
    }

    function updateEnding() {
      if (
        !endingSection ||
        !endingSticky ||
        !endingCard01 ||
        !endingCard02
      ) {
        return;
      }

      const rect = endingSection.getBoundingClientRect();
      const scrollRange =
        endingSection.offsetHeight - endingSticky.offsetHeight;

      const progress = scrollRange > 0
        ? clamp(-rect.top / scrollRange, 0, 1)
        : 0;

      /*
        0~12%   : 첫 번째 사진 유지
        12~58%  : 첫 번째 사진이 뒤로 멀어짐
        40~82%  : 두 번째 사진이 앞에 나타남
        58~82%  : 뒤쪽 첫 번째 사진 사라짐
        82~100% : 마지막 화면 유지
      */

      const retreat = endingEase(
        clamp((progress - 0.12) / 0.46, 0, 1)
      );

      const enter = endingEase(
        clamp((progress - 0.40) / 0.42, 0, 1)
      );

      const firstFade = endingEase(
        clamp((progress - 0.58) / 0.24, 0, 1)
      );

      /* 첫 번째 사진: 중앙에서 뒤로 후퇴 */
      endingCard01.style.transform =
        `translate(-50%, -50%) translateZ(${-650 * retreat}px)`;

      endingCard01.style.opacity = 1 - firstFade;
      endingCard01.style.filter =
        `brightness(${1 - retreat * 0.25}) blur(${retreat * 2}px)`;

      /* 첫 번째 문구도 사진과 함께 뒤로 물러남 */
      if (endingMessage) {
        const textFade = endingEase(
          clamp((progress - 0.32) / 0.26, 0, 1)
        );

        endingMessage.style.opacity = 1 - textFade;
        endingMessage.style.transform = 'translate(-50%, -50%)';
      }

      /* 두 번째 사진: 뒤쪽 사진 위로 등장 */
      endingCard02.style.opacity = enter;
      endingCard02.classList.toggle('is-ready', progress >= 0.82);
      endingCard02.inert = progress < 0.82;
      endingCard02.style.transform =
        `translate(-50%, -50%) scale(${0.88 + enter * 0.12})`;

      /* 두 번째 문구: 사진이 나타난 뒤 등장 */
      if (endingBrand) {
        const textEnter = endingEase(
          clamp((progress - 0.62) / 0.20, 0, 1)
        );

        endingBrand.style.opacity = textEnter;
        endingBrand.style.transform =
          `translate(-50%, -50%) scale(${0.96 + textEnter * 0.04})`;
      }
    }





























    /* ==================================================
   HEADER
================================================== */
    const introHeader = document.querySelector('.intro-header');
    const heroSection = document.querySelector('.hero-section');

    let previousScrollY = Math.max(0, window.scrollY);
    let headerVisible = false;

    function setHeaderVisible(visible) {
      if (!introHeader) return;

      headerVisible = visible;
      introHeader.classList.toggle('is-visible', visible);
      introHeader.setAttribute('aria-hidden', String(!visible));
      introHeader.inert = !visible;
    }

    function updateHeader() {
      if (!introHeader || !heroSection) return;

      const currentY = Math.max(0, window.scrollY);

      /* 첫 화면 높이의 60% */
      const showThreshold = heroSection.offsetHeight * 0.6;

      /* 처음 60% 구간에서는 항상 숨김 */
      if (currentY < showThreshold) {
        if (headerVisible) setHeaderVisible(false);
        previousScrollY = currentY;
        return;
      }

      const difference = currentY - previousScrollY;

      /* 작은 움직임으로 헤더가 깜빡이는 현상 방지 */
      if (Math.abs(difference) < 8) return;

      const scrollingUp = difference < 0;

      if (scrollingUp !== headerVisible) {
        setHeaderVisible(scrollingUp);
      }

      previousScrollY = currentY;
    }

    setHeaderVisible(false);

    /* ==================================================
   부드러운 스크롤
================================================== */
    let introLenis = null;
    let sectionMoving = false;
    let wheelQuietUntil = 0;

    if (typeof window.Lenis === 'function') {
      introLenis = new window.Lenis({
        autoRaf: true,
        smoothWheel: true,
        lerp: 0.14,
        wheelMultiplier: 1,
        syncTouch: false,
        anchors: true,
        prevent: (node) => node.classList.contains('mobile-menu'),

        /* 3번의 느린 선 진행은 유지 */
        virtualScroll: function (data) {
          if (!storySection) return;

          const rect = storySection.getBoundingClientRect();
          const focusY = window.innerHeight * 0.6;

          if (rect.top <= focusY && rect.bottom > focusY) {
            data.deltaY *= 0.45;
          }
        }
      });
    }

    function blockWheel(event) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }

    /* 진행 중인 자동 이동 취소 */
    function cancelSectionMove() {
      if (introLenis && sectionMoving) {
        introLenis.stop();
        introLenis.start();
      }

      sectionMoving = false;
      wheelQuietUntil = 0;
    }

    /* 엔딩 전환: 일정한 속도로 진행률 이동 */
    function moveToEnding(targetY) {
      if (!introLenis) return;

      sectionMoving = true;

      introLenis.scrollTo(targetY, {
        duration: 2.8,
        lerp: 0,
        easing: (value) => value,
        lock: true,
        immediate: motionPreference.matches,
        onComplete: function () {
          sectionMoving = false;

          /* 대기 시간을 추가 입력으로 연장하지 않음 */
          wheelQuietUntil = performance.now() + 160;
          requestUpdate();
        }
      });
    }

    /* ==================================================
       휠 제어: 마지막 엔딩에만 적용
    ================================================== */
    window.addEventListener('wheel', function (event) {
      if (!introLenis || event.defaultPrevented) return;

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.deltaY === 0 ||
        Math.abs(event.deltaX) > Math.abs(event.deltaY)
      ) return;

      if (
        event.target instanceof Element &&
        event.target.closest(
          '.mobile-menu, [data-lenis-prevent], ' +
          '[data-lenis-prevent-wheel], textarea, select, ' +
          '[contenteditable="true"]'
        )
      ) return;

      /* 위로 올리면 잠금부터 취소하고 입력을 통과시킴 */
      if (event.deltaY < 0) {
        cancelSectionMove();
        return;
      }

      /* 아래 방향 중복 입력만 차단 */
      if (
        sectionMoving ||
        performance.now() < wheelQuietUntil
      ) {
        blockWheel(event);
        return;
      }

      /*
        2번은 강제 단계 이동 없이 일반 스크롤 사용.
        CSS에서 확대 구간을 짧게 설정.
      */

      if (!endingSection || !endingSticky) return;

      const currentY = window.scrollY;
      const startY =
        currentY + endingSection.getBoundingClientRect().top;
      const range =
        endingSection.offsetHeight - endingSticky.offsetHeight;

      /* 첫 엔딩 카드 구간에서 아래로 한 번 굴리면 전환 */
      if (
        range > 0 &&
        currentY >= startY - 2 &&
        currentY < startY + range * 0.82 - 2
      ) {
        blockWheel(event);
        moveToEnding(startY + range * 0.86);
      }
    }, { passive: false, capture: true });

    /* 화면 크기가 바뀌면 이전 위치로 향하던 이동 취소 */
    window.addEventListener('resize', cancelSectionMove);

    /* ==================================================
       공통 스크롤 / 리사이즈 / 초기 실행
    ================================================== */
    let scrollTicking = false;

    function updateAll() {
      updateHeader();
      updateSlogan();

      /* 화면 밖에서는 복잡한 SVG 선 계산 생략 */
      if (storySection) {
        const rect = storySection.getBoundingClientRect();

        if (rect.bottom >= 0 && rect.top <= window.innerHeight) {
          updateStory();
        }
      }

      updateWhySection();
      updateEnding();
    }

    function requestUpdate() {
      if (scrollTicking) return;
      scrollTicking = true;

      requestAnimationFrame(function () {
        scrollTicking = false;
        updateAll();
      });
    }

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate);
    window.addEventListener('load', requestUpdate);
    window.addEventListener('pageshow', requestUpdate);
    motionPreference.addEventListener('change', requestUpdate);

    updateAll();
  } // initIntro 함수 끝

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initIntro, { once: true });
  } else {
    initIntro();
  }
})(); 