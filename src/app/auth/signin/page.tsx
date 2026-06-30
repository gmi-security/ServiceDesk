export default function SignInPage() {
  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center p-4">
      <div className="bg-[#161b27] border border-[#1e2535] rounded-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="mb-2" style={{ fontFamily: "'Orbitron', sans-serif" }}>
            <span className="text-indigo-500 font-bold text-2xl">GMI</span>
            <span className="text-white font-semibold text-2xl"> ServiceOS</span>
          </div>
          <p className="text-gray-400 text-sm">IT Service Management</p>
        </div>

        {/* Microsoft Sign In */}
        <button className="w-full flex items-center justify-center gap-3 bg-white text-gray-900 hover:bg-gray-100 font-medium py-2.5 px-4 rounded-lg transition-colors mb-6">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="8" height="8" fill="#F25022" />
            <rect x="11" y="1" width="8" height="8" fill="#7FBA00" />
            <rect x="1" y="11" width="8" height="8" fill="#00A4EF" />
            <rect x="11" y="11" width="8" height="8" fill="#FFB900" />
          </svg>
          Continue with Microsoft
        </button>

        {/* Divider */}
        <div className="relative flex items-center mb-6">
          <div className="flex-1 border-t border-[#1e2535]"></div>
          <span className="mx-4 text-gray-500 text-sm">or</span>
          <div className="flex-1 border-t border-[#1e2535]"></div>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-1.5">Email address</label>
          <input
            type="email"
            autoComplete="email"
            className="w-full bg-[#0f1117] border border-[#1e2535] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            placeholder="you@company.com"
          />
        </div>

        {/* Password Field */}
        <div className="mb-2">
          <label className="block text-sm text-gray-300 mb-1.5">Password</label>
          <input
            type="password"
            autoComplete="current-password"
            className="w-full bg-[#0f1117] border border-[#1e2535] rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-indigo-500 placeholder-gray-600"
            placeholder="••••••••"
          />
        </div>

        {/* Emergency access note */}
        <p className="text-xs text-gray-500 italic mb-6">
          Local accounts are for emergency access only. Contact your administrator.
        </p>

        {/* Sign In Button */}
        <button className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors mb-6">
          Sign In
        </button>

        {/* Support Link */}
        <p className="text-center text-gray-400 text-sm mb-8">
          Having trouble?{' '}
          <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors">
            Contact support
          </a>
        </p>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs">
          help.gmi.com &middot; Powered by GMI ServiceOS
        </p>
      </div>
    </div>
  );
}
