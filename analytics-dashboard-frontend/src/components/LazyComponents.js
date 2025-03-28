import React, { Suspense, lazy } from 'react';
import { ChartSkeleton } from './Skeleton';

// Lazy load chart components
export const LazyButtonClicksPieChart = lazy(() => 
  import('./charts/ButtonClicksPieChart')
);

// Wrapper component with suspense
export const LazyChart = ({ children }) => (
  <Suspense fallback={<ChartSkeleton />}>
    {children}
  </Suspense>
);

// Pre-configured lazy components
export const ButtonClicksPieChartLazy = (props) => (
  <LazyChart>
    <LazyButtonClicksPieChart {...props} />
  </LazyChart>
);
