const fs = require('fs');

const cssToAppend = `
/* Step 4: 새로운 O/X 버튼 디자인 (블루/핑크/그린 전용) - 세련된 파스텔 톤 및 플랫 스타일 */
.btn-ox-new {
  flex: 1; /* 부모 영역 안에서 1:1 너비 차지 */
  display: flex;
  flex-direction: column; /* 내부 요소 수직 배치 */
  align-items: center; /* 중앙 정렬 */
  justify-content: center; /* 중앙 정렬 */
  padding: 0;
  border-radius: 24px; /* 모서리 완전 둥글게 */
  border: 1px solid var(--box-border);
  transition: all 0.2s ease;
  cursor: pointer;
  aspect-ratio: 1 / 1.1; /* 높이가 너비보다 살짝 더 길게 */
  min-height: 140px;
  box-shadow: none !important; /* 그림자 완전 제거 (글로우 X) */
  text-shadow: none !important; /* 텍스트 빛 번짐 완전 제거 */
}
.btn-ox-new:active { transform: scale(0.96); }
.btn-ox-new:hover, .btn-ox-new:focus {
  box-shadow: none !important;
  text-shadow: none !important;
}

/* O 버튼 - 연한 파스텔 민트/그린 배경 */
.btn-ox-new.btn-o { background-color: #E8F5E9 !important; border-color: #C8E6C9 !important; }
/* X 버튼 - 연한 파스텔 핑크/레드 배경 */
.btn-ox-new.btn-x { background-color: #FFEBEE !important; border-color: #FFCDD2 !important; }

/* 아이콘 영역 (원형 배경) */
.ox-circle {
  width: 56px; /* 전체 높이의 약 40% (140px 기준) */
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  box-shadow: none !important;
  text-shadow: none !important;
}

.circle-o { background-color: #4ADE80; } /* 진하고 화사한 초록색 원 */
.circle-x { background-color: #F87171; } /* 진하고 화사한 빨간색 원 */

/* 텍스트 영역 */
.btn-ox-new .ox-label {
  margin-top: 12px; /* 아이콘 바로 아래 여백 */
  font-size: 15px; /* 적당한 폰트 크기 */
  font-weight: 700;
  box-shadow: none !important;
  text-shadow: none !important;
}

/* 텍스트 색상 채도 조절 (눈이 편안하고 차분한 딥 컬러) */
.btn-ox-new.btn-o .ox-label { color: #2E7D32 !important; }
.btn-ox-new.btn-x .ox-label { color: #C62828 !important; }
`;

fs.appendFileSync('style.css', cssToAppend);
