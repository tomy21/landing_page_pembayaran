export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-700 text-white">
      <header className="flex justify-between items-center px-6 py-4 shadow-md">
        <h1 className="text-2xl font-bold">🚀 MyApp</h1>
        <nav className="space-x-4">
          <a href="#features" className="hover:underline">
            Features
          </a>
          <a href="#about" className="hover:underline">
            About
          </a>
          <a
            href="/login"
            className="bg-white text-blue-600 px-4 py-2 rounded-full font-semibold hover:bg-gray-100"
          >
            Login
          </a>
        </nav>
      </header>

      <main className="flex flex-col items-center justify-center text-center px-6 py-24">
        <h2 className="text-5xl font-extrabold mb-6 leading-tight drop-shadow-lg">
          Welcome to <span className="text-yellow-300">MyApp</span>
        </h2>
        <p className="text-xl max-w-2xl mb-8 text-white/90">
          Your ultimate solution for managing your operations smoothly,
          securely, and efficiently — all in one place.
        </p>
        <a
          href="/login"
          className="bg-yellow-300 text-black font-semibold px-8 py-3 rounded-full shadow-md hover:bg-yellow-400 transition"
        >
          Get Started
        </a>
      </main>

      <section id="features" className="bg-white text-gray-800 py-16 px-6">
        <h3 className="text-3xl font-bold text-center mb-12">
          Why Choose MyApp?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">🚀 Fast Integration</h4>
            <p>Start using MyApp with just a few clicks and minimal setup.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">🔒 Secure</h4>
            <p>End-to-end encryption to protect your data and users.</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition">
            <h4 className="text-xl font-semibold mb-2">📈 Scalable</h4>
            <p>Designed to grow with your business needs without compromise.</p>
          </div>
        </div>
      </section>

      <footer className="text-center py-6 text-white bg-black/20">
        &copy; {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}
