(function () {
    'use strict';

    // =========================
    // PLAYLIST
    // =========================

    var PLAYLIST = [
        {
            src: 'assets/music/yo.mpeg',
            title: "Let's Go",
            artist: 'Track I'
        }

        // Tambahkan lagu berikutnya:
        // {
        //     src: 'assets/music/track-2.mpeg',
        //     title: 'Track II',
        //     artist: 'UEST MLBB CUP 4'
        // }
    ];

    var STORAGE_KEY = 'uest_music';

    // 40% volume
    var VOLUME = 0.4;

    var audio = null;
    var trackIndex = 0;
    var started = false;


    // =========================
    // STATE
    // =========================

    function getState() {

        try {

            var data = JSON.parse(
                localStorage.getItem(STORAGE_KEY)
            );

            if (data && typeof data.ti === 'number') {

                if (data.ti >= PLAYLIST.length) {
                    data.ti = 0;
                }

                return data;
            }

        } catch (e) {}

        return {
            ti: 0,
            ct: 0
        };
    }


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

        } catch (e) {}
    }


    // =========================
    // INIT
    // =========================

    var saved = getState();

    trackIndex = saved.ti;


    document.addEventListener(
        'DOMContentLoaded',
        function () {

            buildUI();

            setupAudio();

            waitForInteraction();

        }
    );


    // =========================
    // AUDIO SETUP
    // =========================

    function setupAudio() {

        audio = document.createElement('audio');

        audio.preload = 'auto';

        audio.volume = VOLUME;

        audio.setAttribute(
            'playsinline',
            ''
        );

        audio.setAttribute(
            'webkit-playsinline',
            ''
        );

        document.body.appendChild(audio);


        // Lagu selesai
        audio.addEventListener(
            'ended',
            function () {

                trackIndex =
                    (trackIndex + 1)
                    % PLAYLIST.length;

                loadTrack(0, true);

            }
        );


        // Error
        audio.addEventListener(
            'error',
            function () {

                console.log(
                    'Music error:',
                    audio.error
                );

                trackIndex =
                    (trackIndex + 1)
                    % PLAYLIST.length;

                setTimeout(
                    function () {
                        loadTrack(0, true);
                    },
                    500
                );

            }
        );


        // Simpan posisi setiap detik
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


        // Simpan sebelum halaman ditutup
        window.addEventListener(
            'beforeunload',
            save
        );


        // Load lagu pertama
        loadTrack(
            saved.ct,
            false
        );
    }


    // =========================
    // LOAD TRACK
    // =========================

    function loadTrack(
        seekTo,
        autoPlay
    ) {

        if (!audio) return;

        var track =
            PLAYLIST[trackIndex];

        audio.src = track.src;

        audio.load();

        updateInfo();


        audio.addEventListener(
            'loadedmetadata',
            function onMetadata() {

                audio.removeEventListener(
                    'loadedmetadata',
                    onMetadata
                );


                // Kembalikan posisi lagu
                if (
                    seekTo > 0 &&
                    seekTo < audio.duration
                ) {

                    try {
                        audio.currentTime =
                            seekTo;
                    } catch (e) {}

                }


                if (autoPlay) {
                    playMusic();
                }

            }
        );
    }


    // =========================
    // PLAY MUSIC
    // =========================

    function playMusic() {

        if (!audio) return;


        var promise = audio.play();


        if (promise !== undefined) {

            promise
                .then(function () {

                    started = true;

                    setPlaying(true);

                    console.log(
                        'Music playing'
                    );

                })
                .catch(function (error) {

                    console.log(
                        'Autoplay blocked:',
                        error
                    );

                    setPlaying(false);

                });

        } else {

            started = true;

            setPlaying(true);

        }
    }


    // =========================
    // USER INTERACTION
    // =========================

    function waitForInteraction() {

        var events = [
            'pointerdown',
            'touchstart',
            'click',
            'scroll',
            'wheel',
            'keydown'
        ];


        function onInteract() {

            if (started) return;


            // Hapus listener
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


            // Play langsung dari gesture user
            playMusic();

        }


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


    // =========================
    // UI STATUS
    // =========================

    function setPlaying(playing) {

        var disc =
            document.getElementById(
                'musicDisc'
            );

        var notif =
            document.getElementById(
                'musicNotification'
            );


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


    // =========================
    // UPDATE INFO
    // =========================

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


    // =========================
    // BUILD UI
    // =========================

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