
import React from 'react';
import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/HeroSection';
import { LeaderBoard } from '@/components/LeaderBoard';

const Index = () => {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <HeroSection />
        <LeaderBoard />
      </div>
    </Layout>
  );
};

export default Index;
