import '../styles/global.css'; 
import Header from '../components/Header'; // Ajusta la ruta si es necesario

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
