import React from 'react';
import { GameProvider } from '@/lib/game/GameContext';
import { AudioProvider } from '@/lib/audio/AudioContext';
import GameBoard from '@/components/GameBoard';
import ScoreDisplay from '@/components/ScoreDisplay';
import HintDisplay from '@/components/HintDisplay';
import GameOverModal from '@/components/GameOverModal';
import AutoModeToggle from '@/components/AutoModeToggle';
import SpeedSetting from '@/components/SpeedSetting';
import VolumeControl from '@/components/VolumeControl';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <AudioProvider>
          <GameProvider>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h1 className="text-3xl font-bold mb-6 text-center text-black">Lines98</h1>
              
              <div className="flex flex-col items-center mb-6">
                <ScoreDisplay />
                <div className="flex flex-col md:flex-row justify-between w-full gap-4 mt-4">
                  <HintDisplay />
                  <div className="flex flex-col gap-2">
                    <AutoModeToggle />
                    <SpeedSetting />
                    <VolumeControl />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center">
                <GameBoard />
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500">
                <p>Form lines of 5 or more balls of the same color to score points.</p>
                <p>Game ends when the board is full.</p>
              </div>
              
              <GameOverModal />
            </div>
          </GameProvider>
        </AudioProvider>
      </div>
    </main>
  );
}
