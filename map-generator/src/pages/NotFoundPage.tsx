import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 70vh;
  text-align: center;
  padding: 0 20px;
`;

const Title = styled.h1`
  font-size: 3rem;
  color: var(--primary-color);
  margin-bottom: 20px;
`;

const Message = styled.p`
  font-size: 1.2rem;
  color: var(--text-color);
  margin-bottom: 30px;
  max-width: 600px;
`;

const HomeButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const NotFoundPage: React.FC = () => {
  return (
    <NotFoundContainer>
      <Title>404 - Page Not Found</Title>
      <Message>
        The page you are looking for doesn't exist or has been moved.
      </Message>
      <HomeButton to="/">Return to Home</HomeButton>
    </NotFoundContainer>
  );
};

export default NotFoundPage;
