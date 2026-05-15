'use client';

import styled from 'styled-components';

const Title = styled.h1`
  font-size: 3rem;
  color: #ff6b6b;
  text-align: center;
  margin-top: 50px;
`;

export default function Home() {
  return (
    <main>
      <Title>NuriAI 프론트엔드 시작!</Title>
    </main>
  );
}