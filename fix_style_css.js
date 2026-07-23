const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

// 1. Update .speaker-icon-btn
css = css.replace(/\.speaker-icon-btn \{[\s\S]*?\}/, `.speaker-icon-btn {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 22px;
  padding: 0;
  transition: all 0.2s ease;
  color: var(--text-main);
}`);

// 2. Add .btn-dictation-blue and theme overrides
const blueDictationCSS = `
/* 블루 계열 받아쓰기 버튼 (취약점 박스 디자인 참고) */
.btn-dictation-blue {
  background: rgba(59, 130, 246, 0.08);
  border: 1.5px solid rgba(59, 130, 246, 0.35);
  color: #60a5fa;
  padding: 16px;
  font-size: 1.1rem;
  border-radius: 12px;
  width: 100%;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-dictation-blue:hover {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.6);
  color: #93c5fd;
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(59, 130, 246, 0.15);
}

/* Light themes override for dictation button */
[data-theme="pink"] .btn-dictation-blue,
[data-theme="blue"] .btn-dictation-blue,
[data-theme="green"] .btn-dictation-blue {
  background: #EFF6FF !important;
  border: 1.5px solid #93C5FD !important;
  color: #1E40AF !important;
}
[data-theme="pink"] .btn-dictation-blue:hover,
[data-theme="blue"] .btn-dictation-blue:hover,
[data-theme="green"] .btn-dictation-blue:hover {
  background: #DBEAFE !important;
  border-color: #3B82F6 !important;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}
`;

css += '\n' + blueDictationCSS;

fs.writeFileSync('style.css', css, 'utf8');
console.log('Added .btn-dictation-blue and updated .speaker-icon-btn.');
