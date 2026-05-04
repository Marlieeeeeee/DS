import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, ExternalLink } from 'lucide-react';

// 100-item master mock feed — no API, no responsive truncation, no bugs.
const SOURCES = ['AutoCarIndia', 'CarAndBike', 'CarDekho', 'CarWale', 'BikeWale'];
const IMAGES = [
  'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&h=420&fit=crop',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&h=420&fit=crop',
  'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&h=420&fit=crop',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=420&fit=crop',
  'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&h=420&fit=crop',
  'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&h=420&fit=crop',
  'https://images.unsplash.com/photo-1611916656167-a6f2a9a44814?w=800&h=420&fit=crop',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&h=420&fit=crop',
];

const generateMockNews = () =>
  Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    title: `Automotive Update #${i + 1}: Major Industry Shift Expected`,
    source: SOURCES[i % SOURCES.length],
    date: `May ${(i % 30) + 1}, 2026`,
    image: IMAGES[i % IMAGES.length],
    body: `Story #${i + 1}: Industry analysts weigh in on the latest movements across the Indian automotive landscape — from EV adoption rates to fuel price corrections and upcoming launches that will reshape the segment.`,
  }));

const masterNews = generateMockNews();

function shareArticle(article) {
  const deepLink = `https://downshift.app/news/${article.id}`;
  const shareText = `${article.title}\n\nRead on DownShift — your automotive companion 🚗\n${deepLink}`;
  if (navigator.share) {
    navigator.share({ title: article.title, text: shareText, url: deepLink });
  } else {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
  }
}

export default function HomeNewsCard() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const loaderRef = useRef(null);

  useEffect(() => {
    const node = loaderRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !isLoading && visibleCount < masterNews.length) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => Math.min(prev + 4, masterNews.length));
            setIsLoading(false);
          }, 1000);
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isLoading, visibleCount]);

  return (
    <>
      <div className="flex flex-col gap-4 pb-10">
        {masterNews.slice(0, visibleCount).map((news, i) => (
          <motion.div
            key={news.id}
            className="glass rounded-2xl overflow-hidden cursor-pointer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (i % 4) * 0.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setExpanded(news)}
          >
            <div className="h-40 relative">
              <img src={news.image} alt={news.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="font-space font-semibold text-white text-sm leading-snug line-clamp-2">
                  {news.title}
                </p>
              </div>
            </div>
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary font-semibold">{news.source}</span>
                <span className="text-xs text-muted-foreground">· {news.date}</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
            </div>
          </motion.div>
        ))}
      </div>

      <div ref={loaderRef} className="w-full h-20 flex justify-center items-center">
        {isLoading && (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00E5FF]"></div>
        )}
      </div>

      <p
        className="my-5 pt-8 pr-4 pl-4 font-space text-lg font-black text-center capitalize opacity-90"
        style={{ color: '#A0A0A0' }}
      >
        Keeping you on the road. Tuned with ❤️ in India
      </p>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className="fixed inset-0 z-[110] flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setExpanded(null)}
            />
            <motion.div
              className="relative w-full max-w-lg glass-strong rounded-t-3xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              <div className="h-52 relative">
                <img src={expanded.image} alt={expanded.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                <div className="absolute top-4 right-4 flex gap-2">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      shareArticle(expanded);
                    }}
                    className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
                  >
                    <Share2 className="w-4 h-4 text-white" />
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setExpanded(null)}
                    className="w-9 h-9 rounded-full bg-black/50 backdrop-blur flex items-center justify-center"
                  >
                    <X className="w-4 h-4 text-white" />
                  </motion.button>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-primary font-semibold">{expanded.source}</span>
                  <span className="text-xs text-muted-foreground">· {expanded.date}</span>
                </div>
                <h2 className="font-space font-bold text-white text-base leading-snug mb-3">
                  {expanded.title}
                </h2>
                <p className="text-sm text-white/60 font-inter leading-relaxed">{expanded.body}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}