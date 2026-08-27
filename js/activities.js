const activities = [
  {
    image: "assets/img/img-aktivitas/1.webp",
    title: "PEMILIHAN DUTA GENRE UNHI DI LIVING WORLD DENPASAR",
    description:
      "Kegiatan pemilihan Duta Genre UNHI yang berlangsung di Living World Denpasar.",
  },
  {
    image: "assets/img/img-aktivitas/2.webp",
    title: "SERAH TERIMA JABATAN PIK M",
    description:
      "Kegiatan serah terima jabatan untuk menjamin kelancaran operasional organisasi.",
  },
  { 
    image: "assets/img/img-aktivitas/3.webp",
    title: "BAKTI SOSIAL UKM PIK-M UNHI",
    description:
      "Kegiatan bakti sosial yang dilakukan oleh UKM PIK-M UNHI untuk memberikan kontribusi positif kepada masyarakat.",
  },
  {
    image: "assets/img/img-aktivitas/4.webp",
    title: "PEMBEKALAN CALON DUTA GENRE UNHI",
    description:
      "Kegiatan pembekalan calon Duta Genre UNHI untuk mempersiapkan mereka dalam menjalankan tugas dan tanggung jawab sebagai duta.",
  },
];

//data image carousel
const carouselTrack = document.getElementById("carouselTrack");

function renderActivities() {

    carouselTrack.innerHTML = activities
        .map(
            (activity) => `
                <div class="activity-card">
                    <img 
                        src="${activity.image}" 
                        alt="${activity.title}"
                    >

                    <div class="activity-card-content">
                        <h3>${activity.title}</h3>

                        <p>
                            ${activity.description}
                        </p>
                    </div>
                </div>
            `
        )
        .join("");

    // Reset posisi carousel setelah data dibuat
    currentSlide = 0;
    carouselTrack.style.transform = "translateX(0)";
}

renderActivities();