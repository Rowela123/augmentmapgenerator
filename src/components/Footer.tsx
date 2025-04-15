import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: white;
  padding: 20px;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
`;

const FooterContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: var(--text-color);
  margin: 0;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const FooterLink = styled.a`
  color: var(--text-color);
  text-decoration: none;
  
  &:hover {
    color: var(--primary-color);
    text-decoration: underline;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <Copyright>
          © {currentYear} US Map Generator. All rights reserved.
        </Copyright>
        <FooterLinks>
          <FooterLink href="https://github.com/Rowela123/newmapgenerator" target="_blank" rel="noopener noreferrer">
            GitHub
          </FooterLink>
          <FooterLink href="#" onClick={(e) => { e.preventDefault(); alert('Privacy Policy page would go here'); }}>
            Privacy Policy
          </FooterLink>
          <FooterLink href="#" onClick={(e) => { e.preventDefault(); alert('Terms of Service page would go here'); }}>
            Terms of Service
          </FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;
