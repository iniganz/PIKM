const activities = [
  {
    image: "assets/img/img-aktivitas/1.webp",
    title: "Seminar Kesehatan Mental",
    description:
      "Kegiatan seminar tentang pentingnya kesehatan mental bagi mahasiswa dengan pembicara profesional.",
  },
  {
    image: "assets/img/img-aktivitas/2.webp",
    title: "Bakti Sosial",
    description:
      "Kegiatan pengabdian masyarakat yang dilakukan oleh anggota PIK M untuk memberikan dampak positif.",
  },
  {
    image: "assets/img/img-aktivitas/3.webp",
    title: "Workshop Leadership",
    description:
      "Pelatihan kepemimpinan untuk meningkatkan soft skill dan kemampuan organisasi mahasiswa.",
  },
  {
    image: "assets/img/img-aktivitas/4.webp",
    title: "Team Building",
    description:
      "Kegiatan memperkuat ikatan antar anggota melalui berbagai aktivitas seru dan menantang.",
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