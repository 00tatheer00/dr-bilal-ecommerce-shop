'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Download, X, Share2, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function PwaRegister() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [showIosPrompt, setShowIosPrompt] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((reg) => {
            console.log('[PWA] Service Worker registered with scope:', reg.scope);
          })
          .catch((err) => {
            console.warn('[PWA] Service Worker registration failed:', err);
          });
      });
    }

    // Check if already in standalone/PWA mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    if (isStandalone) {
      return; // Already running as installed app
    }

    // Check if user previously dismissed prompt within 5 days
    const dismissedAt = localStorage.getItem('gulnaar_pwa_dismissed');
    if (dismissedAt) {
      const daysPassed = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (daysPassed < 5) {
        return;
      }
    }

    // 2. Android / Chrome Install Prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Wait 3 seconds after page loads before showing prompt so customer can see the store first
      setTimeout(() => {
        setShowInstallPrompt(true);
      }, 3500);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 3. iOS Safari detection
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari = isIosDevice && /safari/.test(userAgent) && !/crios|fxios/.test(userAgent);

    if (isSafari && !isStandalone) {
      setIsIos(true);
      const iosDismissed = localStorage.getItem('gulnaar_ios_pwa_dismissed');
      if (!iosDismissed) {
        setTimeout(() => {
          setShowIosPrompt(true);
        }, 5000);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;

    if (choice.outcome === 'accepted') {
      console.log('[PWA] User accepted install prompt');
    }
    setDeferredPrompt(null);
    setShowInstallPrompt(false);
  };

  const handleDismiss = () => {
    setShowInstallPrompt(false);
    setShowIosPrompt(false);
    localStorage.setItem('gulnaar_pwa_dismissed', Date.now().toString());
    if (isIos) {
      localStorage.setItem('gulnaar_ios_pwa_dismissed', Date.now().toString());
    }
  };

  // Android / Chrome Install Banner
  if (showInstallPrompt && deferredPrompt) {
    return (
      <aside
        aria-label="Install GULNAAR Mobile App"
        className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-slide-up"
      >
        <div className="rounded-2xl border border-[#F6D365]/60 bg-white/95 backdrop-blur-md p-4 shadow-[0_12px_36px_rgba(184,29,78,0.18)] flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-12 shrink-0 rounded-xl overflow-hidden bg-[#FFF0F5] border border-[#F0DFE7] p-1">
              <Image
                src="/icons/icon-192x192.png"
                alt="GULNAAR App"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-heading font-bold text-sm text-text-primary block leading-tight">
                Install GULNAAR App
              </span>
              <span className="text-[11px] text-text-secondary block mt-0.5">
                Faster shopping & 1-tap checkout from home screen
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#B81D4E] to-[#8E0E3B] hover:from-[#8E0E3B] hover:to-[#700B2E] text-white text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all btn-luxury-shine cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-[#F6D365]" />
              <span>Install</span>
            </button>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
              aria-label="Dismiss app install banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // iOS Safari "Add to Home Screen" Instruction Banner
  if (showIosPrompt && isIos) {
    return (
      <aside
        aria-label="Add GULNAAR to Home Screen"
        className="fixed bottom-16 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-50 animate-slide-up"
      >
        <div className="rounded-2xl border border-[#F6D365]/60 bg-white/95 backdrop-blur-md p-4 shadow-[0_12px_36px_rgba(184,29,78,0.18)] space-y-2.5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 shrink-0 rounded-xl overflow-hidden bg-[#FFF0F5] border border-[#F0DFE7] p-1">
                <Image
                  src="/icons/icon-192x192.png"
                  alt="GULNAAR App"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-bold text-xs sm:text-sm text-text-primary block">
                  Install GULNAAR on iPhone
                </span>
                <span className="text-[10px] text-text-secondary">
                  Shop directly from your iPhone home screen
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleDismiss}
              className="p-1 text-text-secondary hover:text-text-primary rounded-lg"
              aria-label="Dismiss banner"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-[#B81D4E] bg-[#FFF0F5] rounded-xl px-3 py-2 font-medium">
            <span>Tap</span>
            <Share2 className="h-3.5 w-3.5 shrink-0" />
            <span>then select</span>
            <span className="inline-flex items-center gap-1 font-bold underline">
              <PlusSquare className="h-3.5 w-3.5" />
              Add to Home Screen
            </span>
          </div>
        </div>
      </aside>
    );
  }

  return null;
}

