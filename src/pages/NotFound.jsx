import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getIcon } from '../utils/iconUtils';

const NotFound = () => {
  const AlertCircleIcon = getIcon('AlertCircle');
  const HomeIcon = getIcon('Home');

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="w-24 h-24 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-6">
        <AlertCircleIcon className="w-12 h-12 text-primary" />
      </div>
      
      <h1 className="text-4xl md:text-5xl font-bold text-surface-800 dark:text-surface-100 mb-4">
        404
      </h1>
      
      <h2 className="text-2xl md:text-3xl font-semibold text-surface-700 dark:text-surface-200 mb-2">
        Page Not Found
      </h2>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        We couldn't find the page you're looking for. The page might have been removed, 
        renamed, or is temporarily unavailable.
      </p>
      
      <Link 
        to="/"
        className="btn-primary inline-flex items-center gap-2"
      >
        <HomeIcon className="w-5 h-5" />
        <span>Back to Home</span>
      </Link>
      
      <div className="mt-12 p-4 bg-surface-100 dark:bg-surface-800 rounded-xl max-w-md">
        <p className="text-surface-600 dark:text-surface-400 text-sm">
          If you believe this is an error with FreeLinkPro, please contact support 
          at support@freelinkpro.com
        </p>
      </div>
    </motion.div>
  );
};

export default NotFound;