import '../src/index.css'; 

export const Login = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6 -mt-6 ">
      <img src="/logo.png" alt="ziva" className="w-28 h-18 ml-3" />
      <h1 className="text-2xl text-white font-helvetica tracking-extra-tight -mt-16">
        <span className="italic text-purple-400 twinkle">smarter-</span>
        <span> email just a step away!</span>
      </h1>
      <div className="flex space-x-8">
      <button
        className="w-16 h-16 bg-white rounded-full flex items-center justify-center"
        onClick={() => window.location.href = 'http://localhost:3000/auth'}
      >
        <img className="w-10 h-10" src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000" alt="Google" />
      </button>

        {/* <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
          <img className="w-10 h-10" src="https://img.icons8.com/?size=100&id=13640&format=png&color=000000" alt="Outlook" />
        </button> */}
      </div>
    </div>
  );
}

