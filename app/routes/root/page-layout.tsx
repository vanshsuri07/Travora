import { Outlet } from 'react-router';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer'

const PageLayout = () => {
  return (
    <main className="">
      <Navbar />
      <section>
        <Outlet />
      </section>
      
    </main>
  );
};

export default PageLayout;
