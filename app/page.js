import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="flex min-h-[48vh] flex-col items-center justify-center px-4 py-10 text-white sm:px-6">
        <div className="flex w-full max-w-4xl flex-col items-center justify-center gap-3 text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-3xl font-bold sm:text-4xl md:text-5xl">
            <span>Welcome to Get me A Chai</span>
            <span>
              <img src="/tea.gif" width={72} alt="Tea animation" className="sm:w-[88px]" />
            </span>
          </div>

          <p className="max-w-4xl text-sm text-slate-200 sm:text-base md:text-lg">A crowdfunding platform for content creators. Get funded by your fans!. Start your journey today!</p>
          <div className="my-2 flex flex-wrap items-center justify-center gap-2">
            <Link href="/login" passHref>
              <button type="button" className="rounded-lg bg-linear-to-br from-purple-600 to-blue-500 px-4 py-2.5 text-center text-sm leading-5 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-linear-to-bl dark:focus:ring-blue-800">Start Here</button>
            </Link>
            <Link href="/about" passHref>
              <button type="button" className="rounded-lg bg-linear-to-br from-purple-600 to-blue-500 px-4 py-2.5 text-center text-sm leading-5 font-medium text-white focus:outline-none focus:ring-4 focus:ring-blue-300 hover:bg-linear-to-bl dark:focus:ring-blue-800">Read More</button>
            </Link>
          </div>
        </div>
      </div>

      <hr className="my-12 h-px border-t-0 bg-transparent bg-linear-to-r from-transparent via-neutral-500 to-transparent opacity-40 dark:via-neutral-400" />

      <div className="container mx-auto mb-20 px-4 text-white sm:px-6">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Your Fans can buy you a Cup of Chai</h2>
        <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="item mt-2 flex flex-col items-center justify-center space-y-3">
            <img src="/man.gif" className="bg-slate-400 rounded-full p-2 text-black" width={66} alt="" />
            <h3 className="font-bold text-xl">Fund Yourself</h3>
            <p className="w-full max-w-xs text-center">Allow your supporters to contribute to your creative endeavors.</p>
          </div>
          <div className="item mt-2 flex flex-col items-center justify-center space-y-3">
            <img src="/coin.gif" className="bg-slate-400 rounded-full p-2 text-black" width={66} alt="" />
            <h3 className="font-bold text-xl">Earn Income</h3>
            <p className="w-full max-w-xs text-center">Turn your passion into a sustainable income stream.</p>
          </div>
          <div className="item mt-2 flex flex-col items-center justify-center space-y-3 sm:col-span-2 lg:col-span-1">
            <img src="/group.gif" className="bg-slate-400 rounded-full p-2 text-black" width={66} alt="" />
            <h3 className="font-bold text-xl">Build Community</h3>
            <p className="w-full max-w-xs text-center">Build a community of loyal fans who believe in your vision.</p>
          </div>
        </div>
      </div>
{/* 
      <hr className="my-12 h-px border-t-0 bg-transparent bg-linear-to-r from-transparent via-neutral-500 to-transparent opacity-40 dark:via-neutral-400" />

      <div className="container flex flex-col gap-7 justify-center items-center text-white mx-auto mb-20">
        <h2 className="text-center font-bold text-3xl">Learn More About Us</h2>
        <iframe width="460" height="260" src="https://www.youtube.com/embed/QtaorVNAwbI?si=J_NalEP-nAeUOlQE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div> */}


    </>
  );
}
