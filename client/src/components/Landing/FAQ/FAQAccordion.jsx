import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left p-4 md:p-6 glass-card border-white/5 transition-all flex justify-between items-center group gap-4 ${isOpen ? 'border-[#00F5FF]/30 bg-[#00F5FF]/5' : 'hover:bg-white/2'}`}
      >
        <span className="orbitron text-xs md:text-base font-bold text-white group-hover:text-cyan-400 transition-colors uppercase md:normal-case">{question}</span>
        <div className={`p-1 md:p-1.5 rounded-full border border-white/10 shrink-0 ${isOpen ? 'bg-cyan-400 border-none text-black' : 'text-slate-500'}`}>
          {isOpen ? <Minus size={14} md={16} /> : <Plus size={14} md={16} />}
        </div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="p-4 md:p-6 font-mono text-[10px] md:text-sm text-slate-400 leading-relaxed bg-black/20 border-x border-b border-white/5 rounded-b-2xl">
              {answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const FAQAccordion = () => {
  const faqs = [
    {
      question: "Is RepoLens free to use?",
      answer: "Yes. RepoLens is fully open source under the MIT license. You can self-host it using the provided Docker containers or contribute to the public effort on GitHub."
    },
    {
      question: "How does the similarity checker find candidates?",
      answer: "It uses 6 parallel strategies: fork detection via GitHub API, cross-referencing direct URLs, global code searches using logic snippets, metadata matches (README headers), deep string literals (error codes), and author repository scraping."
    },
    {
      question: "Can it detect renamed variables?",
      answer: "Absolutely. Our Structural Skeleton Matching algorithm abstracts code to its logical structure (FUNCTION_DEF, IF_STATEMENT, LOOP) before comparison, making variable and function renames invisible to detection."
    },
    {
      question: "Why is analysis queue-based?",
      answer: "Processing up to 50 files across dozens of repositories with high-precision computer science algorithms is compute-heavy. BullMQ offloads these jobs to background workers, returning a jobId instantly for non-blocking UI performance."
    },
    {
      question: "What languages are supported?",
      answer: "The Analytics engine supports every language tracked by GitHub. The Similarity engine works primarily on text-based source code including JavaScript, Python, C++, Java, and Go."
    },
    {
      question: "How can I contribute?",
      answer: "Fork the repo on GitHub, look for issues labeled 'good first issue', and join our Discord. All architectural areas—from discovery strategies to scoring algorithms—are open for contribution."
    }
  ];

  return (
    <section className="py-24 md:py-32 bg-[#050810]">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="orbitron text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">Common Questions</h2>
          <div className="h-1 w-16 md:w-20 bg-cyan-400 mx-auto rounded-full" />
        </div>
        
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQAccordion;
