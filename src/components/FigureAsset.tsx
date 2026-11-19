import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface FigureAssetProps {
  src: string;
  alt: string;
  caption?: string;
  className?: string;
  imgClassName?: string;
}

export const FigureAsset: React.FC<FigureAssetProps> = ({
  src,
  alt,
  caption,
  className = '',
  imgClassName = 'w-full h-auto object-contain max-h-72',
}) => {
  const [failed, setFailed] = useState(false);

  return (
    <figure className={`flex flex-col ${className}`}>
      {failed ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-100/80 p-6 text-center text-slate-500 min-h-[160px]">
          <ImageOff className="h-6 w-6 text-slate-400" aria-hidden="true" />
          <span className="text-xs font-medium text-slate-600">{alt}</span>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-slate-200 bg-white p-3 flex items-center justify-center">
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className={imgClassName}
          />
        </div>
      )}
      {caption && (
        <figcaption className="mt-2 text-xs leading-relaxed text-slate-600">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
