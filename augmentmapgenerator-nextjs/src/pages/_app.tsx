import type { AppProps } from 'next/app';
import '../data/us-states.json'; // Import the problematic file globally

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
