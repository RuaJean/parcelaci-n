import Head from 'next/head';
import InteractiveMapPage from '../components/InteractiveMapPage';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Parcelación de predios</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <main>
        <InteractiveMapPage />
      </main>
    </div>
  );
}
