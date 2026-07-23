const fs = require('fs');
const css = `
/* ── 카테고리 탭 UI ── */
.category-tabs-container {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  justify-content: center;
}
.tab-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text2);
  padding: 14px 20px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}
.tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text1);
}
.tab-btn.active {
  background: rgba(168, 85, 247, 0.15);
  border-color: var(--purple);
  color: #fff;
  box-shadow: 0 4px 20px rgba(168, 85, 247, 0.3);
}
`;
fs.appendFileSync('style.css', css, 'utf8');
console.log('Appended CSS');
