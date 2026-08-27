// ============================================================
// UEST MLBB CUP 4# - Background Music Player
// ============================================================
// - Musik mulai saat user scroll / klik / sentuh halaman
// - Playlist berurutan + loop
// - Posisi lagu tersimpan di localStorage
// - Bisa melanjutkan posisi lagu saat halaman dibuka kembali
// - Tampilan: disc berputar + judul lagu
// ============================================================

(function () {

    'use strict';


    // ========================================================
    // PLAYLIST
    // ========================================================

    var PLAYLIST = [

        {
            src: 'assets/music/1.mp3',
            title: "Let's Goo",
            artist: 'Track I'
        }

        // Tambahkan lagu berikutnya di sini jika diperlukan:

        // ,
        // {
        //     src: 'assets/music/2.mp3',
        //     title: "Track II",
        //     artist: 'UEST MLBB CUP 4'
        // }

    ];


    // ========================================================
    // SETTINGS
    // ========================================================

    var STORAGE_KEY = 'uest_music';

    // Volume 60%
    var VOLUME = 0.6;


    // ========================================================
    // VARIABLES
    // ========================================================

    var audio = null;

    var trackIndex = 0;

    var started = false;


    // ========================================================
    // GET SAVED STATE
    // ========================================================

    function getState() {

        try {

            var data = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );


            if (
                data &&
                typeof data.ti === 'number'
            ) {

                // Jika index lagu sudah tidak tersedia
                if (
                    data.ti >= PLAYLIST.length
                ) {

                    data.ti = 0;

                }


                return data;

            }

        } catch (e) {

            console.log(
                'Tidak bisa membaca music state'
            );

        }


        // Default
        return {
            ti: 0,
            ct: 0
        };

    }


    // ========================================================
    // SAVE STATE
    // ========================================================

    function save() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify({

                    ti: trackIndex,

                    ct: audio
                        ? audio.currentTime || 0
                        : 0

                })
            );

        } catch (e) {

            console.log(
                'Tidak bisa menyimpan music state'
            );

        }

    }


    // ========================================================
    // INITIAL STATE
    // ========================================================

    var saved = getState();

    trackIndex = saved.ti;


    // ========================================================
    // DOM READY
    // ========================================================

    document.addEventListener(
        'DOMContentLoaded',
        function () {

            // Buat UI music
            buildUI();

            // Siapkan audio
            setupAudio();

            // Tunggu interaksi user
            waitForInteraction();

        }
    );


    // ========================================================
    // SETUP AUDIO
    // ========================================================

    function setupAudio() {

        audio = document.createElement(
            'audio'
        );


        // Lebih cocok untuk HP
        audio.preload = 'auto';


        // Volume
        audio.volume = VOLUME;


        // Mobile Safari / iOS
        audio.setAttribute(
            'playsinline',
            ''
        );

        audio.setAttribute(
            'webkit-playsinline',
            ''
        );


        // Tambahkan audio ke body
        document.body.appendChild(
            audio
        );


        // ====================================================
        // LAGU SELESAI
        // ====================================================

        audio.addEventListener(
            'ended',
            function () {

                // Pindah ke lagu berikutnya
                trackIndex =
                    (
                        trackIndex + 1
                    ) % PLAYLIST.length;


                // Load dan play lagu berikutnya
                loadTrack(
                    0,
                    true
                );

            }
        );


        // ====================================================
        // AUDIO ERROR
        // ====================================================

        audio.addEventListener(
            'error',
            function () {

                console.log(
                    'Music error:',
                    audio.error
                );


                // Coba lagu berikutnya
                trackIndex =
                    (
                        trackIndex + 1
                    ) % PLAYLIST.length;


                setTimeout(
                    function () {

                        loadTrack(
                            0,
                            true
                        );

                    },
                    500
                );

            }
        );


        // ====================================================
        // SAVE POSITION
        // ====================================================

        setInterval(
            function () {

                if (
                    audio &&
                    !audio.paused
                ) {

                    save();

                }

            },
            1000
        );


        // Simpan ketika halaman ditutup
        window.addEventListener(
            'beforeunload',
            save
        );


        // Simpan ketika page di-hide
        document.addEventListener(
            'visibilitychange',
            function () {

                if (
                    document.visibilityState ===
                    'hidden'
                ) {

                    save();

                }

            }
        );


        // ====================================================
        // LOAD TRACK PERTAMA
        // ====================================================

        loadTrack(
            saved.ct,
            false
        );

    }


    // ========================================================
    // LOAD TRACK
    // ========================================================

    function loadTrack(
        seekTo,
        autoPlay
    ) {

        if (!audio) return;


        var track =
            PLAYLIST[trackIndex];


        // Set sumber lagu
        audio.src = track.src;


        // Load audio
        audio.load();


        // Update judul
        updateInfo();


        // ====================================================
        // Tunggu metadata
        // ====================================================

        audio.addEventListener(
            'loadedmetadata',
            function onMetadata() {

                audio.removeEventListener(
                    'loadedmetadata',
                    onMetadata
                );


                // ==================================================
                // Kembalikan posisi lagu
                // ==================================================

                if (
                    seekTo > 0 &&
                    isFinite(audio.duration) &&
                    seekTo < audio.duration
                ) {

                    try {

                        audio.currentTime =
                            seekTo;

                    } catch (e) {

                        console.log(
                            'Tidak bisa restore posisi lagu'
                        );

                    }

                }


                // ==================================================
                // Auto play
                // ==================================================

                if (autoPlay) {

                    playMusic();

                }

            }
        );

    }


    // ========================================================
    // PLAY MUSIC
    // ========================================================

    function playMusic() {

        if (!audio) return;


        var promise =
            audio.play();


        // Browser modern mengembalikan Promise
        if (
            promise !== undefined
        ) {

            promise
                .then(
                    function () {

                        // Musik berhasil dimainkan
                        started = true;


                        // Animasi disc
                        setPlaying(
                            true
                        );


                        console.log(
                            '🎵 Music playing'
                        );

                    }
                )
                .catch(
                    function (error) {

                        // Autoplay diblokir browser
                        setPlaying(
                            false
                        );


                        console.log(
                            'Autoplay blocked:',
                            error
                        );

                    }
                );

        } else {

            // Browser lama
            started = true;

            setPlaying(
                true
            );

        }

    }


    // ========================================================
    // WAIT FOR USER INTERACTION
    // ========================================================

    function waitForInteraction() {

        var events = [

            // Desktop
            'click',
            'mousemove',
            'keydown',
            'wheel',
            'scroll',

            // Mobile
            'touchstart',
            'touchend',
            'pointerdown'

        ];


        function onInteract() {


            // Jika sudah mulai
            if (started) {

                return;

            }


            // ==================================================
            // Hapus semua listener
            // ==================================================

            events.forEach(
                function (event) {

                    document.removeEventListener(
                        event,
                        onInteract,
                        true
                    );


                    window.removeEventListener(
                        event,
                        onInteract,
                        true
                    );

                }
            );


            // ==================================================
            // Play
            // ==================================================

            if (audio) {

                playMusic();

            }

        }


        // ======================================================
        // Pasang listener
        // ======================================================

        events.forEach(
            function (event) {

                document.addEventListener(
                    event,
                    onInteract,
                    true
                );


                window.addEventListener(
                    event,
                    onInteract,
                    true
                );

            }
        );

    }


    // ========================================================
    // SET PLAYING STATUS
    // ========================================================

    function setPlaying(
        playing
    ) {

        var disc =
            document.getElementById(
                'musicDisc'
            );


        var notif =
            document.getElementById(
                'musicNotification'
            );


        // ====================================================
        // Disc
        // ====================================================

        if (disc) {

            if (playing) {

                disc.classList.remove(
                    'paused'
                );

            } else {

                disc.classList.add(
                    'paused'
                );

            }

        }


        // ====================================================
        // Notification
        // ====================================================

        if (notif) {

            if (playing) {

                notif.classList.add(
                    'is-playing'
                );

            } else {

                notif.classList.remove(
                    'is-playing'
                );

            }

        }

    }


    // ========================================================
    // UPDATE MUSIC INFO
    // ========================================================

    function updateInfo() {

        var track =
            PLAYLIST[trackIndex];


        var title =
            document.querySelector(
                '.music-title'
            );


        var artist =
            document.querySelector(
                '.music-artist'
            );


        if (title) {

            title.textContent =
                track.title;

        }


        if (artist) {

            artist.textContent =
                track.artist;

        }

    }


    // ========================================================
    // BUILD MUSIC UI
    // ========================================================

    function buildUI() {

        var track =
            PLAYLIST[trackIndex];


        var notif =
            document.createElement(
                'div'
            );


        notif.id =
            'musicNotification';


        notif.innerHTML =

            '<div class="music-notif-inner">' +

                // ==============================
                // DISC
                // ==============================

                '<div class="music-disc-wrapper">' +

                    '<div class="music-disc paused" id="musicDisc">' +

                        '<div class="music-disc-inner">' +

                            '<i class="fas fa-music"></i>' +

                        '</div>' +

                    '</div>' +

                '</div>' +


                // ==============================
                // MUSIC INFO
                // ==============================

                '<div class="music-info">' +

                    '<span class="music-title">' +

                        track.title +

                    '</span>' +


                    '<span class="music-artist">' +

                        track.artist +

                    '</span>' +

                '</div>' +

            '</div>';


        // Masukkan UI ke body
        document.body.appendChild(
            notif
        );

    }

})();