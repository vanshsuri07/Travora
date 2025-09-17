// app/page.tsx
import React from "react";

import HeroSection from "../../../components/HeroSection"
import FeaturesSection from "../../../components/FeaturesSection";
import NewsletterCTA from "../../../components/NewsletterCTA";
import PageLayout from './page-layout';
export default function Page() {
  return (
    <> 
      <PageLayout />
    
      <HeroSection />
      <FeaturesSection />
      <NewsletterCTA />
    </>
  );
}
