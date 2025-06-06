import React, { useState, useEffect, useRef } from "react";
import backgroundTimerDesktop from "../assets/Timerdesktop.png";
import backgroundTimerMobile from "../assets/FindMobile.jpg";
import Logo from "../assets/logo-focusify.png";
import AnimatedContent from "../components/AnimatedContent";
import { Toaster, toast } from 'react-hot-toast';
import SettingTimer from "../components/SettingTimer"; // pastikan path-nya benar
import { PencilSimple } from "phosphor-react";

const TimerPage = () => {
    const name = localStorage.getItem('username') || 'Guest';
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('fokus'); // fokus | istirahat
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const timerRef = useRef(null);
    const [customTitle, setCustomTitle] = useState('Apa yang mau kamu lakukan hari ini?');
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [customTimes, setCustomTimes] = useState({
        fokus: 30,
        istirahat: 5,
        istirahatPanjang: 10,
    });

    const [backgroundImage, setBackgroundImage] = useState(
        window.innerWidth <= 768 ? backgroundTimerMobile : backgroundTimerDesktop
    );

    useEffect(() => {
        const handleResize = () => {
            setBackgroundImage(
                window.innerWidth <= 768 ? backgroundTimerMobile : backgroundTimerDesktop
            );
        };
        window.addEventListener('resize', handleResize);
        // Set initial timeLeft based on mode and customTimes when component mounts
        setTimeLeft(customTimes[mode] * 60);
        return () => window.removeEventListener('resize', handleResize);
    }, []); // Hanya dijalankan sekali saat mount untuk listener resize

    useEffect(() => {
        // Efek ini menangani reset timeLeft ketika mode atau customTimes berubah *setelah load awal*
        // Hanya reset jika timer tidak berjalan atau jika mode berubah
        if (!isRunning || mode !== prevModeRef.current) {
            setTimeLeft(customTimes[mode] * 60);
        }
    }, [mode, customTimes]); // Tidak memasukkan isRunning di sini agar tidak reset saat toggle timer

    // Ref untuk menyimpan mode sebelumnya untuk perbandingan di useEffect
    const prevModeRef = useRef();
    useEffect(() => {
        prevModeRef.current = mode;
    });

    const toggleTimer = () => {
        setIsRunning((prev) => !prev);
    };

    const switchMode = (newMode) => {
        setMode(newMode);
        setIsRunning(false); // Otomatis timeLeft akan diupdate oleh useEffect [mode, customTimes]
    };

    const resetTimer = () => {
        setIsRunning(false);
        setTimeLeft(customTimes[mode] * 60);
    };

    const handleAutoSwitch = () => {
        const notifSound = new Audio('/sounds/notif.mp3'); // Pastikan path ini benar & file ada di public
        notifSound.play().catch(error => console.error("Error playing sound:", error)); // Handle error jika audio gagal play

        let toastMessage = '';
        let toastStyle = {};

        if (mode === 'fokus') {
            toastMessage = '🎯 Waktu Fokus selesai! Saatnya istirahat.';
            toastStyle = { background: '#2563eb', color: 'white', fontWeight: 'bold', fontSize: '16px', borderRadius: '10px', padding: '12px 20px', boxShadow: '0 4px 14px rgba(37, 99, 235, 0.6)' };
            setMode('istirahat');
        } else { // Berlaku untuk 'istirahat' dan 'istirahatPanjang' jika ada
            toastMessage = '☕ Waktu Istirahat selesai! Yuk lanjut fokus.';
            toastStyle = { background: '#059669', color: 'white', fontWeight: 'bold', fontSize: '16px', borderRadius: '10px', padding: '12px 20px', boxShadow: '0 4px 14px rgba(5, 150, 105, 0.6)' };
            setMode('fokus');
        }

        toast.success(toastMessage, { duration: 5000, position: 'top-center', style: toastStyle });
        setIsRunning(true); // Langsung lanjut auto play untuk mode berikutnya
        // timeLeft akan diupdate oleh useEffect yang memantau 'mode' dan 'customTimes'
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (isRunning && timeLeft === 0) { // Waktu habis
            clearInterval(timerRef.current);
            handleAutoSwitch();
        } else { // Timer dihentikan atau belum mulai
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, timeLeft]); // Efek ini sekarang bergantung pada isRunning dan timeLeft


    const formatTime = (time) => {
        const minutes = Math.floor(time / 60).toString().padStart(2, '0');
        const seconds = (time % 60).toString().padStart(2, '0');
        return `${minutes} : ${seconds}`;
    };

    return (
        <>
            {/* Background Layer */}
            <div
                className="fixed inset-0 w-screen h-screen -z-10" // -z-10 agar selalu di belakang
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />

            {/* Content Layer with Scroll */}
            {/* Sesuaikan pb-24 (padding-bottom) dengan tinggi navigation bar Anda agar konten tidak tertutup */}
            <div className="relative flex flex-col min-h-screen items-center text-white overflow-y-auto pt-20 pb-28 md:pb-24 px-4">
                <Toaster position="top-center" reverseOrder={false} />

                {/* Logo */}
                <div className="absolute top-6 w-full flex justify-center md:justify-start md:left-8 items-center space-x-2 z-10">
                    <img
                        src={Logo}
                        alt="Focusify Logo"
                        className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full"
                    />
                    <div className="text-lg md:text-3xl font-bold text-white"> {/* Pastikan warna teks terlihat */}
                        Focusify
                    </div>
                </div>

                {/* Settings icon */}
                <div className="absolute top-6 right-6 md:right-10 bg-blue-800/70 p-5 md:p-4 rounded-xl shadow-md text-white z-30">
                    <button onClick={() => setShowSettings(true)} aria-label="Pengaturan Timer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.397-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894zM15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>

                {/* Main content, centered */}
                {/* Tambahkan margin atas agar tidak terlalu dekat dengan logo/settings di layar kecil */}
                <div className="flex flex-col items-center justify-center flex-grow space-y-6 mt-16 md:mt-0">
                    <AnimatedContent
                        distance={50}
                        direction="vertical"
                        delay={200}
                        config={{ tension: 100, friction: 40 }}
                    >
                        <div className="flex flex-col items-center text-white px-4 space-y-4 sm:space-y-6">
                            {/* Customizable Title */}
                            <div className="flex items-center gap-2 text-center font-sans text-lg sm:text-xl md:text-2xl font-medium">
                                {isEditingTitle ? (
                                    <input
                                        type="text"
                                        value={customTitle}
                                        onChange={(e) => setCustomTitle(e.target.value)}
                                        onBlur={() => setIsEditingTitle(false)}
                                        onKeyPress={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                                        className="bg-transparent border-b border-white text-white placeholder-gray-300 text-center focus:outline-none w-full max-w-xs sm:max-w-md"
                                        autoFocus
                                    />
                                ) : (
                                    <p className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                                        {customTitle}
                                        <button onClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }} aria-label="Edit Judul">
                                            <PencilSimple size={20} className="hover:text-gray-300" />
                                        </button>
                                    </p>
                                )}
                            </div>

                            {/* Mode buttons */}
                            <div className="flex space-x-2 sm:space-x-3">
                                <button
                                    className={`px-4 py-2 md:px-5 md:py-3 rounded-xl border text-xs sm:text-sm md:text-base transition-colors duration-200 ${mode === 'fokus' ? 'bg-blue-600 text-white border-blue-600' : 'border-white text-white hover:bg-white/20'}`}
                                    onClick={() => switchMode('fokus')}
                                >
                                    Fokus
                                </button>
                                <button
                                    className={`px-4 py-2 md:px-5 md:py-3 rounded-xl border text-xs sm:text-sm md:text-base transition-colors duration-200 ${mode === 'istirahat' ? 'bg-emerald-600 text-white border-emerald-600' : 'border-white text-white hover:bg-white/20'}`}
                                    onClick={() => switchMode('istirahat')}
                                >
                                    Istirahat
                                </button>
                            </div>

                            {/* Timer */}
                            <h2 className="text-7xl sm:text-8xl md:text-9xl font-bold my-4 md:my-6 tabular-nums">{formatTime(timeLeft)}</h2>

                            {/* Control buttons */}
                            <div className="flex space-x-4 items-center">
                                <button
                                    className="bg-white/50 backdrop-blur-sm text-gray-800 font-semibold px-5 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-white/70 transition-colors text-sm sm:text-base"
                                    onClick={toggleTimer}
                                >
                                    {isRunning ? 'Hentikan' : 'Mulai'}
                                </button>
                                <button
                                    onClick={resetTimer}
                                    className="text-white hover:text-gray-300 transition-colors"
                                    aria-label="Reset Timer"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 256 256" className="fill-current md:w-8 md:h-8"><path d="M88,104H40a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0V76.69L62.63,62.06A95.43,95.43,0,0,1,130,33.94h.53a95.36,95.36,0,0,1,67.07,27.33,8,8,0,0,1-11.18,11.44,79.52,79.52,0,0,0-55.89-22.77h-.45A79.56,79.56,0,0,0,73.94,73.37L59.31,88H88a8,8,0,0,1,0,16Zm128,48H168a8,8,0,0,0,0,16h28.69l-14.63,14.63a79.56,79.56,0,0,1-56.13,23.43h-.45a79.52,79.52,0,0,1-55.89-22.77,8,8,0,1,0-11.18,11.44,95.36,95.36,0,0,0,67.07,27.33H126a95.43,95.43,0,0,0,67.36-28.12L208,179.31V208a8,8,0,0,0,16,0V160A8,8,0,0,0,216,152Z"></path></svg>
                                </button>
                            </div>
                        </div>
                    </AnimatedContent>
                </div>


                {/* Navigation Icons - Fixed at the bottom */}
                <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto flex justify-around px-4 py-3 bg-blue-700/80 backdrop-blur-sm text-white rounded-t-xl shadow-lg md:bottom-5 md:left-1/2 md:mx-0 md:transform md:-translate-x-1/2 md:w-auto md:gap-5 md:px-5 md:rounded-lg z-50">
                    <button onClick={() => window.location.href = '/'} className="hover:scale-110 transition p-2" title="Beranda" aria-label="Beranda">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9.75L12 3l9 6.75V20a1.25 1.25 0 01-1.25 1.25H4.25A1.25 1.25 0 013 20V9.75z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 21V12h6v9" />
                        </svg>
                    </button>
                    <button onClick={() => window.location.href = '/realtime'} className="hover:scale-110 transition p-2" title="Realtime Calm" aria-label="Realtime Calm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>
                    </button>
                    <button onClick={() => window.location.href = '/timerpage'} className="hover:scale-110 transition p-2 text-blue-300" title="Timer Fokus" aria-label="Timer Fokus"> {/* Current page indicator */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 md:w-7 md:h-7" fill="currentColor" viewBox="0 0 24 24" stroke="currentColor"> {/* Fill for active */}
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3M15 3H9M12 22a9 9 0 100-18 9 9 0 000 18z" />
                        </svg>
                    </button>
                </div>

                {/* Settings Panel - Slide from Right */}
                <div
                    className={`fixed top-0 right-0 h-full w-full sm:w-[90%] sm:max-w-[400px] bg-white/20 backdrop-blur shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${showSettings ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="p-6 md:p-8 h-full flex flex-col justify-center text-gray-800">
                        <SettingTimer
                            defaultTimes={customTimes}
                            onSave={(newTimes) => {
                                setCustomTimes(newTimes);
                                setShowSettings(false);
                                setIsRunning(false); // Hentikan timer saat menyimpan pengaturan baru
                                // timeLeft akan diupdate oleh useEffect [mode, customTimes]
                            }}
                        />
                        <button
                            onClick={() => setShowSettings(false)}
                            className="text-sm text-black hover:text-slate-900 underline mt-3 mx-auto block"
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TimerPage;