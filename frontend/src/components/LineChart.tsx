import * as React from 'react';
import Box from '@mui/material/Box';
import { type AnimatedLineProps, LineChart } from '@mui/x-charts/LineChart';
import type { HighlightScope } from '@mui/x-charts/context';

const margin = { right: 24 };
const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300];
const xLabels = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

const highlightScope: HighlightScope = {
  highlight: 'item',
  fade: 'global',
};

const settings = {
  height: 300,
  series: [
    { data: pData, label: 'pv', highlightScope, color: '#10b981' }, // Green
    { data: uData, label: 'uv', highlightScope, color: '#3b82f6' }, // Blue
  ],
  xAxis: [{ scaleType: 'point', data: xLabels }],
  yAxis: [{ width: 50 }],
  margin,
} as const;

function CustomLine(props: AnimatedLineProps) {
  const { d, ownerState, className, ...other } = props;

  return (
    <React.Fragment>
      <path
        d={d}
        stroke={
          ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color
        }
        strokeWidth={ownerState.isHighlighted ? 4 : 2}
        strokeLinejoin="round"
        fill="none"
        filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        className={className}
      />
      <path
        d={d}
        stroke="transparent"
        strokeWidth={25}
        fill="none"
        className="interaction-area"
        {...other}
      />
    </React.Fragment>
  );
}

export default function LargerHighlightLineNoSnap() {

  return (
    <Box
      sx={{
        width: '100%',
        '& .interaction-area': true
          ? {
              stroke: 'lightgray',
              strokeOpacity: 0.3,
            }
          : {},
      }}
    >
      <LineChart {...settings} slots={{ line: CustomLine }} />
    </Box>
  );
}
