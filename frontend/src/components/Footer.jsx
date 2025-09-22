import { Facebook } from "lucide-react";
import { Instagram } from "lucide-react";
import { Github } from "lucide-react";
import { Twitter } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-20 py-24 bg-[#F0F0F0] max-md:px-5">
      <div className="flex justify-between flex-wrap gap-5 max-md:flex-col max-md:items-center max-md:text-center">
        <div className="flex flex-col gap-[25px] w-[25%] max-md:w-11/12 max-md:items-center">
          <figure>
            <img className="max-md:w-24 max-xl:w-24" src="/infoMart.png" alt="logo png image" />
          </figure>
          <p className="text-sm text-[#00000099]">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique a ad aperiam tenetur iusto illum iste qui et exercitationem sequi, 
            repudiandae quis nihil consectetur temporibus architecto minus, quae commodi quisquam.
          </p>
          <ul className="flex items-center gap-2">
            <li>
              <Link
                to={`/`}
                className="bg-white border border-[#00000033] w-[28px] rounded-full text-black hover:bg-black hover:text-white transition-all ease-in-out duration-200 flex justify-center items-center h-[28px]"
              >
                <Twitter size={12} />
              </Link>
            </li>
            <li>
              <Link
                to={`/`}
                className="bg-white border border-[#00000033] w-[28px] rounded-full text-black hover:bg-black hover:text-white transition-all ease-in-out duration-200 flex justify-center items-center h-[28px]"
              >
                <Facebook size={12} />
              </Link>
            </li>
            <li>
              <Link
                to={`/`}
                className="bg-white border border-[#00000033] w-[28px] rounded-full text-black hover:bg-black hover:text-white transition-all ease-in-out duration-200 flex justify-center items-center h-[28px]"
              >
                <Instagram size={12} />
              </Link>
            </li>
            <li>
              <Link
                to={`/`}
                className="bg-white border border-[#00000033] w-[28px] rounded-full text-black hover:bg-black hover:text-white transition-all ease-in-out duration-200 flex justify-center items-center h-[28px]"
              >
                <Github size={12} />
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-medium text-black uppercase">
            company
          </h4>
          <ul className="flex flex-col gap-[20px] mt-[25px]">
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                About
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Features
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Works
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Careers
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-medium text-black uppercase">Help</h4>
          <ul className="flex flex-col gap-[20px] mt-[25px]">
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Customer Support
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Delivery Details
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Terms of Conditions
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-medium text-black uppercase">Faq</h4>
          <ul className="flex flex-col gap-[20px] mt-[25px]">
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Account
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Manage Deliveries
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Orders
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Payments
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-base font-medium text-black uppercase">
            Resources
          </h4>
          <ul className="flex flex-col gap-[20px] mt-[25px]">
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Free eBooks
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Development Tutorials
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                How to - Blog
              </Link>
            </li>
            <li>
              <Link className="text-[#00000099] text-base font-normal">
                Youtube Playlist
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-[#0000001A] my-7"></div>
      <div className="flex justify-between items-center max-sm:flex-col gap-5">
        <p className="text-[#00000099] text-sm">
          Info.mart © 2025-2026, All Rights Reserved
        </p>
        <img src="/paymentmethods.png" alt="payments methods image" />
      </div>
    </footer>
  );
};

export default Footer;
