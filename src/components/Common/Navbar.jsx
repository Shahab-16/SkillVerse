import React from "react";
import { Link } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { FaAngleDown } from "react-icons/fa";
import {useLocation,matchPath} from "react-router-dom"
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";

const Navbar = () => {
    const location = useLocation();
    const matchRoute = (route) => {
        return matchPath({path:route},location.pathname)
    }
    const {user}=useSelector((state)=>state.profile);
    const {token}=useSelector((state)=>state.auth);
    const {totalItems}=useSelector((state)=>state.cart);


  return (
    <div className="h-16 border-b-[1px] border-richblack-700">
      <div className="w-11/12 flex justify-around items-center mx-auto py-3">
        <div className="flex items-center justify-center">
          <Link to="/">
            <p className="text-2xl font-bold text-white">SKILLVERSE</p>
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {NavbarLinks.map((link) => {
            return link.title === "Catalog" ? ( 
              <div key={link?.path} className="flex items-center">
                <p className="text-lg text-richblack-25">{link.title}</p>
                <FaAngleDown className="w-4 h-5 text-white pt-1" /> 
              </div>
            ) : (
              <Link key={link.path} to={link?.path}>
                <p className={`${matchRoute(link?.path)? "text-yellow-50":"text-white"}`}>{link.title}</p>
              </Link>
            );
          })}
        </div>

        <div>
          {
            user && user?.accountType!=="Instructor" && (
              <Link to={"/dashboard/my-courses"} className="relative">
              <AiOutlineShoppingCart/>
              {
                totalItems>0 && (
                  <span>{totalItems}</span>
                )
              }
              </Link>
            )
          }

          {
            token===null && (
              <Link to={"/login"}>
              <button className="text-white bg-richblack-600 p-2 mr-3 rounded-md">Login</button>
              </Link>
            )
          }
          {
            token===null && (
              <Link to={"/signup"}>
                <button className="text-white bg-richblack-600 p-2 rounded-md">
                  Signup
                </button>
              </Link>
            )
          }
        </div>


      </div>
    </div>
  );
};

export default Navbar;
