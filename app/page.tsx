import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-10">
      <div className="text-center max-w-2xl space-y-6">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
          Track Your Issues with Ease
        </h1>
        <p className="text-lg md:text-xl text-gray-600">
          Our Issue Tracker helps you stay organized and on top of every task,
          issue, and bug. Get started now and keep your projects running
          smoothly.
        </p>
      </div>

      <Link href="/issues">
        <button className="mt-8 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">
          View Issues
        </button>
      </Link>

      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
        <div className="text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 5v14m7-7H5"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800">
            Track Progress
          </h3>
          <p className="text-gray-600">
            Monitor the status of your issues in real-time. Stay updated and
            never miss a deadline.
          </p>
        </div>

        <div className="text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 9l4 4m0 0l-4 4m4-4H3"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800">Collaborate</h3>
          <p className="text-gray-600">
            Assign tasks and communicate with team members directly within the
            platform.
          </p>
        </div>

        <div className="text-center space-y-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-16 h-16 mx-auto text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 5h18M3 10h18m-9 5h9"
            />
          </svg>
          <h3 className="text-xl font-semibold text-gray-800">
            Organize Tasks
          </h3>
          <p className="text-gray-600">
            Group your issues into projects, prioritize them, and stay organized
            for successful project management.
          </p>
        </div>
      </div>

      <footer className="mt-20 text-center text-gray-600">
        <p>&copy; 2025 Issue Tracker. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
