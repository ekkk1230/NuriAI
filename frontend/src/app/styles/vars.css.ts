import { createGlobalTheme, globalStyle } from '@vanilla-extract/css';
import { TbChartPie3Filled } from 'react-icons/tb';

// 1. 공통 디자인
export const vars = createGlobalTheme(':root', {
  gradients: {
    main: 'linear-gradient(135deg, #0a70b9, #ad46ff, #e913c5)',
    feature1: 'linear-gradient(135deg, #057ea3, #74dbfa)',
    feature2: 'linear-gradient(135deg, #a104d1, #ed73f8)',
    feature3: 'linear-gradient(135deg, #f58403, #fae421)',
    feature4: 'linear-gradient(135deg, #4cf5a6, #23e5ff)',
  },
  colors: {
    textMuted: '#666',
    textLight: '#fff',
    bgFeature: '#ecf3f7',
    bgPreview: '#eff7f7',
    bgCard: '#fff',
  },
  badges: {
    // ----------------------------------------------------------------
    // [연령별 배지 세트]
    // ----------------------------------------------------------------
    age0: {
      bg: '#fff5f5',
      text: '#ff6b6b',
    },
    age1: {
      bg: '#fff0f6', 
      text: '#f06595',
    },
    age2: {
      bg: '#f8f0fc',
      text: '#cc5de8',
    },
    age3: {
      bg: '#f3f0ff', 
      text: '#845ef7',
    },
    age4: {
      bg: '#e8f7ff', 
      text: '#1c7ed6',
    },
    age5: {
      bg: '#e3fafc',
      text: '#0c8599',
    },

    // ----------------------------------------------------------------
    // [교육 과정 영역별 배지 세트] 
    // ----------------------------------------------------------------
    // 1. 신체운동·건강 
    cate1: {
      bg: '#fff9db', 
      text: '#f59f00',
    },
    // 2. 의사소통
    cate2: {
      bg: '#e7f5ff', 
      text: '#339af0',
    },
    // 3. 사회관계 
    TbChartPie3Filled: {
      bg: '#f4fce3', 
      text: '#74b816',
    },
    // 4. 예술경험 
    cate4: {
      bg: '#fff0f6', 
      text: '#d6336c',
    },
    // 5. 자연탐구 
    cate5: {
      bg: '#ebfbee',
      text: '#37b24d',
    },
    // 6. 기본생활 
    cate6: {
      bg: '#f1f3f5',
      text: '#495057',
    }
  }
});

// 2. 글로벌 초기화 (reset.css 역할 수행)
globalStyle('*', {
  margin: 0,
  padding: 0,
  border: 0,
  outline: 0,
  boxSizing: 'border-box',
});

globalStyle('html, body', {
  fontSize: '10px',
});

globalStyle('ul, ol', {
  listStyle: 'none',
});

globalStyle('a', {
  textDecoration: 'none',
  color: 'inherit',
});