import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Hero = styled.section`
  text-align: center;
  padding: 60px 20px;
  background-color: #f0f8ff;
  border-radius: 8px;
  margin-bottom: 40px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 20px;
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: var(--text-color);
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.6;
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background-color: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.1rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: var(--secondary-color);
  }
`;

const FeaturesSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-bottom: 60px;
`;

const FeatureCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureTitle = styled.h3`
  font-size: 1.5rem;
  color: var(--primary-color);
  margin-bottom: 15px;
`;

const FeatureDescription = styled.p`
  color: var(--text-color);
  line-height: 1.6;
`;

const HomePage: React.FC = () => {
  return (
    <HomeContainer>
      <Hero>
        <Title>US Map Generator</Title>
        <Subtitle>
          Create beautiful, interactive US maps with your data. Perfect for websites, 
          presentations, and reports. Easy to customize and embed anywhere.
        </Subtitle>
        <CTAButton to="/editor">Create Your Map</CTAButton>
      </Hero>

      <FeaturesSection>
        <FeatureCard>
          <FeatureTitle>Easy Data Upload</FeatureTitle>
          <FeatureDescription>
            Upload your data in Excel or CSV format. The tool automatically maps your data 
            to US states for visualization.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Customizable Design</FeatureTitle>
          <FeatureDescription>
            Choose from various color schemes, add labels, tooltips, and legends to make 
            your map informative and visually appealing.
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureTitle>Embed Anywhere</FeatureTitle>
          <FeatureDescription>
            Generate embed code to include your interactive map on any website, including 
            Shopify, WordPress, and more.
          </FeatureDescription>
        </FeatureCard>
      </FeaturesSection>
    </HomeContainer>
  );
};

export default HomePage;
