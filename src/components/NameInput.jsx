import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedContent from "../components/AnimatedContent";
import backgroundTimerDesktop from "../assets/Timerdesktop.png";
import backgroundTimerMobile from "../assets/FindMobile.jpg";
import Logo from "../assets/logo-focusify.png"; 
// <-- import logo-nya

const NameInput = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleStart = () => {
        if (name.trim() !== "") {
            localStorage.setItem("username", name);
            navigate("/timerpage");
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleStart();
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center w-screen h-screen overflow-hidden"
            style={{
                backgroundImage: `url(${window.innerWidth <= 768
                        ? backgroundTimerMobile
                        : backgroundTimerDesktop
                    })`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            {/* Logo */}
            <div className="absolute top-6 w-full flex justify-center md:justify-start md:left-8 items-center space-x-2">
                <img
                    src={Logo}
                    alt="Focusify Logo"
                    className="w-8 h-8 md:w-10 md:h-10 object-contain rounded-full"
                />
                <div className="text-lg md:text-3xl font-bold transition-colors duration-300 ${textColor}">
                    Focusify
                </div>
            </div>

            {/* Card pakai animasi */}
            <AnimatedContent
                distance={50}
                direction="vertical"
                delay={200}
                config={{ tension: 100, friction: 20 }}
            >
                <div className="bg-white/10 backdrop-blur-lg border border-white/30 rounded-2xl px-8 py-20 md:px-10 md:py-20 max-w-md flex flex-col items-center shadow-xl">
                    <h1 className="text-lg md:text-2xl font-bold text-white text-center mb-6 md:mb-10 leading-snug">
                        BERSIAPLAH UNTUK LEBIH PRODUKTIF!
                    </h1>
                    <p className="text-white font-semibold text-2xl md:text-3xl mb-5 text-center">
                        Ayo Kita Mulai !!
                    </p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Nama Kamu"
                        className="w-full mb-12 md:mb-14 bg-transparent text-white text-2xl md:text-3xl text-center placeholder-white/50 focus:outline-none"
                    />
                    <button
                        onClick={handleStart}
                        className="appearance-none bg-[#3D3AFD] text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition w-full text-lg md:text-xl"
                    >
                        Lanjut
                    </button>

                    <p className="text-xs md:text-sm text-white mt-3 underline text-center">
                        Atau tekan enter
                    </p>
                </div>
            </AnimatedContent>
        </div>
    );
};

export default NameInput;
