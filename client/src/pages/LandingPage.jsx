import React from 'react';
import HeroSection from '../components/Landing/Hero/HeroSection';
import AudienceBanner from '../components/Landing/DualAudienceBanner/AudienceBanner';
import StickyHorizontalScroll from '../components/Landing/HowItWorks/StickyHorizontalScroll';
import AnalyticsSection from '../components/Landing/Analytics/AnalyticsSection';
import AlgorithmSection from '../components/Landing/AlgorithmEngine/AlgorithmSection';
import StrategiesHexGrid from '../components/Landing/Strategies/StrategiesHexGrid';
import QueueDiagram from '../components/Landing/QueueFlow/QueueDiagram';
import ContributeSection from '../components/Landing/OpenSource/ContributeSection';
import InteractiveDemo from '../components/Landing/Demo/InteractiveDemo';
import FAQAccordion from '../components/Landing/FAQ/FAQAccordion';
import FinalCTA from '../components/Landing/CTA/FinalCTA';
import Footer from '../components/Landing/Footer/Footer';

const LandingPage = () => {
  return (
    <div className="landing-container bg-[#050810] min-h-screen text-white">
      <HeroSection />
      <AudienceBanner />
      <StickyHorizontalScroll />
      <AnalyticsSection />
      <AlgorithmSection />
      <StrategiesHexGrid />
      <QueueDiagram />
      <ContributeSection />
      <InteractiveDemo />
      <FAQAccordion />
      <FinalCTA />
      <Footer />
    </div>
  );
};

export default LandingPage;
