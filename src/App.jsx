import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import ProjectList from './pages/ProjectList';
import ProjectDetail from './pages/ProjectDetail';
import ProjectForm from './pages/ProjectForm';
import InvoiceList from './pages/InvoiceList';
import InvoiceDetail from './pages/InvoiceDetail';
import TaskList from './pages/TaskList';
import ClientList from './pages/ClientList';
import ClientDetail from './pages/ClientDetail';
import ClientForm from './pages/ClientForm';
import TaskForm from './pages/TaskForm';
import TaskDetail from './pages/TaskDetail';
import TimeEntryForm from './components/TimeEntryForm';
import InvoiceForm from './pages/InvoiceForm';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import { setUser, clearUser } from './store/userSlice';
import Sidebar from './components/Sidebar';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  // Moved darkMode state declaration here to maintain hooks order
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      // Check if user previously set a preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme === 'dark';
      }
      // Check system preference
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });
  
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;


  // Initialize ApperUI once when the app loads
  useEffect(() => {
    // Check if ApperSDK is available
    if (!window.ApperSDK) {
      console.error("Apper SDK not available. Please check the script is loaded.");
      setIsInitialized(true); // Still set to true to avoid blocking the UI
      return;
    }

    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });

    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                     ? `/signup?redirect=${currentPath}`
                     : currentPath.includes('/login')
                     ? `/login?redirect=${currentPath}`
                     : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
        toast.error("Authentication failed. Please try again.");
        setIsInitialized(true); // Set to true even on error to avoid blocking the UI
      }
    });
  }, [dispatch, navigate]);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);


  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    logout: async () => {
      try {
        if (!window.ApperSDK) {
          console.error("Apper SDK not available.");
          return;
        }
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
        toast.success("Logged out successfully");
      } catch (error) {
        console.error("Logout failed:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };
  
  // Protected route component
  const ProtectedRoute = ({ children }) => {
    const userAuthState = useSelector((state) => state.user);
    const isUserAuthenticated = userAuthState?.isAuthenticated || false;
    
    useEffect(() => {
      if (!isUserAuthenticated) {
        const currentPath = window.location.pathname + window.location.search;
        if (currentPath !== '/login') {
          navigate(`/login?redirect=${currentPath}`);
        }
        toast.info("Please log in to access this page");
      }
    }, [isUserAuthenticated, navigate]);
    if (!isAuthenticated) {
      return null;
    }
    
    return children;
  };

  // Don't render app until authentication is initialized
  if (!isInitialized) {
    return (
      <div className="loading flex items-center justify-center min-h-screen">
        <div className="text-center">Initializing application...</div>
      </div>
    );
  }


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');

  const UserIcon = getIcon('User');
  const LogOutIcon = getIcon('LogOut');

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen">
        <header className="bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                FreeLinkPro
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <div className="flex items-center gap-3 mr-2">
                  <div className="hidden md:flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
                      <UserIcon className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-sm font-medium">
                      {userState?.user?.firstName || 'User'}
                    </div>
                  </div>
                  <button
                    onClick={authMethods.logout}
                    className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 text-surface-600 hover:text-accent"
                    title="Log out"
                  >
                    <LogOutIcon className="w-5 h-5" />
                  </button>
                </div>
              )}
              
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: darkMode ? 360 : 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {darkMode ? (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-surface-600" />
                  )}
                </motion.div>
              </button>
            </div>
          </div>
        </header>
        
        {/* Authentication container - only displayed when needed */}
        <div id="authentication" className={!['/login', '/signup', '/callback'].includes(window.location.pathname) ? 'hidden' : ''}></div>
        
        <div className="flex min-h-[calc(100vh-69px)]">
          {/* Conditionally render sidebar only for authenticated users and not on auth pages */}
          {isAuthenticated && !['/login', '/signup', '/callback', '/error'].includes(window.location.pathname) && (
            <Sidebar />
          )}
          
          <main className="flex-1 container mx-auto px-4 py-6">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              
              {/* Protected routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              
              } />
              {/* Add ProtectedRoute to all other routes */}
              {Object.entries({
                "/projects": <ProjectList />, "/projects/:id": <ProjectDetail />, "/projects/new": <ProjectForm />, 
                "/projects/edit/:id": <ProjectForm />, "/projects/:id/expenses": <ProjectDetail />, 
                "/projects/:id/expenses/:expenseId": <ProjectDetail />, "/invoices": <InvoiceList />, 
                "/invoices/:id": <InvoiceDetail />, "/invoices/new": <InvoiceForm />, "/invoices/edit/:id": <InvoiceForm />, 
                "/clients": <ClientList />, "/clients/:id": <ClientDetail />, "/clients/new": <ClientForm />, 
                "/clients/edit/:id": <ClientForm />,
                "/tasks": <TaskList />, "/tasks/:id": <TaskDetail />, "/tasks/new": <TaskForm />, "/tasks/edit/:id": <TaskForm />
              }).map(([path, element]) => (
                <Route key={path} path={path} element={<ProtectedRoute>{element}</ProtectedRoute>} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>

        <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
          <div className="container mx-auto px-4 text-center text-surface-500">
            <p>&copy; {new Date().getFullYear()} FreeLinkPro. All rights reserved.</p>
          </div>
        </footer>

        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;