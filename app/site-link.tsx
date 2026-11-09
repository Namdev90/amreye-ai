"use client";

import Link from 'next/link';
import type { ComponentProps } from 'react';
import { navigateSiteLink } from './site-link-navigation.mjs';

type SiteLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & { href: string };

// SiteShell owns the hash-based sections and /library history. Keep real hrefs
// for SSR and native browser actions, but do not let Next consume shell clicks.
export default function SiteLink({ onClick, ...props }: SiteLinkProps) {
  return <Link {...props} prefetch={false} onClick={event => {
    onClick?.(event);
    navigateSiteLink(event, event.currentTarget, window);
  }} />;
}
