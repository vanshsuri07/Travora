import { Outlet } from 'react-router';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer'

const PageLayout = () => {
  return (
    <main className="relative">
      <Navbar />
      <section>
        <Outlet />
      </section>
      <Footer />
    </main>
  );
};

export default PageLayout;
