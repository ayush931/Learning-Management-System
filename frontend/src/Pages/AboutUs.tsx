import HomeLayout from "../Layouts/HomeLayout";
import aboutMainImage from '../Assets/images/aboutMainImage.png'
import nelsonMandela from '../Assets/images/nelsonMandela.png'
import apj from '../Assets/images/apj.png'
import einstein from '../Assets/images/einstein.png';
import billGates from '../Assets/images/billGates.png'
import steveJobs from '../Assets/images/steveJobs.png'

function AboutUs() {
  return (
    <HomeLayout>
      <div className="pl-20 pt-20 flex flex-col text-white">
        <div className="flex items-center gap-5 mx-10">
          <section className="w-1/2 space-y-10">
            <h1 className="text-5xl text-yellow-500 font-semibold">
              Affordable and quality education
            </h1>
            <p className="text-xl text-gray-200">
              Our goal is to provide the affordable and quality education to the world.
              We are providing the platform for the aspiring teachers and students to share their skills, creativity and knowledge to each other to empower and contribute in the growth and wellness of mankind.
            </p>
          </section>
          <div className="w-1/2">
            <img
              src={aboutMainImage}
              alt="About page main image"
              id="test1"
              style={{ filter: "drop-shadow(0px 10px 10px rgb(0,0,0))" }}
            />
          </div>
        </div>
        <div className="carousel w-1/2 m-auto my-16">
          <div id="slide1" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img src={nelsonMandela} alt="" className="w-40 rounded-full border-2 border-gray-400" />
              <h3 className="text-2xl font-semibold">Nelson Mandela</h3>
              <p className="text-xl text-gray-200">
                {"Education is the most powerful tool you can use to change the world."}
              </p>
              <div className="absolute flex justify-between transform -translate-y-1/2 right-5 left-5 top-1/2">
                <a href="#slide5" className="btn btn-circle">&lt;</a>
                <a href="#slide2" className="btn btn-circle">&gt;</a>
              </div>
            </div>
          </div>
          <div id="slide2" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img src={apj} alt="" className="w-40 rounded-full border-2 border-gray-400" />
              <h3 className="text-2xl font-semibold">APJ Abdul Kalam</h3>
              <p className="text-xl text-gray-200">
                {"Failure will never overtake me if my determination to succeed is strong enough."}
              </p>
              <div className="absolute flex justify-between transform -translate-y-1/2 right-5 left-5 top-1/2">
                <a href="#slide1" className="btn btn-circle">&lt;</a>
                <a href="#slide3" className="btn btn-circle">&gt;</a>
              </div>
            </div>
          </div>
          <div id="slide3" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img src={einstein} alt="" className="w-40 rounded-full border-2 border-gray-400" />
              <h3 className="text-2xl font-semibold">Albert Einstein</h3>
              <p className="text-xl text-gray-200">
                {"A person who never made a mistake never tried anything new."}
              </p>
              <div className="absolute flex justify-between transform -translate-y-1/2 right-5 left-5 top-1/2">
                <a href="#slide2" className="btn btn-circle">&lt;</a>
                <a href="#slide4" className="btn btn-circle">&gt;</a>
              </div>
            </div>
          </div>
          <div id="slide4" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img src={steveJobs} alt="" className="w-40 rounded-full border-2 border-gray-400" />
              <h3 className="text-2xl font-semibold">Steve Jobs</h3>
              <p className="text-xl text-gray-200">
                {"We don't get a chance to do that many things, and everyone should be really excellent."}
              </p>
              <div className="absolute flex justify-between transform -translate-y-1/2 right-5 left-5 top-1/2">
                <a href="#slide3" className="btn btn-circle">&lt;</a>
                <a href="#slide5" className="btn btn-circle">&gt;</a>
              </div>
            </div>
          </div>
          <div id="slide5" className="carousel-item relative w-full">
            <div className="flex flex-col items-center justify-center gap-4 px-[15%]">
              <img src={billGates} alt="" className="w-40 rounded-full border-2 border-gray-400" />
              <h3 className="text-2xl font-semibold">Bill Gates</h3>
              <p className="text-xl text-gray-200">
                {"Success is a loudy teacher. It sedues smater people into thinking they can't loose."}
              </p>
              <div className="absolute flex justify-between transform -translate-y-1/2 right-5 left-5 top-1/2">
                <a href="#slide4" className="btn btn-circle">&lt;</a>
                <a href="#slide1" className="btn btn-circle">&gt;</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeLayout>
  )
}

export default AboutUs;