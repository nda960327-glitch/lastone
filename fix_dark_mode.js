const fs = require('fs');
let css = fs.readFileSync('style.css', 'utf8');

const oldThemeStyles = `.btn-ox-new.btn-o { background-color: #EFF6FF !important; border-color: #BFDBFE !important; }
.btn-ox-new.btn-o .ox-mark { color: #3B82F6; font-size: 48px; font-weight: 900; line-height: 1; }
.btn-ox-new.btn-o .ox-label { color: #64748B; font-size: 14px; margin-top: 8px; font-weight: 500; }

.btn-ox-new.btn-x { background-color: #FEF2F2 !important; border-color: #FECACA !important; }
.btn-ox-new.btn-x .ox-mark { color: #EF4444; font-size: 48px; font-weight: 900; line-height: 1; }
.btn-ox-new.btn-x .ox-label { color: #F87171; font-size: 14px; margin-top: 8px; font-weight: 500; }

.meaning-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid var(--box-border);
  font-size: 16px;
  font-weight: 500;
}
.pos-bg-n { background-color: #EFF6FF !important; color: #2563EB !important; border-color: #BFDBFE !important; }
.pos-bg-v { background-color: #FEF2F2 !important; color: #EF4444 !important; border-color: #FECACA !important; }
.pos-bg-a { background-color: #ECFDF5 !important; color: #10B981 !important; border-color: #A7F3D0 !important; }
.pos-bg-ad { background-color: #F5F3FF !important; color: #8B5CF6 !important; border-color: #DDD6FE !important; }
.pos-bg-default { background-color: #F8FAFC !important; color: #475569 !important; border-color: #E2E8F0 !important; }`;

const newThemeStyles = `/* 기본 (다크/기타 모드) O/X 버튼 - 어두운 배경에 밝은 텍스트 */
.btn-ox-new.btn-o { background-color: rgba(34, 197, 94, 0.1) !important; border-color: rgba(34, 197, 94, 0.3) !important; }
.btn-ox-new.btn-o .ox-mark { color: #4ade80; font-size: 48px; font-weight: 900; line-height: 1; }
.btn-ox-new.btn-o .ox-label { color: #a7f3d0; font-size: 14px; margin-top: 8px; font-weight: 500; }

.btn-ox-new.btn-x { background-color: rgba(239, 68, 68, 0.1) !important; border-color: rgba(239, 68, 68, 0.3) !important; }
.btn-ox-new.btn-x .ox-mark { color: #f87171; font-size: 48px; font-weight: 900; line-height: 1; }
.btn-ox-new.btn-x .ox-label { color: #fecaca; font-size: 14px; margin-top: 8px; font-weight: 500; }

/* 블루 모드 전용 O/X 버튼 (파스텔톤) */
[data-theme="blue"] .btn-ox-new.btn-o { background-color: #EFF6FF !important; border-color: #BFDBFE !important; }
[data-theme="blue"] .btn-ox-new.btn-o .ox-mark { color: #3B82F6; }
[data-theme="blue"] .btn-ox-new.btn-o .ox-label { color: #64748B; }

[data-theme="blue"] .btn-ox-new.btn-x { background-color: #FEF2F2 !important; border-color: #FECACA !important; }
[data-theme="blue"] .btn-ox-new.btn-x .ox-mark { color: #EF4444; }
[data-theme="blue"] .btn-ox-new.btn-x .ox-label { color: #F87171; }

.meaning-row {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-radius: 12px;
  margin-bottom: 8px;
  border: 1px solid var(--box-border);
  font-size: 16px;
  font-weight: 500;
}

/* 기본 (다크/기타 모드) 품사 박스 */
.pos-bg-n { background-color: rgba(59, 130, 246, 0.15) !important; color: #93C5FD !important; border-color: rgba(59, 130, 246, 0.3) !important; }
.pos-bg-v { background-color: rgba(239, 68, 68, 0.15) !important; color: #FCA5A5 !important; border-color: rgba(239, 68, 68, 0.3) !important; }
.pos-bg-a { background-color: rgba(16, 185, 129, 0.15) !important; color: #6EE7B7 !important; border-color: rgba(16, 185, 129, 0.3) !important; }
.pos-bg-ad { background-color: rgba(139, 92, 246, 0.15) !important; color: #C4B5FD !important; border-color: rgba(139, 92, 246, 0.3) !important; }
.pos-bg-default { background-color: rgba(255, 255, 255, 0.05) !important; color: #E2E8F0 !important; border-color: rgba(255, 255, 255, 0.1) !important; }

/* 블루 모드 전용 품사 박스 (파스텔톤) */
[data-theme="blue"] .pos-bg-n { background-color: #EFF6FF !important; color: #2563EB !important; border-color: #BFDBFE !important; }
[data-theme="blue"] .pos-bg-v { background-color: #FEF2F2 !important; color: #EF4444 !important; border-color: #FECACA !important; }
[data-theme="blue"] .pos-bg-a { background-color: #ECFDF5 !important; color: #10B981 !important; border-color: #A7F3D0 !important; }
[data-theme="blue"] .pos-bg-ad { background-color: #F5F3FF !important; color: #8B5CF6 !important; border-color: #DDD6FE !important; }
[data-theme="blue"] .pos-bg-default { background-color: #F8FAFC !important; color: #475569 !important; border-color: #E2E8F0 !important; }`;

if (css.includes('.pos-bg-default { background-color: #F8FAFC')) {
  css = css.replace(oldThemeStyles, newThemeStyles);
  fs.writeFileSync('style.css', css, 'utf8');
  console.log('Successfully applied dark mode fallbacks!');
} else {
  console.log('Target string not found');
}
