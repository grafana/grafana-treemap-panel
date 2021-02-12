import React, { useRef, useEffect, useState } from 'react';
import { useTheme } from '@grafana/ui';

interface Props {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
}

export const AdaptiveText = ({ x, y, width, height, text }: Props) => {
  const theme = useTheme();
  const [scale, setScale] = useState(1);

  const ref = useRef<SVGTextElement>(null);

  useEffect(() => {
    if (ref.current) {
      setScale(calculateScale(ref.current, width, height));
    }
  }, [ref, width, height]);

  const originX = x - scale * x;
  const originY = y - scale * y;

  return (
    <text
      ref={ref}
      fontFamily={theme.typography.fontFamily.sansSerif}
      fontWeight={theme.typography.weight.regular}
      x={x}
      y={y + 12}
      fill={theme.colors.panelBg}
      transform={`matrix(${scale}, 0, 0, ${scale}, ${originX}, ${originY})`}
    >
      {text}
    </text>
  );
};

const calculateScale = (el: SVGTextElement, width: number, height: number) => {
  const bb = el.getBBox();
  const widthTransform = width / bb.width;
  const heightTransform = height / bb.height;
  return widthTransform < heightTransform ? widthTransform : heightTransform;
};
