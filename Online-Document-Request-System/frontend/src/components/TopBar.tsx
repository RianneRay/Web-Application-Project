import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface TopBarProps {
  title: string;
}

const TopBar: React.FC<TopBarProps> = ({ title }) => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const dashboardRoute =
    user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard';

  return (
    <div className="flex items-center gap-4 p-4 border-b bg-white sticky top-0 z-50">
      <button
        onClick={() => navigate(dashboardRoute)}
        className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
      >
        <ArrowLeft size={20} />
        Back
      </button>
      <h1 className="text-xl font-bold text-gray-800">{title}</h1>
    </div>
  );
};

export default TopBar;