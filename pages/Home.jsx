import React from 'react';
import { motion } from 'framer-motion';
import GarageSummaryCard from '../components/home/GarageSummaryCard';
import FeaturedMarketCard from '../components/home/FeaturedMarketCard';
import FuelRadarCard from '../components/home/FuelRadarCard';
import HomeNewsCard from '../components/home/HomeNewsCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-background pt-4 pb-32">
      <div className="px-4 space-y-6">

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <GarageSummaryCard />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}>
          <SectionLabel>Featured Listings</SectionLabel>
          <FeaturedMarketCard />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <SectionLabel>Live Fuel Radar</SectionLabel>
          <FuelRadarCard />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
          <SectionLabel>Automotive News</SectionLabel>
          <HomeNewsCard />
        </motion.div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="font-space font-bold text-xs uppercase tracking-widest mb-3" style={{ color: '#A0A0A0' }}>
      {children}
    </p>
  );
}