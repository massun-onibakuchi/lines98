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
    <main className="flex min-h-screen flex-col items-center justify-between p-2 sm:p-4 md:p-8">
      <div className="w-full max-w-5xl">
        <AudioProvider>
          <GameProvider>
            <div className="bg-white p-2 sm:p-3 md:p-6 rounded-xl shadow-lg">
              <div className="mb-2 max-w-md mx-auto space-y-1">
                <ScoreDisplay />
                <HintDisplay />
                <AutoModeToggle />
                <SpeedSetting />
                <VolumeControl />
              </div>
              
              <div className="flex justify-center">
                <GameBoard />
              </div>
              
              <div className="mt-2 md:mt-6 text-center text-xs sm:text-sm text-gray-500">
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
