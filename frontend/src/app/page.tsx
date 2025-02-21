import Link from 'next/link'

const Home: React.FC = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-white">
      <div className="text-center text-black">
        <h1 className="text-5xl font-bold mb-8 text-shadow-none tracking-wide">TRẦN VĨNNH KHANG</h1>
        <div className="flex justify-center space-x-20"> {/* Increased space between buttons */}
          <Link href="/history">
              <button className="bg-black hover:bg-white text-white hover:text-black font-bold w-40 py-3 px-6 rounded-none">
                View History
              </button>
          </Link>
          <Link href="/inference">
              <button className="bg-black hover:bg-white text-white hover:text-black font-bold w-40 py-3 px-6 rounded-none">
                Inference
              </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home
