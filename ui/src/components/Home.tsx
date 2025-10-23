import { useState } from "react";

export default function Home() {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  const agents = [
    {
      icon: "🧠",
      title: "Supervisor",
      description:
        "Central orchestrator that intelligently delegates tasks across specialized agents, monitors progress, and ensures cohesive workflow execution.",
    },
    {
      icon: "📋",
      title: "Planner",
      description:
        "Designs logical steps and project structures, analyzing context to create efficient, maintainable plans with clear module hierarchies.",
    },
    {
      icon: "⚡",
      title: "Coder",
      description:
        "Transforms plans into production-quality code, implementing complete functionality with robust error handling and clean architecture.",
    },
    {
      icon: "🚀",
      title: "Executor",
      description:
        "Validates and runs code in sandboxed environments, executing tests and providing real-time feedback on program behavior.",
    },
  ];

  const workflowSteps = [
    {
      number: "01",
      title: "Analysis & Planning",
      description:
        "Deep code analysis identifies gaps, missing implementations, and architectural opportunities. Strategic plans are generated with prioritized tasks and dependency mapping.",
    },
    {
      number: "02",
      title: "Code Enhancement",
      description:
        "Expert coder agent implements complete functionality, validates library usage against documentation, and ensures best practices throughout the codebase.",
    },
    {
      number: "03",
      title: "Testing & Validation",
      description:
        "Comprehensive test suites execute in isolated Docker environments. Errors are categorized, analyzed, and resolved through intelligent feedback loops.",
    },
    {
      number: "04",
      title: "Continuous Reflection",
      description:
        "Every phase includes reflection checkpoints to track progress, adjust plans dynamically, and document learnings for improved future execution.",
    },
  ];

  const capabilities = [
    {
      icon: "🎯",
      title: "Intelligent Delegation",
      description:
        "Dynamic task routing based on context, skipping unnecessary steps and optimizing workflow efficiency.",
    },
    {
      icon: "🔍",
      title: "Deep Code Analysis",
      description:
        "Understands structure, dependencies, and quality metrics to identify improvement opportunities.",
    },
    {
      icon: "🛠️",
      title: "Complete Implementation",
      description:
        "Fills gaps in partial code with proper error handling, validation, and edge case management.",
    },
    {
      icon: "📚",
      title: "Documentation Validation",
      description:
        "Cross-references library usage against official docs to ensure correctness and best practices.",
    },
    {
      icon: "🐳",
      title: "Sandboxed Execution",
      description:
        "Secure Docker environments for safe code testing with full dependency management.",
    },
    {
      icon: "🔄",
      title: "Error Resolution Loop",
      description:
        "Systematic error categorization, root cause analysis, and intelligent fix implementation.",
    },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 ${isDark ? "bg-black/80" : "bg-[#F6EFD2]/80"} backdrop-blur-md border-b ${isDark ? "border-[#E43636]/30" : "border-[#E43636]/50"}`}
      >
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div
            className={`text-2xl font-bold ${isDark ? "text-[#F6EFD2]" : "text-black"}`}
          >
            Agentic AI
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/chat"
              className="bg-[#E43636] text-[#F6EFD2] px-6 py-2 rounded-full font-semibold hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Chat
            </a>
            <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-full bg-[#E43636] flex items-center justify-center text-xl shadow-lg hover:scale-110 hover:rotate-[15deg] transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </nav>
      <div
        className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-black text-[#F6EFD2]" : "bg-[#F6EFD2] text-black"}`}
      >
        {/* Hero Section */}
        <section
          className={`min-h-screen flex flex-col justify-center items-center px-8 py-8 relative ${isDark ? "bg-gradient-to-br from-black to-[#1a0000]" : "bg-gradient-to-br from-[#F6EFD2] to-[#E2DDB4]"}`}
        >
          <div className="absolute inset-0 opacity-50 pointer-events-none">
            <div className="absolute w-96 h-96 rounded-full bg-[#E43636] blur-3xl opacity-20 top-1/2 left-1/4 animate-pulse"></div>
            <div
              className="absolute w-96 h-96 rounded-full bg-[#E43636] blur-3xl opacity-20 top-1/2 right-1/4 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>
          </div>

          <div className="relative z-10 text-center max-w-6xl">
            <h1
              className={`text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 ${isDark ? "bg-gradient-to-r from-[#F6EFD2] via-[#E2DDB4] to-[#F6EFD2]" : "bg-gradient-to-r from-black via-[#E43636] to-black"} bg-clip-text text-transparent`}
            >
              Agentic AI System
            </h1>
            <p
              className={`text-xl md:text-3xl mb-12 font-light ${isDark ? "text-[#E2DDB4]" : "text-black"}`}
            >
              Transform incomplete code into{" "}
              <span className="text-[#E43636] font-semibold">
                production-ready solutions
              </span>{" "}
              through intelligent multi-agent orchestration
            </p>
            <button
              onClick={scrollToFeatures}
              className="bg-[#E43636] text-[#F6EFD2] px-12 py-4 rounded-full text-xl font-semibold hover:-translate-y-1 hover:shadow-2xl transition-all duration-300"
            >
              Explore the System
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className={`py-20 px-8 ${isDark ? "bg-black" : "bg-[#F6EFD2]"}`}
        >
          <div className="max-w-7xl mx-auto">
            <h2
              className={`text-4xl md:text-5xl font-bold text-center mb-16 ${isDark ? "text-[#F6EFD2]" : "text-black"}`}
            >
              Meet Your AI Agents
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {agents.map((agent, index) => (
                <div
                  key={index}
                  className={`${isDark ? "bg-gradient-to-br from-[#1a0000] to-black" : "bg-gradient-to-br from-white to-[#E2DDB4]"} border-2 border-[#E43636] rounded-3xl p-8 hover:-translate-y-3 hover:shadow-2xl transition-all duration-300 relative overflow-hidden group`}
                >
                  <div className="absolute inset-0 bg-[#E43636] opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-3xl"></div>
                  <div className="text-5xl mb-4">{agent.icon}</div>
                  <h3 className="text-2xl font-bold text-[#E43636] mb-4">
                    {agent.title}
                  </h3>
                  <p
                    className={`${isDark ? "text-[#E2DDB4]" : "text-black"} leading-relaxed`}
                  >
                    {agent.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Section */}
        <section
          className={`py-20 px-8 ${isDark ? "bg-gradient-to-b from-black to-[#0a0000]" : "bg-gradient-to-b from-[#E2DDB4] to-[#F6EFD2]"}`}
        >
          <div className="max-w-5xl mx-auto">
            <h2
              className={`text-4xl md:text-5xl font-bold text-center mb-16 ${isDark ? "text-[#F6EFD2]" : "text-black"}`}
            >
              Intelligent Workflow
            </h2>
            <div className="flex flex-col gap-8">
              {workflowSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex flex-col md:flex-row items-center md:items-start gap-8 ${isDark ? "bg-[#E43636]/5" : "bg-black/5"} p-8 rounded-2xl border-l-4 border-[#E43636] hover:${isDark ? "bg-[#E43636]/10" : "bg-[#E43636]/15"} hover:translate-x-3 transition-all duration-300`}
                >
                  <div className="text-5xl font-extrabold text-[#E43636] min-w-[80px]">
                    {step.number}
                  </div>
                  <div>
                    <h3
                      className={`text-2xl font-bold mb-2 ${isDark ? "text-[#F6EFD2]" : "text-black"}`}
                    >
                      {step.title}
                    </h3>
                    <p
                      className={`${isDark ? "text-[#E2DDB4]" : "text-black"} leading-relaxed`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Capabilities Section */}
        <section
          className={`py-20 px-8 ${isDark ? "bg-black" : "bg-[#F6EFD2]"}`}
        >
          <div className="max-w-7xl mx-auto">
            <h2
              className={`text-4xl md:text-5xl font-bold text-center mb-16 ${isDark ? "text-[#F6EFD2]" : "text-black"}`}
            >
              Core Capabilities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((capability, index) => (
                <div
                  key={index}
                  className={`p-6 ${isDark ? "bg-[#E2DDB4]/5" : "bg-black/5"} rounded-xl border ${isDark ? "border-[#E43636]/20" : "border-[#E43636]/30"} hover:border-[#E43636] hover:${isDark ? "bg-[#E43636]/5" : "bg-[#E43636]/10"} transition-all duration-300`}
                >
                  <h4 className="text-[#E43636] font-bold text-xl mb-2">
                    {capability.icon} {capability.title}
                  </h4>
                  <p
                    className={`${isDark ? "text-[#E2DDB4]" : "text-black"} text-sm leading-relaxed`}
                  >
                    {capability.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer
          className={`text-center py-12 px-8 ${isDark ? "bg-black border-t border-[#E43636]/30 text-[#E2DDB4]" : "bg-[#E2DDB4] border-t border-[#E43636]/50 text-black"}`}
        >
          <p className="text-lg">
            Agentic AI System - Transforming Code Through Intelligent
            Orchestration
          </p>
          <p className="mt-4 text-sm opacity-70">
            Systematic. Adaptive. Production-Ready.
          </p>
        </footer>
      </div>
    </>
  );
}
