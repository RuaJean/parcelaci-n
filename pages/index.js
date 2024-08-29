import Head from 'next/head';
import InteractiveMap from '../components/InteractiveMap';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Parcelación de predios</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main>
        <InteractiveMap />
      </main>
    </div>
  );
}
