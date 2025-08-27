import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Leaf, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  BarChart3,
  MessageCircle,
  Home
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: '/', label: 'Trang chủ', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/analysis', label: 'Phân tích', icon: Leaf },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">
                PlantAI
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.path)
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700">
                      {user.fullName}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/profile"
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Mobile menu button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-primary-600 font-medium transition-colors"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="btn-primary"
                >
                  Đăng ký
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {user && isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.path)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-600 hover:text-primary-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <div className="flex items-center space-x-2 px-3 py-2">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">
                  {user.fullName}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 px-3 py-2">
                <Link
                  to="/profile"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Hồ sơ</span>
                </Link>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-red-600 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
