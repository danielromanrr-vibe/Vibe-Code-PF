import { motion, useReducedMotion } from 'motion/react';
import type { AboutPracticeAction } from '../../content/aboutMandalaFacets';
import type { AboutFolderFile } from './aboutFolders';

type AboutFolderBloomProps = {
  title: string;
  files: readonly AboutFolderFile[];
  originX: number;
  originY: number;
  centerX: number;
  centerY: number;
  openFileId: string | null;
  onOpenFile: (fileId: string) => void;
  onOpenAlias: (folderId: string) => void;
  onCloseFile: () => void;
  onPracticeClick?: (action: AboutPracticeAction) => void;
};

function placeWindow(originX: number, originY: number, centerX: number, centerY: number) {
  const margin = 16;
  const width = Math.min(304, window.innerWidth - margin * 2);
  const header = document.querySelector('.top-nav-strip')?.getBoundingClientRect().height ?? 44;
  const outward = originX >= centerX ? 1 : -1;
  const outwardY = originY >= centerY ? 1 : -1;
  let left = outward > 0 ? originX + 36 : originX - 36 - width;
  if (left < margin || left + width > window.innerWidth - margin) {
    left = outward > 0 ? originX - 36 - width : originX + 36;
  }
  left = Math.max(margin, Math.min(left, window.innerWidth - margin - width));
  const preferredTop = outwardY > 0 ? originY + 12 : originY - 180;
  const top = Math.max(header + 12, Math.min(preferredTop, window.innerHeight - 240));
  return {
    left,
    top,
    width,
    origin: `${Math.round(originX - left)}px ${Math.round(originY - top)}px`,
  };
}

export default function AboutFolderBloom({
  title,
  files,
  originX,
  originY,
  centerX,
  centerY,
  openFileId,
  onOpenFile,
  onOpenAlias,
  onCloseFile,
  onPracticeClick,
}: AboutFolderBloomProps) {
  const reduceMotion = useReducedMotion();
  const openFile = files.find((file) => file.id === openFileId) ?? null;
  const frame = placeWindow(originX, originY, centerX, centerY);

  return (
    <div className="about-folder-bloom pointer-events-none">
      <motion.div
        className="about-folder-window pointer-events-auto"
        role="region"
        aria-label={openFile ? openFile.label : title}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.72 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.42, ease: [0.4, 0, 1, 1] }}
        style={{
          left: frame.left,
          top: frame.top,
          width: frame.width,
          transformOrigin: frame.origin,
        }}
      >
        <div className="about-folder-window__bar">
          <p>{openFile ? openFile.label : title}</p>
          {openFile ? (
            <button type="button" onClick={onCloseFile}>
              Close
            </button>
          ) : null}
        </div>
        {openFile && openFile.kind !== 'alias' ? (
          <div className="about-folder-window__body">
            {openFile.body ? <p>{openFile.body}</p> : null}
            {openFile.items ? (
              <ul>
                {openFile.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : null}
            {openFile.links ? (
              <ul>
                {openFile.links.map((link) => (
                  <li key={link.label}>
                    {link.action && onPracticeClick ? (
                      <button type="button" onClick={() => onPracticeClick(link.action!)}>
                        {link.label}
                      </button>
                    ) : (
                      link.label
                    )}
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : (
          <div className="about-folder-window__files">
            {files.map((file) => (
              <button
                key={file.id}
                type="button"
                className="about-folder-window__file"
                aria-expanded={openFileId === file.id}
                onClick={() => {
                  if (file.kind === 'alias' && file.aliasId) {
                    onOpenAlias(file.aliasId);
                    return;
                  }
                  onOpenFile(file.id);
                }}
              >
                <span className={`about-folder-window__mark about-folder-window__mark--${file.kind}`} aria-hidden />
                <span>{file.label}</span>
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
