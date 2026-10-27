// app/page.tsx
import React from "react";

import HeroSection from "../../components/HeroSection"
import FeaturesSection from "../../components/FeaturesSection";
import NewsletterCTA from "../../components/NewsletterCTA";
export default function Page() {
  return (
    <> 
      
      <HeroSection />
      <FeaturesSection />
      <NewsletterCTA />
    </>
  );
}
