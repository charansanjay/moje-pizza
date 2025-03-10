import { useState, useEffect } from 'react';

import styles from './ScrollToTopButton.module.css';

import { FaArrowUp } from 'react-icons/fa';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show the button when the user scrolls down 300px
  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Scroll to the top of the page
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Add a scroll event listener when the component mounts
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className={styles.scrollToTopContainer}>
      {isVisible && (
        <button onClick={scrollToTop} className={styles.scrollToTopButton}>
          <FaArrowUp data-testid="scroll_to_top_icon" />
        </button>
      )}
    </div>
  );
};
