import React from "react";
import bgimage from "../assets/art-gallery-view.jpg"
import heroimage from "../assets/heroimage.jpg"

const Hero = () => {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bgimage})`
        }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Side - Text Content */}
            <div className="text-white space-y-8">
              {/* Main Title */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  A better way{" "}
                  <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    to showcase
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-green-500 bg-clip-text text-transparent">
                    your talents
                  </span>!
                </h1>
                
                {/* Decorative Line */}
                <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full"></div>
              </div>

              {/* Subtitle */}
              <p className="text-xl md:text-2xl text-gray-200 leading-relaxed max-w-2xl">
                Painting is poetry that is seen rather than felt, and poetry is 
                painting that is felt rather than seen.
              </p>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button 
                  className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-center cursor-pointer"
                  onClick={() => window.location.href = '/gallery'}
                >
                  Get Started
                </button>

                <button
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 backdrop-blur-sm"
                  onClick={() =>
                    document.getElementById("my_modal_1").showModal()
                  }
                >
                  Learn More
                </button>
              </div>
            </div>

            {/* Right Side - Featured Image */}
            <div className="flex justify-center lg:justify-center">
              <div className="relative">
                {/* Image Frame with Styling */}
                <div className="relative bg-gradient-to-br from-emerald-400 to-green-500 p-1 rounded-2xl shadow-2xl transform hover:rotate-1 transition-transform duration-300">
                  <div className="bg-white p-4 rounded-xl">
                    <img
                      src={heroimage}
                      alt="Featured Artwork"
                      className="w-full max-w-[200px] md:max-w-[250px] lg:max-w-[400px] h-auto max-h-[400px] md:max-h-[450px] lg:max-h-[500px] object-cover rounded-lg shadow-lg"
                    />
                  </div>
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-emerald-400 rounded-full opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-4 -left-4 w-8 h-8 bg-green-500 rounded-full opacity-40 animate-pulse delay-700"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <dialog id="my_modal_1" className="modal">
        <div className="modal-box bg-white">
          <h3 className="font-bold text-2xl text-gray-900 mb-4">Discover Art Like Never Before</h3>
          <p className="py-4 text-gray-700 leading-relaxed">
            Welcome to a revolutionary platform where artists can showcase their masterpieces 
            and art enthusiasts can discover incredible talent. Our curated gallery features 
            works from emerging and established artists, creating a vibrant community of 
            creative expression.
          </p>
          <div className="modal-action">
            <button 
              className="btn bg-gradient-to-r from-emerald-500 to-green-600 text-white border-none hover:from-emerald-600 hover:to-green-700"
              onClick={() => document.getElementById("my_modal_1").close()}
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Hero;