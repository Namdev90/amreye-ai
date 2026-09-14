import type {Metadata} from 'next';
import SiteShell from '../site-shell';

export const metadata: Metadata = {
  title: 'Library · AMReye.AI',
  description: 'The complete AMReye.AI technical, microbiological and AI topic library. Explore research, working principles and source references for antimicrobial intelligence.',
  alternates: {canonical: '/library'},
  openGraph: {title: 'Library · AMReye.AI', url: 'https://amreye.in/library'},
};

export default function LibraryPage(){return <SiteShell initialActive="library"/>}
