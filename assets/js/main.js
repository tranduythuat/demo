// Kích hoạt ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Gọi các hiệu ứng có sẵn
document.addEventListener("DOMContentLoaded", () => {
  const mainSwiper = new Swiper(".main-swiper", {
    spaceBetween: 10,
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
    pagination: {
      el: ".swiper-pagination",
      dynamicBullets: true,
    },
    // thumbs: {
    //   swiper: thumbSwiper,
    // },
    autoplay: {
      delay: 3000, // thời gian giữa các lần chuyển (ms)
      disableOnInteraction: false, // không tắt khi người dùng bấm
    },

    loop: true, // lặp lại ảnh
    effect: "fade", // hiệu ứng chuyển mượt
    fadeEffect: { crossFade: true },
    speed: 1000 // tốc độ chuyển (ms)
  });
  
  gsapFadeIn(".fade-in");
  gsapFadeBlur(".fade-blur");
  gsapFlipIn(".animate-flip");
  gsapFadeRight(".fade-right");
  gsapFadeLeft(".fade-left");
  gsapFadeUp(".fade-up");
  gsapFadeDown(".fade-down");
  gsapRotateBottomLeft(".rotate-bl");
  gsapRotateBottomRight(".rotate-br");
  gsapFlipVerticalLeft(".flip-vertical-left");
  gsapRollInLeft(".roll-in-left");
  gsap_rotate_bl__float(".rotate-bl--float");

  // Tạo timeline
  const tl = gsap.timeline({
    repeatDelay: 0,  // delay giữa các lần lặp
    defaults: { duration: .8, ease: "power2.out" }, // giá trị mặc định
    scrollTrigger: {
      trigger: ".box",
      start: "top 90%", // khi phần tử xuất hiện 80% trong viewport
    }
  });

  // Thêm các animation theo thứ tự
  tl.from(".red", { x: -100, opacity: 0 })        // box đỏ bay xuống
    .from(".blue", { x: -100, opacity: 0 }, "-=0.3")       // box xanh bay từ trái
    .from(".green", { x: -100, opacity: 0 }, "-=0.3");    // box xanh lá phóng to dần

  async function toggleMusic(e) {
    console.log('togle')
    const audio = document.getElementById('audio');
    const iconSvg = document.getElementById('iconSvg');
    if (!audio.src) {
        alert('Chưa có nhạc, vui lòng thêm src cho audio.');
        return;
    }
    if (audio.paused) {
        audio.play();
    } else {
        audio.pause();
    }

    audio.addEventListener('play', () => {
        iconSvg.classList.add('spin');
    });
    audio.addEventListener('pause', () => {
        iconSvg.classList.remove('spin');
    });
  }
  const btn = document.getElementById('player-btn');
  btn.addEventListener('click', toggleMusic);
  const labelMusic = document.getElementById('music-label');
  labelMusic.addEventListener('click', toggleMusic);

  const formNhaGai = document.forms["rsvpFormNhaGai"];
  const formNhaTrai21 = document.forms["rsvpFormNhaTrai21"];
  const formNhaTrai22 = document.forms["rsvpFormNhaTrai22"];
  if (formNhaGai) {
    formNhaGai.addEventListener("submit", (e) => handleFormSubmit(e, "nhagai"));
  }
  if (formNhaTrai21) {
    formNhaTrai21.addEventListener("submit", (e) => handleFormSubmit(e, "nhatrai21"));
  }
  if (formNhaTrai22) {
    formNhaTrai22.addEventListener("submit", (e) => handleFormSubmit(e, "nhatrai22"));
  }
});


async function handleFormSubmit(e, code) {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  console.log("🚀 ~ handleFormSubmit ~ data:", data);

  const {
    name: name,
    attendance: attendance,
    phone: phone,
    wish: wish,
  } = data;
  console.log("🚀 ~ handleFormSubmit 2~ data:", data);

  // Thông báo khi bắt đầu gửi
  Swal.fire({
    title: 'Đang gửi ...',
    text: "Vui lòng chờ trong giây lát",
    icon: "info",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  const SHEET_ENDPOINTS = {
    nhagai: "https://script.google.com/macros/s/AKfycbypscslroxWVRPa1c0Vfg-WmwndGFH-91ND9JWfWG6u4rZ_nO0p3KX-RWg-ZawC2ZY/exec?sheet=nha-gai",
    nhatrai21: "https://script.google.com/macros/s/AKfycbypscslroxWVRPa1c0Vfg-WmwndGFH-91ND9JWfWG6u4rZ_nO0p3KX-RWg-ZawC2ZY/exec?sheet=nha-trai-21",
    nhatrai22: "https://script.google.com/macros/s/AKfycbypscslroxWVRPa1c0Vfg-WmwndGFH-91ND9JWfWG6u4rZ_nO0p3KX-RWg-ZawC2ZY/exec?sheet=nha-trai-22"
  };

  const sheetURL = SHEET_ENDPOINTS[code];
  
  try {
    const res = await fetch(sheetURL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        name,
        attendance,
        phone,
        wish
      }),
    });

    const result = await res.json().catch(() => ({}));
    console.log("Server response:", result);

    form.reset();

    // Thông báo thành công
    Swal.fire({
      title: "Thành công!",
      text: "Cảm ơn bạn đã gửi phản hồi, thông tin đã được gửi đến dâu rể rồi nha",
      icon: "success",
      confirmButtonText: "OK",
      confirmButtonColor: "#000",
    });
  } catch (error) {
    console.error("Error:", error);

    // Thông báo lỗi
    Swal.fire({
      title: "Lỗi!",
      text: "OPPS! Đã xảy ra lỗi: " + error.message,
      icon: "error",
      confirmButtonText: "Thử lại",
      confirmButtonColor: "#000",
    });
  }
}