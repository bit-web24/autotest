import { useState } from "react";

export default function Dashboard() {
  const [isDark, setIsDark] = useState(true);

  // Mock user data
  const user = {
    name: "Alex Morgan",
    email: "alex.morgan@example.com",
    avatar: "AM",
    plan: "Pro Plan",
    joinedDate: "Jan 2024",
  };

  // Mock token usage data
  const tokenUsage = {
    used: 45230,
    total: 100000,
    percentage: 45.23,
    resetDate: "Nov 1, 2024",
  };

  const stats = [
    { label: "Total Chats", value: "127", icon: "💬", change: "+12%" },
    { label: "Active Agents", value: "4", icon: "🤖", change: "+2" },
    { label: "Tasks Completed", value: "89", icon: "✅", change: "+23%" },
  ];

  const quickLinks = [
    {
      icon: "💬",
      title: "New Chat",
      description: "Start a conversation",
      link: "/chat",
      gradient: "from-blue-500 via-blue-600 to-indigo-600",
    },
    {
      icon: "⚙️",
      title: "Settings",
      description: "Configure preferences",
      link: "/settings",
      gradient: "from-purple-500 via-purple-600 to-pink-600",
    },
    {
      icon: "📋",
      title: "Rules",
      description: "Manage agent rules",
      link: "/rules",
      gradient: "from-green-500 via-green-600 to-emerald-600",
    },
    {
      icon: "🔌",
      title: "MCP Servers",
      description: "Connect servers",
      link: "/mcp-servers",
      gradient: "from-orange-500 via-orange-600 to-red-600",
    },
    {
      icon: "📊",
      title: "Analytics",
      description: "View statistics",
      link: "/analytics",
      gradient: "from-pink-500 via-rose-600 to-red-600",
    },
    {
      icon: "🗂️",
      title: "History",
      description: "Past conversations",
      link: "/history",
      gradient: "from-cyan-500 via-teal-600 to-blue-600",
    },
  ];

  const recentActivity = [
    {
      action: "Completed code review task",
      time: "2 hours ago",
      icon: "✅",
      type: "success",
    },
    {
      action: "Started new planning session",
      time: "5 hours ago",
      icon: "📋",
      type: "info",
    },
    {
      action: "Connected MCP server: GitHub",
      time: "1 day ago",
      icon: "🔌",
      type: "success",
    },
    {
      action: "Updated system rules",
      time: "2 days ago",
      icon: "⚙️",
      type: "info",
    },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-br from-black via-[#0a0000] to-black"
          : "bg-gradient-to-br from-[#F6EFD2] via-[#E2DDB4] to-[#F6EFD2]"
      }`}
    >
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full bg-[#E43636] blur-3xl opacity-10 -top-48 -left-48 animate-pulse"></div>
        <div
          className="absolute w-96 h-96 rounded-full bg-[#E43636] blur-3xl opacity-10 -bottom-48 -right-48 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* Navbar */}
      <nav
        className={`sticky top-0 z-40 backdrop-blur-xl ${
          isDark ? "bg-black/50" : "bg-white/50"
        } border-b ${
          isDark ? "border-[#E43636]/20" : "border-[#E43636]/30"
        } shadow-2xl`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E43636] to-[#ff6b6b] flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1
                  className={`text-xl font-bold ${
                    isDark ? "text-[#F6EFD2]" : "text-black"
                  }`}
                >
                  Agentic AI
                </h1>
                <p
                  className={`text-xs ${
                    isDark ? "text-[#E2DDB4]/60" : "text-black/60"
                  }`}
                >
                  Dashboard
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                className={`px-4 py-2 rounded-lg ${
                  isDark
                    ? "bg-[#E2DDB4]/10 text-[#E2DDB4] hover:bg-[#E2DDB4]/20"
                    : "bg-black/10 text-black hover:bg-black/20"
                } transition-all duration-300 text-sm font-medium`}
              >
                🔔 Notifications
              </button>
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E43636] to-[#ff6b6b] flex items-center justify-center shadow-lg hover:scale-110 hover:rotate-12 transition-all duration-300"
                aria-label="Toggle theme"
              >
                <span className="text-lg">{isDark ? "☀️" : "🌙"}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative max-w-[1400px] mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1
            className={`text-4xl lg:text-5xl font-extrabold mb-3 ${
              isDark
                ? "bg-gradient-to-r from-[#F6EFD2] via-[#E43636] to-[#F6EFD2] bg-clip-text text-transparent"
                : "bg-gradient-to-r from-black via-[#E43636] to-black bg-clip-text text-transparent"
            }`}
          >
            Welcome back, {user.name.split(" ")[0]} 👋
          </h1>
          <p
            className={`text-lg ${
              isDark ? "text-[#E2DDB4]/80" : "text-black/70"
            }`}
          >
            Here's your AI workspace overview
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className={`relative overflow-hidden ${
                isDark
                  ? "bg-gradient-to-br from-[#1a0000]/80 to-black/80"
                  : "bg-gradient-to-br from-white/80 to-[#E2DDB4]/50"
              } backdrop-blur-xl border ${
                isDark ? "border-[#E43636]/30" : "border-[#E43636]/40"
              } rounded-2xl p-6 hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 group`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E43636]/10 rounded-full blur-3xl group-hover:bg-[#E43636]/20 transition-all duration-300"></div>
              <div className="relative flex items-start justify-between">
                <div>
                  <p
                    className={`text-sm font-medium mb-2 ${
                      isDark ? "text-[#E2DDB4]/70" : "text-black/70"
                    }`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`text-4xl font-bold ${
                      isDark ? "text-[#F6EFD2]" : "text-black"
                    }`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-sm text-[#E43636] font-semibold mt-2">
                    {stat.change}
                  </p>
                </div>
                <div className="text-4xl opacity-80">{stat.icon}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Left Column - Profile & Token Usage */}
          <div className="lg:col-span-1 space-y-6">
            {/* User Profile Card */}
            <div
              className={`${
                isDark
                  ? "bg-gradient-to-br from-[#1a0000]/80 to-black/80"
                  : "bg-gradient-to-br from-white/80 to-[#E2DDB4]/50"
              } backdrop-blur-xl border ${
                isDark ? "border-[#E43636]/30" : "border-[#E43636]/40"
              } rounded-3xl p-8 shadow-2xl`}
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#E43636] to-[#ff6b6b] flex items-center justify-center text-3xl font-bold text-white shadow-xl mb-4">
                  {user.avatar}
                </div>
                <h2
                  className={`text-2xl font-bold mb-1 ${
                    isDark ? "text-[#F6EFD2]" : "text-black"
                  }`}
                >
                  {user.name}
                </h2>
                <p
                  className={`text-sm mb-3 ${
                    isDark ? "text-[#E2DDB4]/70" : "text-black/70"
                  }`}
                >
                  {user.email}
                </p>
                <div className="flex gap-2 items-center">
                  <span className="px-4 py-1.5 bg-gradient-to-r from-[#E43636] to-[#ff6b6b] text-white rounded-full text-sm font-semibold shadow-lg">
                    {user.plan}
                  </span>
                  <span
                    className={`text-xs ${
                      isDark ? "text-[#E2DDB4]/60" : "text-black/60"
                    }`}
                  >
                    Since {user.joinedDate}
                  </span>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-[#E43636] to-[#ff6b6b] text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
                Edit Profile
              </button>
            </div>

            {/* Token Usage Card */}
            <div
              className={`${
                isDark
                  ? "bg-gradient-to-br from-[#1a0000]/80 to-black/80"
                  : "bg-gradient-to-br from-white/80 to-[#E2DDB4]/50"
              } backdrop-blur-xl border ${
                isDark ? "border-[#E43636]/30" : "border-[#E43636]/40"
              } rounded-3xl p-8 shadow-2xl`}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className={`text-xl font-bold ${
                    isDark ? "text-[#F6EFD2]" : "text-black"
                  }`}
                >
                  Token Usage
                </h3>
                <span className="text-2xl">⚡</span>
              </div>

              <div className="mb-6">
                <div className="flex justify-between mb-3">
                  <span
                    className={`text-sm font-medium ${
                      isDark ? "text-[#E2DDB4]/70" : "text-black/70"
                    }`}
                  >
                    {tokenUsage.used.toLocaleString()} used
                  </span>
                  <span className="text-sm font-bold text-[#E43636]">
                    {tokenUsage.percentage}%
                  </span>
                </div>
                <div
                  className={`w-full h-3 ${
                    isDark ? "bg-[#E2DDB4]/10" : "bg-black/10"
                  } rounded-full overflow-hidden shadow-inner`}
                >
                  <div
                    className="h-full bg-gradient-to-r from-[#E43636] via-[#ff6b6b] to-[#E43636] rounded-full transition-all duration-1000 shadow-lg"
                    style={{ width: `${tokenUsage.percentage}%` }}
                  ></div>
                </div>
                <p
                  className={`text-xs mt-2 ${
                    isDark ? "text-[#E2DDB4]/60" : "text-black/60"
                  }`}
                >
                  Resets on {tokenUsage.resetDate}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div
                  className={`${
                    isDark ? "bg-[#E2DDB4]/5" : "bg-black/5"
                  } rounded-xl p-4`}
                >
                  <p
                    className={`text-xs mb-1 ${
                      isDark ? "text-[#E2DDB4]/70" : "text-black/70"
                    }`}
                  >
                    Used
                  </p>
                  <p className="text-2xl font-bold text-[#E43636]">
                    {(tokenUsage.used / 1000).toFixed(1)}K
                  </p>
                </div>
                <div
                  className={`${
                    isDark ? "bg-[#E2DDB4]/5" : "bg-black/5"
                  } rounded-xl p-4`}
                >
                  <p
                    className={`text-xs mb-1 ${
                      isDark ? "text-[#E2DDB4]/70" : "text-black/70"
                    }`}
                  >
                    Remaining
                  </p>
                  <p className="text-2xl font-bold text-[#E43636]">
                    {((tokenUsage.total - tokenUsage.used) / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>

              <button className="w-full bg-gradient-to-r from-[#E43636] to-[#ff6b6b] text-white py-3 rounded-xl font-semibold hover:scale-[1.02] hover:shadow-2xl transition-all duration-300">
                Upgrade Plan
              </button>
            </div>
          </div>

          {/* Right Column - Quick Actions & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? "text-[#F6EFD2]" : "text-black"
                }`}
              >
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {quickLinks.map((link, index) => (
                  <a
                    key={index}
                    href={link.link}
                    className={`relative overflow-hidden ${
                      isDark
                        ? "bg-gradient-to-br from-[#1a0000]/80 to-black/80"
                        : "bg-gradient-to-br from-white/80 to-[#E2DDB4]/50"
                    } backdrop-blur-xl border ${
                      isDark ? "border-[#E43636]/20" : "border-[#E43636]/30"
                    } rounded-2xl p-6 hover:border-[#E43636] hover:-translate-y-2 hover:shadow-2xl transition-all duration-300 group`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#E43636]/0 to-[#E43636]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative">
                      <div
                        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${link.gradient} flex items-center justify-center text-2xl shadow-lg mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                      >
                        {link.icon}
                      </div>
                      <h3
                        className={`text-lg font-bold mb-1 ${
                          isDark ? "text-[#F6EFD2]" : "text-black"
                        }`}
                      >
                        {link.title}
                      </h3>
                      <p
                        className={`text-sm ${
                          isDark ? "text-[#E2DDB4]/70" : "text-black/70"
                        }`}
                      >
                        {link.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h2
                className={`text-2xl font-bold mb-6 ${
                  isDark ? "text-[#F6EFD2]" : "text-black"
                }`}
              >
                Recent Activity
              </h2>
              <div
                className={`${
                  isDark
                    ? "bg-gradient-to-br from-[#1a0000]/80 to-black/80"
                    : "bg-gradient-to-br from-white/80 to-[#E2DDB4]/50"
                } backdrop-blur-xl border ${
                  isDark ? "border-[#E43636]/30" : "border-[#E43636]/40"
                } rounded-3xl p-6 shadow-2xl`}
              >
                <div className="space-y-3">
                  {recentActivity.map((activity, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-4 p-4 rounded-xl ${
                        isDark ? "bg-[#E2DDB4]/5" : "bg-black/5"
                      } hover:${
                        isDark ? "bg-[#E43636]/10" : "bg-[#E43636]/15"
                      } hover:scale-[1.01] transition-all duration-300 group`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E43636] to-[#ff6b6b] flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold mb-1 ${
                            isDark ? "text-[#F6EFD2]" : "text-black"
                          } truncate`}
                        >
                          {activity.action}
                        </p>
                        <p
                          className={`text-sm ${
                            isDark ? "text-[#E2DDB4]/60" : "text-black/60"
                          }`}
                        >
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className={`relative text-center py-8 px-8 mt-12 ${
          isDark
            ? "bg-black/50 border-t border-[#E43636]/20"
            : "bg-white/50 border-t border-[#E43636]/30"
        } backdrop-blur-xl`}
      >
        <p
          className={`text-sm ${
            isDark ? "text-[#E2DDB4]/60" : "text-black/60"
          }`}
        >
          © 2024 Agentic AI System. Transforming code through intelligent
          orchestration.
        </p>
      </footer>
    </div>
  );
}
