import Footer from './Footer';
import Header from './Header';

export function Layout({ children }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
