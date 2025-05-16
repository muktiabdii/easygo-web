import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const AnimatedPage = ({ children }) => {
  const location = useLocation();

  const pageVariants = {
    initial: {
      opacity: 0,
    },
    animate: {
      opacity: 1, 
      transition: {
        duration: 0.6, 
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0, 
      transition: {
        duration: 0.6,
        ease: 'easeIn',
      },
    },
  };

  return (
    <motion.div
      key={location.pathname} 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      style={{ width: '100%', height: '100%' }} 
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;