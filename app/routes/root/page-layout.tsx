import { Outlet, useNavigate } from 'react-router';
import { logoutUser } from '../../appwrite/auth';
import Navbar from '../../../components/Navbar';
import Footer from '../../../components/Footer';

const PageLayout = () => {
  const navigate = useNavigate();
  
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/sign-in');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <main className="relative">
      <Navbar />
      {/* The buttons from the original file are here. I'll just wrap them. */}
      <div className="absolute top-20 right-4 z-50 flex gap-4">
        <button
          onClick={handleLogout}
          className="cursor-pointer bg-white p-2 rounded-full shadow-md"
        >
          <img
            src="/assets/icons/logout.svg"
            alt="logout"
            className="size-6"
          />
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="cursor-pointer bg-white p-2 px-4 rounded-full shadow-md font-semibold"
        >
          Dashboard
        </button>
      </div>
      <section>
        <Outlet />
      </section>
      <Footer />
    </main>
  );
};

export default PageLayout;