import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export default function MaintenanceAlertCard() {
  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="rounded-2xl p-4 flex items-center gap-4 cursor-pointer"
      style={{
        background: 'linear-gradient(135deg, rgba(255,179,0,0.12) 0%, rgba(255,179,0,0.04) 100%)',
        border: '1px solid rgba(255,179,0,0.2)',
      }}
    >
      <div className="w-10 h-10 rounded-xl bg-amber-warning/15 flex items-center justify-center flex-shrink-0">
        <AlertTriangle className="w-5 h-5 text-amber-warning" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-space font-semibold text-white text-sm">Oil Change Due</p>
        <p className="text-amber-warning font-space font-bold text-base mt-0.5">⚠️ In 150 KMs</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">Honda Civic • Last changed 4,850 km ago</p>
      </div>
      <ChevronRight className="w-4 h-4 text-amber-warning/60 flex-shrink-0" />
    </motion.div>
  );
}