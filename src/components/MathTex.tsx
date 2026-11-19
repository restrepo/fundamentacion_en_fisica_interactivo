import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTexProps {
  tex: string;
  block?: boolean;
  className?: string;
}

export const MathTex: React.FC<MathTexProps> = ({ tex, block = false, className = '' }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(tex, {
        displayMode: block,
        throwOnError: false,
        strict: false,
        trust: false,
      });
    } catch {
      return tex;
    }
  }, [tex, block]);

  if (block) {
    return (
      <div
        className={`overflow-x-auto py-1 text-slate-900 ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={`inline-block align-baseline text-slate-900 ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
