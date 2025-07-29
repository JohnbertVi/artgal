import React from "react";
import { Link } from "react-router-dom";

import painthero from "../assets/painthero.png";
const Hero = () => {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content flex-col lg:flex-row-reverse">
          <img
            src={painthero}
            className="max-w-sm md:w-full sm:w-72 w-60"
            alt="herophoto"
          />
          <div>
            <h1 className="text-5xl font-bold">
              A better way{" "}
              <span className="text-primary">to showcase your talents</span>!
            </h1>
            <p className="py-6">
              Painting is poetry that is seen rather than felt, and poetry is
              painting that is felt rather than seen.
            </p>
            <div className="flex justify-center lg:justify-start gap-2">
              <Link to="/gallery" className="btn btn-secondary">
                Get Started
              </Link>

              <button
                className="btn"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                Learn More
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Sample!</h3>
                  <p className="py-4">Learn More sample content</p>
                  <div className="modal-action">
                    <form method="dialog">
                      {/* if there is a button in form, it will close the modal */}
                      <button className="btn">Close</button>
                    </form>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
