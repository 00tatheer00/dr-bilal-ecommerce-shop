'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface StoryItem {
  id: string;
  name: string;
  href: string;
  image: string;
  isHot?: boolean;
}

const STORY_ITEMS: StoryItem[] = [
  {
    id: 'earrings',
    name: 'Earrings',
    href: '/shop?category=earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=240&auto=format&fit=crop&q=80',
    isHot: true,
  },
  {
    id: 'bridal',
    name: 'Bridal Sets',
    href: '/shop?category=bridal',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=240&auto=format&fit=crop&q=80',
    isHot: true,
  },
  {
    id: 'hair-accessories',
    name: 'Hair Decor',
    href: '/shop?category=hair-accessories',
    image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'wooden-products',
    name: 'Wooden Boxes',
    href: '/shop?category=wooden-products',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'everyday',
    name: 'Velvet Churis',
    href: '/shop?category=everyday',
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'daily-life',
    name: 'Daily Pouches',
    href: '/shop?category=daily-life-products',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'statement',
    name: 'Royal Kadas',
    href: '/shop?category=statement',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?w=240&auto=format&fit=crop&q=80',
  },
  {
    id: 'all',
    name: 'View All',
    href: '/shop',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=240&auto=format&fit=crop&q=80',
  },
];

export default function CategoryStoriesBar() {
  return (
    <section aria-label="Quick Category Stories" className="w-full bg-[#FFFFFF] border-b border-[#E8E5DF]/70 py-3 sm:py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth py-1 -mx-2 px-2">
          {STORY_ITEMS.map((story) => (
            <Link
              key={story.id}
              href={story.href}
              prefetch={true}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              {/* Instagram-style Ring */}
              <div className="relative p-0.5 rounded-full bg-gradient-to-tr from-[#FF2E93] via-[#F6D365] to-[#B81D4E] group-hover:scale-105 transition-transform duration-300 shadow-xs">
                <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-full overflow-hidden bg-white p-0.5 border-2 border-white">
                  <Image
                    src={story.image}
                    alt={story.name}
                    fill
                    sizes="80px"
                    className="object-cover rounded-full group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {story.isHot && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF2E93] to-[#B81D4E] text-white text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full tracking-wider border border-white shadow-xs">
                    Hot
                  </span>
                )}
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-text-primary group-hover:text-[#B81D4E] transition-colors tracking-tight text-center max-w-[72px] truncate">
                {story.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

