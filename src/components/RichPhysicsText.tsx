import React from 'react';
import { MathTex } from './MathTex';

interface RichPhysicsTextProps {
  content: string;
}

function renderInlineSegments(text: string, keyPrefix: string): React.ReactNode[] {
  // Split by inline LaTeX ($...$ or \(...\)), bold (**...**), or inline code (`...`)
  const tokenRegex = /(\$[^$\n]+?\$|\\\(.+?\\\)|\*\*[^*]+?\*\*|`[^`]+?`)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, idx) => {
    const key = `${keyPrefix}-${idx}`;
    if (!part) return null;

    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      return <MathTex key={key} tex={part.slice(1, -1).trim()} />;
    }
    if (part.startsWith('\\(') && part.endsWith('\\)') && part.length > 4) {
      return <MathTex key={key} tex={part.slice(2, -2).trim()} />;
    }
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={key} className="font-semibold text-slate-900">
          {renderInlineSegments(part.slice(2, -2), `${key}-b`)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={key}
          className="rounded bg-slate-200/70 px-1 py-0.5 font-mono text-[11px] text-slate-800"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

export const RichPhysicsText: React.FC<RichPhysicsTextProps> = ({ content }) => {
  // First extract display math blocks ($$...$$ or \[...\])
  const blockRegex = /(\$\$[\s\S]+?\$\$|\\\[[\s\S]+?\\\])/g;
  const segments = content.split(blockRegex);

  return (
    <div className="space-y-2 text-xs sm:text-sm leading-relaxed text-slate-800">
      {segments.map((seg, sIdx) => {
        if (!seg) return null;

        if (seg.startsWith('$$') && seg.endsWith('$$') && seg.length > 4) {
          return (
            <div
              key={`blk-${sIdx}`}
              className="my-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <MathTex block tex={seg.slice(2, -2).trim()} className="text-xs sm:text-sm" />
            </div>
          );
        }

        if (seg.startsWith('\\[') && seg.endsWith('\\]') && seg.length > 4) {
          return (
            <div
              key={`blk-${sIdx}`}
              className="my-2 rounded-lg border border-slate-200 bg-white px-3 py-2"
            >
              <MathTex block tex={seg.slice(2, -2).trim()} className="text-xs sm:text-sm" />
            </div>
          );
        }

        const lines = seg.split('\n');
        const elements: React.ReactNode[] = [];
        let listBuffer: Array<{ ordered: boolean; text: string }> = [];

        const flushList = (keySeed: string) => {
          if (listBuffer.length === 0) return;
          const isOrdered = listBuffer[0].ordered;
          const ListTag = isOrdered ? 'ol' : 'ul';
          elements.push(
            <ListTag
              key={`list-${sIdx}-${keySeed}`}
              className={`${
                isOrdered ? 'list-decimal' : 'list-disc'
              } pl-5 space-y-1 text-slate-700`}
            >
              {listBuffer.map((item, li) => (
                <li key={li}>{renderInlineSegments(item.text, `li-${sIdx}-${keySeed}-${li}`)}</li>
              ))}
            </ListTag>
          );
          listBuffer = [];
        };

        lines.forEach((rawLine, lIdx) => {
          const line = rawLine.trim();
          if (!line) {
            flushList(`empty-${lIdx}`);
            return;
          }

          const ulMatch = line.match(/^[-*•]\s+(.+)$/);
          const olMatch = line.match(/^\d+[.)]\s+(.+)$/);
          const hMatch = line.match(/^#{1,4}\s+(.+)$/);

          if (ulMatch) {
            if (listBuffer.length > 0 && listBuffer[0].ordered) flushList(`sw-${lIdx}`);
            listBuffer.push({ ordered: false, text: ulMatch[1] });
          } else if (olMatch) {
            if (listBuffer.length > 0 && !listBuffer[0].ordered) flushList(`sw-${lIdx}`);
            listBuffer.push({ ordered: true, text: olMatch[1] });
          } else {
            flushList(`pre-${lIdx}`);
            if (hMatch) {
              elements.push(
                <h4
                  key={`h-${sIdx}-${lIdx}`}
                  className="pt-1 text-xs sm:text-sm font-semibold text-slate-900"
                >
                  {renderInlineSegments(hMatch[1], `h-${sIdx}-${lIdx}`)}
                </h4>
              );
            } else {
              elements.push(
                <p key={`p-${sIdx}-${lIdx}`}>
                  {renderInlineSegments(line, `p-${sIdx}-${lIdx}`)}
                </p>
              );
            }
          }
        });

        flushList('end');
        return <React.Fragment key={`seg-${sIdx}`}>{elements}</React.Fragment>;
      })}
    </div>
  );
};
