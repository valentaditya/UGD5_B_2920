'use client';

import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

type Difficulty = 'easy' | 'medium' | 'hard' | null;

const CONFIG = {
  easy: { max: 10, chances: 5 },
  medium: { max: 50, chances: 7 },
  hard: { max: 100, chances: 10 }
};

export default function Game2() {
  const [difficulty, setDifficulty] = useState<Difficulty>(null);
  const [targetNumber, setTargetNumber] = useState<number | null>(null);
  const [chancesLeft, setChancesLeft] = useState<number>(0);
  const [guess, setGuess] = useState<string>('');
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [message, setMessage] = useState<string>('');

  const startGame = (level: 'easy' | 'medium' | 'hard') => {
    const maxNumber = CONFIG[level].max;
    const initialChances = CONFIG[level].chances;
    
    setDifficulty(level);
    setTargetNumber(Math.floor(Math.random() * (maxNumber + 1)));
    setChancesLeft(initialChances);
    setGameStatus('playing');
    setGuess('');
    setMessage(`Tebak angka dari 0 sampai ${maxNumber}!`);
  };

  const handleGuess = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameStatus !== 'playing' || targetNumber === null) return;

    const guessNum = parseInt(guess, 10);
    
    if (isNaN(guessNum)) {
      toast.error('Masukkan angka yang valid!', { autoClose: 1500 });
      return;
    }

    const currentMax = CONFIG[difficulty!].max;
    if (guessNum < 0 || guessNum > currentMax) {
      toast.warning(`Masukkan angka antara 0 dan ${currentMax}!`, { autoClose: 1500 });
      return;
    }

    const newChances = chancesLeft - 1;
    setChancesLeft(newChances);

    if (guessNum === targetNumber) {
      setGameStatus('won');
      setMessage(`🎉 Selamat! Tebakan kamu benar: ${targetNumber}`);
      toast.success('Kamu Menang!', { autoClose: 2000 });
    } else if (newChances === 0) {
      setGameStatus('lost');
      setMessage(`💥 Kesempatan habis! Angka yang benar adalah ${targetNumber}`);
      toast.error('Game Over!', { autoClose: 2000 });
    } else if (guessNum < targetNumber) {
      setMessage(`📈 Tebakan (${guessNum}) terlalu KECIL!`);
    } else {
      setMessage(`📉 Tebakan (${guessNum}) terlalu BESAR!`);
    }

    setGuess('');
  };

  if (!difficulty) {
    return (
      <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl text-center text-white border border-gray-700 w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-purple-400">Pilih Kesulitan</h2>
        <div className="flex flex-col gap-4">
          <button 
            onClick={() => startGame('easy')}
            className="bg-green-600 hover:bg-green-500 py-3 px-6 rounded-xl font-bold text-lg transition-transform transform hover:-translate-y-1"
          >
            🟢 Easy (0-10)
          </button>
          <button 
            onClick={() => startGame('medium')}
            className="bg-yellow-600 hover:bg-yellow-500 py-3 px-6 rounded-xl font-bold text-lg transition-transform transform hover:-translate-y-1"
          >
            🟡 Medium (0-50)
          </button>
          <button 
            onClick={() => startGame('hard')}
            className="bg-red-600 hover:bg-red-500 py-3 px-6 rounded-xl font-bold text-lg transition-transform transform hover:-translate-y-1"
          >
            🔴 Hard (0-100)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 p-8 rounded-3xl shadow-2xl text-center text-white border border-purple-500 w-full max-w-md relative">
      <h2 className="text-3xl font-bold mb-2">Guess the Number</h2>
      <div className="mb-6 flex justify-between items-center bg-gray-900 rounded-lg p-3">
        <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Level: <span className="text-purple-400">{difficulty}</span>
        </span>
        <span className={`font-bold ${chancesLeft <= 2 ? 'text-red-500' : 'text-blue-400'}`}>
          ❤️ Kesempatan: {chancesLeft}
        </span>
      </div>

      <div className="bg-gray-700 rounded-xl p-4 mb-6 min-h-[80px] flex items-center justify-center">
        <p className="text-lg font-medium">{message}</p>
      </div>

      {gameStatus === 'playing' ? (
        <form onSubmit={handleGuess} className="flex flex-col gap-4">
          <input
            type="number"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="w-full bg-gray-900 border-2 border-gray-600 rounded-xl p-4 text-center text-3xl outline-none focus:border-purple-500 transition-colors"
            placeholder="?"
            autoFocus
          />
          <button
            type="submit"
            disabled={!guess}
            className={`py-3 px-6 rounded-xl font-bold text-lg mt-2 ${
              guess ? 'bg-purple-600 hover:bg-purple-500' : 'bg-gray-600 cursor-not-allowed'
            } transition-colors`}
          >
            Tebak!
          </button>
        </form>
      ) : (
        <div className="flex flex-col gap-3 mt-4">
          <button
            onClick={() => startGame(difficulty!)}
            className="bg-purple-600 hover:bg-purple-500 py-3 px-6 rounded-xl font-bold text-lg"
          >
            Main Lagi (Level Sama)
          </button>
          <button
            onClick={() => setDifficulty(null)}
            className="bg-gray-600 hover:bg-gray-500 py-3 px-6 rounded-xl font-bold text-lg"
          >
            Ganti Level
          </button>
        </div>
      )}

      <ToastContainer position="top-center" />
    </div>
  );
}
