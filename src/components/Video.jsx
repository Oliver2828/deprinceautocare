import React from 'react';

function Video() {
  return (
    <div className="bg-gradient-to-br from-red-600 to-red-700 p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
      {/* Video player */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="w-full h-full object-cover"
          controls={false}
          autoPlay
          muted
          loop
        >
          <source src="/src/assets/car4.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-red-900/70 to-red-800/50 z-10"></div>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-20">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-white">Auto_Care</h1>
          <p className="text-red-100 mt-2"> Retail Management System.</p>
        </div>
        
        <div className="hidden lg:block">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              {[1,2,3,4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-red-700 bg-red-400 flex items-center justify-center text-white font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
            </div>
           
          </div>
        </div>
      </div>
    </div>
  );
}

export default Video;
