'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SaveAllButtonProps {
  hasChanges: boolean;
  pendingChangesCount: number;
  saving: boolean;
  onSave: () => Promise<void>;
  onDiscard: () => void;
}

export default function SaveAllButton({
  hasChanges,
  pendingChangesCount,
  saving,
  onSave,
  onDiscard,
}: SaveAllButtonProps) {
  if (!hasChanges) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        className="fixed bottom-6 left-0 right-0 z-50 flex justify-center"
      >
        <div className="bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-100 text-white dark:text-neutral-900 rounded-2xl shadow-2xl border border-white/10 dark:border-black/10 backdrop-blur-xl px-6 py-4 flex items-center gap-4">
          {/* Pending changes indicator */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F20352] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F20352]"></span>
              </span>
            </div>
            <span className="text-sm font-medium">
              {pendingChangesCount} {pendingChangesCount === 1 ? 'modifica' : 'modifiche'} in
              sospeso
            </span>
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-white/20 dark:bg-black/20"></div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Discard button */}
            <button
              onClick={onDiscard}
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white/70 dark:text-neutral-700 hover:text-white dark:hover:text-neutral-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Annulla
            </button>

            {/* Save All button */}
            <button
              onClick={onSave}
              disabled={saving}
              className="relative px-6 py-2 bg-gradient-to-r from-[#F20352] to-[#D91848] text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Salvataggio...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                  </svg>
                  Salva Tutto
                </>
              )}
            </button>
          </div>
        </div>

        {/* Tooltip helper */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-xs text-neutral-400 dark:text-neutral-600 whitespace-nowrap"
        >
          Le modifiche vengono salvate tutte insieme
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
