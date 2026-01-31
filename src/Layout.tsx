import { Link, Outlet, useLocation } from 'react-router-dom';
import { FileStack } from 'lucide-react';

export default function Layout() {
    const location = useLocation();
    const currentYear = new Date().getFullYear();

    return (
        <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col">
            <header className="border-b border-gray-800 bg-gray-950/50 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500/20 transition-colors">
                                <FileStack size={24} />
                            </div>
                            <span className="font-bold text-xl tracking-tight">PDF Merger</span>
                        </Link>

                        <nav className="flex items-center gap-6">
                            <Link
                                to="/"
                                className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                Home
                            </Link>
                            <Link
                                to="/privacy"
                                className={`text-sm font-medium transition-colors ${location.pathname === '/privacy' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                Privacy
                            </Link>
                            <Link
                                to="/terms"
                                className={`text-sm font-medium transition-colors ${location.pathname === '/terms' ? 'text-indigo-400' : 'text-gray-400 hover:text-gray-200'
                                    }`}
                            >
                                Terms
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            <main className="flex-grow">
                <div className="max-w-7xl mx-auto w-full">
                    <Outlet />
                </div>
            </main>

            <footer className="border-t border-gray-800 bg-gray-900/30 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h3 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 mb-2">
                                PDF Merger
                            </h3>
                            <p className="text-gray-500 text-sm">
                                Secure, fast, and free PDF combining tool
                            </p>
                        </div>

                        <div className="flex items-center gap-6 text-sm">
                            <Link to="/privacy" className="text-gray-400 hover:text-gray-200 transition-colors">
                                Privacy Policy
                            </Link>
                            <Link to="/terms" className="text-gray-400 hover:text-gray-200 transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-800 text-center">
                        <p className="text-gray-500 text-sm">
                            © {currentYear} PDF Merger. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-xs mt-2">
                            Your files are processed 100% locally and never uploaded to any server.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
