import { FiMenu } from "react-icons/fi";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { Link } from "react-router-dom";
import Footer from "../Components/Footer";

import type { ReactNode } from "react";

function HomeLayout({ children }: { children: ReactNode }) {
  function changeWidth() {
    const drawerSide = document.getElementsByClassName("drawer-side");
    (drawerSide[0] as HTMLElement).style.width = "0px";
  }

  function hideDrawer() {
    const element = document.getElementsByClassName("drawer-toggle");
    (element[0] as HTMLInputElement).checked = false;

    changeWidth();
  }

  return (
    <div className="min-h-[90vh]">
      <div className="drawer absolute left-0 z-50 w-fit">
        <input type="checkbox" className="drawer-toggle" id="my-drawer" />
        <div className="drawer-content">
          <label htmlFor="my-drawer" className="cursor-pointer relative">
            <FiMenu
              onClick={changeWidth}
              size={"32px"}
              className="font-bold text-white m-4"
            />
          </label>
        </div>
        <div className="drawer-side w-0">
          <label htmlFor="my-drawer" className="drawer-overlay"></label>
          <ul className="menu p-4 w-48 sm:w-80 bg-base-100 text-base-content relative">
            <li className="w-fit absolute right-2 z-50">
              <button onClick={hideDrawer}>
                <IoIosCloseCircleOutline size={24} />
              </button>
            </li>
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/courses"}>All courses</Link>
            </li>
            <li>
              <Link to={"/contact"}>Contact us</Link>
            </li>
            <li>
              <Link to={"/about"}>About us</Link>
            </li>
          </ul>
        </div>
      </div>
      {children}
      <Footer />
    </div>
  );
}

export default HomeLayout;
