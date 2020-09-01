// Component imports
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f4f4f4',
      }}
    >
      <Header />
      <main
        className="container"
        style={{
          flexGrow: 1,
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
