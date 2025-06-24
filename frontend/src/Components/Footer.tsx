import { BsFacebook, BsLinkedin, BsInstagram, BsTwitter } from "react-icons/bs";

function Footer() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  return (
    <>
      {/* aligned at the bottom of the page */}
      <footer className="relative left-0 bottom-0 h-[10vh] py-5 flex flex-col sm:flex-row items-center justify-between text-white bg-gray-500 sm:px-20">
        <section className="text-lg">
          Copyright {year} | All rights reserved
        </section>
        <section className="flex items-center justify-center gap-5 text-2xl text-white">
          <a
            href=""
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsFacebook />
          </a>
          <a
            href=""
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsLinkedin />
          </a>
          <a
            href=""
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsInstagram />
          </a>
          <a
            href=""
            className="hover:text-yellow-500 transition-all ease-in-out duration-200"
          >
            <BsTwitter />
          </a>
        </section>
      </footer>
    </>
  );
}

export default Footer;
