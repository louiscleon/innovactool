"use client";

// Ce fichier résout le problème des "export *" dans les boundaries client
// en réexportant de manière nommée les éléments de framer-motion dont nous avons besoin

import {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useScroll,
  MotionConfig,
  LayoutGroup,
  AnimateSharedLayout
} from 'framer-motion';

export {
  motion,
  AnimatePresence,
  useAnimation,
  useInView,
  useScroll,
  MotionConfig,
  LayoutGroup,
  AnimateSharedLayout
}; 