import { style, globalStyle, styleVariants } from '@vanilla-extract/css';
import { vars } from './vars.css';

// 공통 레이아웃 구조
export const inner = style({
  width: '100%',
  padding: '0 8rem',
});

globalStyle(`${inner} section`, {
  padding: '8rem 0',
});


const fullWidthSection = style({
  width: 'calc(100% + 16rem)',
  left: '-8rem',
  position: 'relative',
  padding: '8rem 0',
});

// 메인 상단 히어로 섹션
export const sectionTop = style([fullWidthSection, {
  background: "url('/top-bg.png') no-repeat center",
  backgroundSize: 'cover',
  padding: '12rem 0',
}]);

globalStyle(`${sectionTop} p`, {
  color: vars.colors.textLight,
  textAlign: 'center',
});

export const bigTitle = style({ fontSize: '6rem', fontWeight: 'bold', marginBottom: '3rem' });
export const smallTitle = style({ fontSize: '3rem', lineHeight: '1.6' });

// 공통 버튼 컴포넌트 스타일 (Base)
const btnBase = style({
  cursor: 'pointer',
  fontWeight: '500',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '.8rem',
});

// 버튼 흰색 라운드 버튼
export const btnStartSty1 = style([btnBase, {
  display: 'block',
  margin: '4rem auto',
  borderRadius: '60rem',
  background: vars.colors.textLight,
  padding: '2rem 4rem',
  fontSize: '1.6rem',
  color: '#ad46ff',
  transition: 'transform 0.3s ease',
  selectors: {
    '&:hover': { transform: 'scale(1.1)' }
  }
}]);

// 버튼 그라디언트 꽉 찬 버튼
export const btnStartFull = style([btnBase, {
  borderRadius: '2rem',
  fontSize: '2.4rem',
  padding: '2rem',
  width: '100%',
  marginTop: '1.6rem',
  color: vars.colors.textLight,
  background: vars.gradients.main,
}]);

// 섹션 타이틀 공통 영역
export const sectionTitArea = style({
  margin: '0 auto 4rem',
  textAlign: 'center',
});

export const sectionTit = style({ fontSize: '4rem', fontWeight: 'bold', marginBottom: '1.6rem' });
export const sectionSubTit = style({ fontSize: '1.8rem', color: vars.colors.textMuted, fontWeight: '500' });

// 계획안 미리보기 영역
export const sectionPlan = style({});
export const planPreview = style({ borderRadius: '2.4rem', background: vars.colors.bgPreview, padding: '3.2rem' });
export const planBox = style({ position: 'relative', borderRadius: '2rem', background: vars.colors.bgCard, padding: '2.6rem' });
export const planTit = style({ fontSize: '2.8rem', fontWeight: 'bold', marginBottom: '2rem' });
export const planCategory = style({ position: 'absolute', right: '1.4rem', top: '1.2rem', display: 'flex', gap: '.8rem' });

// 계획안 내 리스트
export const planItemList = style({
});

globalStyle(`${planItemList} li`, {
  fontSize: '1.6rem',
});

globalStyle(`${planItemList} li + li`, {
  marginTop: '1.6rem',
});

globalStyle(`${planItemList} .tit`, {
  fontWeight: '500',
});

export const planNote = style({ marginTop: '1.6rem', fontSize: '1.6rem' });

// 특장점 섹션
export const sectionFeature = style([fullWidthSection, {
  background: vars.colors.bgFeature,
}]);

export const sectionFeatureList = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '2.4rem',
  margin: '0 8rem',
});

// 특장점 카드
export const featureCard = style({
  background: vars.colors.bgCard,
  boxShadow: '0 0.8rem 2.4rem rgba(0, 0, 0, 0.1)',
  padding: '3.2rem 2.8rem',
  borderRadius: '1.6rem',
  transition: 'all 0.3s ease',
  selectors: {
    '&:hover': { transform: 'translateY(-0.8rem)' },
  }
});

globalStyle(`${featureCard} .tit`, {
  fontSize: '2.6rem', fontWeight: '500', marginBottom: '1.6rem'
});

globalStyle(`${featureCard} .cont`, {
  fontSize: '1.8rem',
  wordBreak: 'keep-all',
  height: '5.4rem',
});

const iconBoxBase = style({
  width: '6rem',
  height: '6rem',
  marginBottom: '2rem',
  borderRadius: '1.6rem',
  color: vars.colors.textLight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

globalStyle(`${iconBoxBase} svg`, {
  width: '3rem', height: '3rem'
});

// 배열 형태로 특장점 그라디언트 아이콘 스타일 맵
export const featureIconStyles = [
  style([iconBoxBase, { background: vars.gradients.feature1 }]),
  style([iconBoxBase, { background: vars.gradients.feature2 }]),
  style([iconBoxBase, { background: vars.gradients.feature3 }]),
  style([iconBoxBase, { background: vars.gradients.feature4 }]),
];

// 하단 섹션
export const sectionStart = style([fullWidthSection, {
  background: vars.gradients.main,
}]);

globalStyle(`${sectionStart} .${sectionTit}`, {
  color: vars.colors.textLight,
});

globalStyle(`${sectionStart} .${sectionSubTit}`, {
  color: vars.colors.textLight,
});


export const badgeBase = style({
  display: 'inline-block', 
  padding: '.4rem .8rem', 
  borderRadius: '60rem', 
  fontSize: '1.4rem', 
  fontWeight: '500',
  textAlign: 'center',
  whiteSpace: 'nowrap',
});

export const badgeStyles = styleVariants(vars.badges, (colorSet) => [
  badgeBase,
  {
    backgroundColor: colorSet.bg,
    color: colorSet.text,
  }
]);