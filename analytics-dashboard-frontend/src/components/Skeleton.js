import React from 'react';
import './Skeleton.css';

const Skeleton = ({ type = 'text', width, height }) => {
  const classes = `skeleton skeleton-${type}`;
  const style = {
    width: width || 'auto',
    height: height || 'auto'
  };

  return <div className={classes} style={style} aria-hidden="true" />;
};

export const CardSkeleton = () => (
  <div className="summary-card skeleton-card">
    <div className="card-icon-container">
      <Skeleton type="circle" width="40px" height="40px" />
    </div>
    <div className="card-content">
      <Skeleton type="text" width="80px" height="20px" />
      <Skeleton type="text" width="60px" height="24px" />
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <div className="table-row-skeleton">
    <Skeleton type="text" width="150px" height="20px" />
    <Skeleton type="text" width="100px" height="20px" />
  </div>
);

export const ChartSkeleton = () => (
  <div className="chart-skeleton">
    <div className="chart-bars">
      {[...Array(5)].map((_, i) => (
        <Skeleton 
          key={i} 
          type="bar" 
          width="40px"
          height={`${Math.random() * 100 + 50}px`}
        />
      ))}
    </div>
  </div>
);

export default Skeleton;
