import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="py-20 sm:py-32 text-center">
      <Container size="sm">
        <div className="relative mx-auto mb-6 h-20 w-20">
          <Image
            src="/images/logo-icon.png"
            alt="GULNAAR"
            fill
            sizes="80px"
            className="object-contain"
          />
        </div>
        <span className="text-xs uppercase tracking-widest text-brand font-semibold block mb-2">
          Page Not Found • 404
        </span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-3">
          This Piece Seems Missing
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mb-8 leading-relaxed">
          The page or product you are looking for may have been moved, renamed, or is currently undergoing bespoke artisan restoration.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link href="/">
            <Button variant="secondary" size="md">
              Return Home
            </Button>
          </Link>
          <Link href="/shop">
            <Button variant="primary" size="md">
              Explore All Bangles
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}

