'use client'
import React, { useEffect, useState } from "react";
import Game1 from "../../components/Game1";
import Game2 from "../../components/Game2";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [activeGame, setActiveGame] = useState<'none' | 'game1' | 'game2'>('none');

    useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn');
        if (!loggedIn) {
            router.replace('/auth/not-authorized');
        } else {
            setIsAuthorized(true);
        }
    }, [router]);

    if (!isAuthorized) return null;

    if (activeGame === 'none') {
        return (
            <div className="flex flex-col items-center justify-center w-full p-8 relative">
                <button
                    onClick={() => {
                        localStorage.removeItem('isLoggedIn');
                        router.replace('/auth/login');
                    }}
                    className="absolute top-0 right-0 font-semibold py-2 px-6 rounded-lg text-white bg-red-600 hover:bg-red-700 transition"
                >
                    Logout
                </button>
                <h1 className="text-5xl font-extrabold mb-12 tracking-tight text-white drop-shadow-md">Choose Your Game</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Game 1 */}
                    <div 
                        onClick={() => setActiveGame('game1')}
                        className="bg-[#2a4365] hover:bg-[#2c5282] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl border-2 border-transparent hover:border-blue-400"
                    >
                        <div className="text-6xl mb-4 drop-shadow-lg">🐹</div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Whack a Mole</h2>
                        <p className="text-blue-200 text-center">Mainkan game hit the mole yang tersedia saat ini.</p>
                    </div>

                    {/* Game 2 */}
                    <div 
                        onClick={() => setActiveGame('game2')}
                        className="bg-[#553c9a] hover:bg-[#6b46c1] transition-all duration-300 transform hover:-translate-y-2 cursor-pointer rounded-2xl p-8 flex flex-col items-center justify-center shadow-xl border-2 border-transparent hover:border-purple-400"
                    >
                        <div className="text-6xl mb-4 drop-shadow-lg">🔢</div>
                        <h2 className="text-3xl font-bold mb-2 text-white">Guess the Number</h2>
                        <p className="text-purple-200 text-center">Tebak angka rahasia sesuai tingkat kesulitan!</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center w-full relative">
            <button 
                onClick={() => setActiveGame('none')}
                className="absolute top-6 left-6 bg-white text-gray-900 hover:bg-gray-200 px-6 py-2 rounded-full font-bold shadow-lg transition-colors flex items-center gap-2 z-10"
            >
                <span>←</span> Kembali ke Menu
            </button>

            {activeGame === 'game1' && <Game1 />}
            
            {activeGame === 'game2' && <Game2 />}
        </div>
    );
}
