import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getIcon } from '../utils/iconUtils';

const Sidebar = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Icons
  const HomeIcon = getIcon('Home');
  const BriefcaseIcon = getIcon('Briefcase');
  const CheckSquareIcon = getIcon('CheckSquare');
  const UsersIcon = getIcon('Users');
  const FileTextIcon = getIcon('FileText');
  const MenuIcon = getIcon('Menu');
  const XIcon = getIcon('X');

  const navItems = [
    { path: '/', label: 'Dashboard', icon: HomeIcon },
    { path: '/projects', label: 'Projects', icon: BriefcaseIcon },
    { path: '/tasks', label: 'Tasks', icon: CheckSquareIcon },
    { path: '/clients', label: 'Clients', icon: UsersIcon },
    { path: '/invoices', label: 'Invoices', icon: FileTextIcon },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 dark:hover:text-surface-200"
          aria-label="Open menu"
        >
          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-surface-900/50 z-20 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-surface-800 z-30 transform transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-surface-200 dark:border-surface-700 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FreeLinkPro
              </h1>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 rounded-md text-surface-500 hover:text-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 dark:hover:text-surface-200"
              aria-label="Close menu"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>
          <nav className="flex-1 p-4 overflow-y-auto">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                        : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block min-w-[16rem] border-r border-surface-200 dark:border-surface-700">
        <nav className="p-4 sticky top-16">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary/10 text-primary dark:bg-primary/20'
                      : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;