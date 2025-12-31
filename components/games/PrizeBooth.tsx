
import React from 'react';
import { Card, Button } from '../UI';
import { PRIZES } from '../../constants';
import { UserStats } from '../../types';

export const PrizeBooth: React.FC<{ 
  stats: UserStats, 
  onBuy: (prizeId: string, cost: number) => void 
}> = ({ stats, onBuy }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-5xl font-bungee text-rose-600 mb-2">Mela Prize Booth</h2>
        <p className="text-gray-600">Spend your tickets here for amazing gifts!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRIZES.map(prize => {
          const isOwned = stats.prizes.includes(prize.id);
          return (
            <Card key={prize.id} className="p-6 flex flex-col items-center">
              <div className="text-7xl mb-4 animate-float">{prize.image}</div>
              <h3 className="text-xl font-bold mb-1">{prize.name}</h3>
              <p className="text-orange-600 font-bold mb-4">{prize.cost} Tickets</p>
              
              <Button 
                onClick={() => onBuy(prize.id, prize.cost)}
                disabled={isOwned || stats.tickets < prize.cost}
                variant={isOwned ? 'secondary' : 'accent'}
                className="w-full"
              >
                {isOwned ? "Already Won!" : stats.tickets < prize.cost ? "Need More Tickets" : "Redeem"}
              </Button>
            </Card>
          );
        })}
      </div>

      {stats.prizes.length > 0 && (
        <div className="mt-16 p-8 bg-white rounded-3xl shadow-inner border-2 border-dashed border-gray-300">
          <h3 className="text-2xl font-bungee text-gray-400 mb-6 text-center">Your Collection</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {stats.prizes.map(pId => {
              const prize = PRIZES.find(p => p.id === pId);
              return prize ? (
                <div key={pId} className="flex flex-col items-center">
                  <div className="text-5xl">{prize.image}</div>
                  <span className="text-xs text-gray-500 mt-2">{prize.name}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
