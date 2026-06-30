'use client';

import { useState } from 'react';
import { Search, Eye, BookOpen, Tag } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  category: string;
  views: number;
  updated: string;
  description: string;
}

const articles: Article[] = [
  {
    id: 1,
    title: 'How to Reset Your Password',
    category: 'Account & Access',
    views: 2841,
    updated: '2 days ago',
    description:
      'Step-by-step guide to reset your Active Directory and M365 password using self-service tools.',
  },
  {
    id: 2,
    title: 'Setting Up MFA on Your Account',
    category: 'Account & Access',
    views: 1923,
    updated: '5 days ago',
    description:
      'Configure Microsoft Authenticator or hardware token for your account.',
  },
  {
    id: 3,
    title: 'VPN Setup and Troubleshooting Guide',
    category: 'Network',
    views: 1654,
    updated: '1 week ago',
    description:
      'Connect to the corporate VPN from Windows, Mac, or mobile devices.',
  },
  {
    id: 4,
    title: 'New Employee Onboarding Checklist',
    category: 'Onboarding',
    views: 1432,
    updated: '3 days ago',
    description: 'Complete checklist for IT setup on your first day.',
  },
  {
    id: 5,
    title: 'How to Report a Phishing Email',
    category: 'Security',
    views: 1287,
    updated: '1 day ago',
    description:
      'Identify and report suspicious emails to protect the organization.',
  },
  {
    id: 6,
    title: 'Connecting to the Office Printer',
    category: 'Devices',
    views: 987,
    updated: '1 week ago',
    description: 'Add a network printer on Windows or Mac.',
  },
  {
    id: 7,
    title: 'SharePoint Access and Permissions',
    category: 'Account & Access',
    views: 876,
    updated: '4 days ago',
    description: 'Request access or troubleshoot SharePoint permissions.',
  },
  {
    id: 8,
    title: 'Remote Desktop Setup Guide',
    category: 'Network',
    views: 743,
    updated: '2 weeks ago',
    description: 'Set up RDP access to your office workstation from home.',
  },
  {
    id: 9,
    title: 'Laptop Performance Optimization',
    category: 'Devices',
    views: 654,
    updated: '3 days ago',
    description: 'Speed up your laptop with these maintenance steps.',
  },
  {
    id: 10,
    title: 'Security Incident Response Procedure',
    category: 'Security',
    views: 543,
    updated: '6 days ago',
    description: 'Steps to follow when you suspect a security incident.',
  },
];

const categories = ['All', 'Account & Access', 'Devices', 'Network', 'Security', 'Onboarding'];

const categoryCounts: Record<string, number> = {
  All: articles.length,
  'Account & Access': articles.filter((a) => a.category === 'Account & Access').length,
  Devices: articles.filter((a) => a.category === 'Devices').length,
  Network: articles.filter((a) => a.category === 'Network').length,
  Security: articles.filter((a) => a.category === 'Security').length,
  Onboarding: articles.filter((a) => a.category === 'Onboarding').length,
};

function getCategoryColor(category: string) {
  switch (category) {
    case 'Account & Access':
      return 'bg-blue-900/40 text-blue-400';
    case 'Devices':
      return 'bg-green-900/40 text-green-400';
    case 'Network':
      return 'bg-purple-900/40 text-purple-400';
    case 'Security':
      return 'bg-red-900/40 text-red-400';
    case 'Onboarding':
      return 'bg-yellow-900/40 text-yellow-400';
    default:
      return 'bg-gray-700 text-gray-400';
  }
}

const featuredIds = [1, 3, 5];

export default function KnowledgePage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = articles.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || a.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const featured = articles.filter((a) => featuredIds.includes(a.id));

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Hero Search */}
      <div className="bg-gradient-to-b from-indigo-950/30 to-transparent py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <BookOpen className="w-6 h-6 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Knowledge Base</h1>
          </div>
          <p className="text-gray-400 mb-6">
            Find answers, guides, and troubleshooting steps
          </p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search the knowledge base..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#161b27] border border-[#1e2535] rounded-xl pl-12 pr-4 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 text-base"
            />
          </div>
        </div>
      </div>

      <div className="px-6 pb-10">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[#161b27] border border-[#1e2535] text-gray-400 hover:text-white hover:border-gray-600'
              }`}
            >
              {cat}
              <span
                className={`text-xs px-1.5 py-0.5 rounded-full ${
                  activeCategory === cat ? 'bg-indigo-500' : 'bg-[#1e2535] text-gray-500'
                }`}
              >
                {categoryCounts[cat]}
              </span>
            </button>
          ))}
        </div>

        {/* Featured Articles */}
        {activeCategory === 'All' && !search && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Featured Articles</h2>
            <div className="grid grid-cols-3 gap-4">
              {featured.map((article) => (
                <div
                  key={article.id}
                  className="bg-[#161b27] border border-[#1e2535] rounded-xl p-5 flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${getCategoryColor(article.category)}`}
                    >
                      {article.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      {article.views.toLocaleString()}
                    </div>
                  </div>
                  <h3 className="text-white font-semibold mb-2 leading-snug">{article.title}</h3>
                  <p className="text-gray-400 text-sm mb-4 flex-1 leading-relaxed">
                    {article.description}
                  </p>
                  <button className="text-indigo-400 hover:text-indigo-300 text-sm font-medium text-left transition-colors">
                    Read Article →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article List */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">
            {activeCategory === 'All' && !search ? 'All Articles' : `Results (${filtered.length})`}
          </h2>
          <div className="bg-[#161b27] border border-[#1e2535] rounded-xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1e2535]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      Views
                    </div>
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Updated
                  </th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((article, idx) => (
                  <tr
                    key={article.id}
                    className={`${
                      idx < filtered.length - 1 ? 'border-b border-[#1e2535]' : ''
                    } hover:bg-[#1a2030] transition-colors`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded bg-indigo-600/20 flex items-center justify-center shrink-0">
                          <Tag className="w-3.5 h-3.5 text-indigo-400" />
                        </div>
                        <span className="text-white text-sm font-medium">{article.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs px-2 py-0.5 rounded font-medium ${getCategoryColor(article.category)}`}
                      >
                        {article.category}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-sm">
                      {article.views.toLocaleString()}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-sm">{article.updated}</td>
                    <td className="px-5 py-3.5">
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-800 hover:border-indigo-600 px-3 py-1 rounded transition-colors">
                        Read
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-10 text-center text-gray-500">
                      No articles found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
