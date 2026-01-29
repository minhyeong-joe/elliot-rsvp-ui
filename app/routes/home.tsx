import { NavLink } from "react-router";
import type { Route } from "./+types/home";

import "~/styles/home.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Elliot RSVP" },
    { name: "description", content: "RSVP for Elliot's First Birthday" },
  ];
}

export default function Home() {
  return (
    <main>
      <img src='img/balloons.png' alt="Balloons" />
      <div className="container mx-auto pb-8 px-4">
        {/* version 1 English */}
        {/* <h2 className="text-2xl md:text-3xl lg:text-4xl mt-12 mb-4 text-center welcome-text text-cursive">Join us to celebrate</h2>
        <h2 className="text-3xl md:text-4xl lg:text-6xl mb-12 text-center text-playful">Elliot's First Birthday Party</h2> */}
        {/* verison 2 Korean */}
        <h2 className="text-3xl md:text-4xl lg:text-6xl mt-12 mb-4 text-center text-playful title">은성이의 돌잔치에 여러분을 초대합니다</h2>
        <h2 className="text-2xl md:text-3xl lg:text-4xl mb-12 text-center text-formal subtitle">함께해 주셔서 은성이의 첫 생일을 축복해 주세요</h2>
        
        <div className="frame-container mx-auto mb-12">
          <div className="frame-border"></div>
          <img src="/img/temp.jpg" alt="Baby photo" />
        </div>

        <div className="info text-center mb-12">
          <p className="mb-2 text-playful text-xl lg:text-2xl"><b>일시:</b> 2026.05.02 12:00 PM - 1:30 PM</p>
          <div className="flex justify-center">
            <div className="text-left">
              <p className="mb-2 text-playful text-xl lg:text-2xl"><b>장소:</b> dPlace Steak & Pasta</p>
              <p className="mb-1 text-playful text-xl lg:text-2xl ml-10 lg:ml-14">1901 W Malvern Ave.</p>
              <p className="mb-1 text-playful text-xl lg:text-2xl ml-10 lg:ml-14">Fullerton, CA 92833</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <NavLink to="/rsvp" className="bg-cyan-500 text-white px-12 py-3 rounded-3xl hover:bg-indigo-600 transition duration-300 text-playful text-2xl lg:text-3xl">
            RSVP
          </NavLink>
          <p className="mt-5 text-sm text-gray-600">
            참석 여부를 알려주시면 준비에 큰 도움이 됩니다!
          </p>
          <p className="mt-1 text-sm text-gray-600">
            [응답 마감일: 2월 28일]
          </p>
        </div>
      </div>
      
      <img src='img/balloons_footer.png' alt="Balloons" />
    </main>
  );
}
