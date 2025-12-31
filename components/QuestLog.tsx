
import React from 'react';
import { Card } from './UI';
import { Quest } from '../types';

interface QuestLogProps {
  quests: Quest[];
}

export const QuestLog: React.FC<QuestLogProps> = ({ quests }) => {
  return (
    <div className="w-full lg:w-80 space-y-4">
      <h3 className="text-xl font-bungee text-orange-800 px-2 flex items-center gap-2">
        📜 Active Quests
      </h3>
      <div className="space-y-3">
        {quests.map((quest) => (
          <Card key={quest.id} className={`p-4 border-2 transition-all ${quest.isCompleted ? 'opacity-60 bg-gray-50 border-green-200' : 'border-orange-100 hover:border-orange-300'}`}>
            <div className="flex justify-between items-start mb-2">
              <h4 className={`font-bold ${quest.type === 'main' ? 'text-indigo-600' : 'text-orange-600'}`}>
                {quest.type === 'main' && '🌟 '}{quest.title}
              </h4>
              {quest.isCompleted && <span className="text-green-500 text-xl">✅</span>}
            </div>
            <p className="text-xs text-gray-500 mb-3">{quest.description}</p>
            
            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`absolute top-0 left-0 h-full transition-all duration-500 ${quest.isCompleted ? 'bg-green-500' : 'bg-orange-400'}`}
                style={{ width: `${Math.min(100, (quest.currentProgress / quest.targetProgress) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-semibold text-gray-400">
                {quest.currentProgress} / {quest.targetProgress}
              </span>
              {!quest.isCompleted && (
                <span className="text-xs font-bold text-green-600">
                  Reward: 🎫 {quest.reward}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
