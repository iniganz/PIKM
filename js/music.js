// ============================================================
// UEST MLBB CUP 4# - Background Music Player
// ============================================================
// - Musik mulai ketika user mulai berinteraksi / menggeser
// - Cocok untuk Desktop + HP
// - Playlist berurutan + loop
// - Posisi lagu tersimpan
// - Disc berputar ketika musik aktif
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

        // Tambahkan lagu berikutnya seperti ini:
        //
        // ,
        // {
        //     src: 'assets/music/2.mp3',
        //     title: 'Track II',
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

    var interactionEvents = [

        // HP
        'touchstart',
        'pointerdown',

        // Desktop
        'click',
        'wheel',
        'keydown'

    ];


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

                if (
                    data.ti >= PLAYLIST.length
                ) {

                    data.ti = 0;

                }


                return data;

            }

        } catch (error) {

            console.log(
                'Music state tidak dapat dibaca.'
            );

        }


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

        } catch (error) {

            console.log(
                'Music state tidak dapat disimpan.'
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

            buildUI();

            setupAudio();

            setupInteraction();

        }
    );


    // ========================================================
    // SETUP AUDIO
    // ========================================================

    function setupAudio() {

        audio = document.createElement(
            'audio'
        );


        // Penting untuk HP
        audio.preload = 'auto';

        audio.volume = VOLUME;


        // Mobile Safari / iPhone
        audio.setAttribute(
            'playsinline',
            ''
        );

        audio.setAttribute(
            'webkit-playsinline',
            ''
        );


        document.body.appendChild(
            audio
        );


        // ====================================================
        // LAGU SELESAI
        // ====================================================

        audio.addEventListener(
            'ended',
            function () {

                trackIndex =
                    (
                        trackIndex + 1
                    ) % PLAYLIST.length;


                loadTrack(
                    0
                );


                playMusic();

            }
        );


        // ====================================================
        // ERROR
        // ====================================================

        audio.addEventListener(
            'error',
            function () {

                console.error(
                    '❌ Music Error:',
                    audio.error
                );

            }
        );


        // ====================================================
        // SAVE POSISI
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


        // Simpan ketika browser meninggalkan halaman
        window.addEventListener(
            'beforeunload',
            save
        );


        // Simpan ketika tab disembunyikan
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


        // Load lagu
        loadTrack(
            saved.ct
        );

    }


    // ========================================================
    // LOAD TRACK
    // ========================================================

    function loadTrack(
        seekTo
    ) {

        if (!audio) return;


        var track =
            PLAYLIST[trackIndex];


        audio.src = track.src;

        audio.load();


        // Update nama lagu
        updateInfo();


        // Restore posisi
        audio.addEventListener(
            'loadedmetadata',
            function onMetadata() {

                audio.removeEventListener(
                    'loadedmetadata',
                    onMetadata
                );


                if (
                    seekTo > 0 &&
                    isFinite(audio.duration) &&
                    seekTo < audio.duration
                ) {

                    try {

                        audio.currentTime =
                            seekTo;

                    } catch (error) {

                        console.log(
                            'Gagal restore posisi musik.'
                        );

                    }

                }

            }
        );

    }


    // ========================================================
    // PLAY MUSIC
    // ========================================================

    function playMusic() {

        if (!audio) return;


        // Jangan play ulang kalau sudah berjalan
        if (!audio.paused) {

            started = true;

            setPlaying(true);

            return;

        }


        var promise = audio.play();


        if (promise !== undefined) {

            promise
                .then(function () {

                    started = true;

                    setPlaying(true);

                    removeInteractionListeners();


                    console.log(
                        '🎵 Music playing'
                    );

                })
                .catch(function (error) {

                    // JANGAN set started = true
                    // supaya masih bisa mencoba lagi

                    started = false;

                    setPlaying(false);


                    console.log(
                        '⚠️ Music belum bisa dimainkan:',
                        error
                    );

                });

        }

    }


    // ========================================================
    // USER INTERACTION
    // ========================================================

    function setupInteraction() {

        interactionEvents.forEach(
            function (event) {

                document.addEventListener(
                    event,
                    handleInteraction,
                    {
                        capture: true,
                        passive: true
                    }
                );

            }
        );

    }


    // ========================================================
    // HANDLE INTERACTION
    // ========================================================

    function handleInteraction() {

        if (started) return;


        // Langsung coba play
        playMusic();

    }


    // ========================================================
    // REMOVE LISTENERS
    // ========================================================

    function removeInteractionListeners() {

        interactionEvents.forEach(
            function (event) {

                document.removeEventListener(
                    event,
                    handleInteraction,
                    true
                );

            }
        );

    }


    // ========================================================
    // MUSIC STATUS
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
        // DISC
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
        // NOTIFICATION
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

                '<div class="music-disc-wrapper">' +

                    '<div class="music-disc paused" id="musicDisc">' +

                        '<div class="music-disc-inner">' +

                            '<i class="fas fa-music"></i>' +

                        '</div>' +

                    '</div>' +

                '</div>' +


                '<div class="music-info">' +

                    '<span class="music-title">' +

                        track.title +

                    '</span>' +


                    '<span class="music-artist">' +

                        track.artist +

                    '</span>' +

                '</div>' +

            '</div>';


        document.body.appendChild(
            notif
        );

    }


})();