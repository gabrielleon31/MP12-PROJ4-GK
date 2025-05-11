import React from 'react';
import './TrendCard.css';
import { TrendData } from '../Data/TrendData';

const TrendCard = () => {
  return (
    <div className='TrendCard'>
      <h3>Trending for you</h3>

      {TrendData.map((trend, index) => (
        <div className="trend" key={trend.name + index}>
          <span>#{trend.name}</span>
          <span>{trend.shares}k Shares</span>
        </div>
      ))}

    </div>
  );
}

export default TrendCard;
