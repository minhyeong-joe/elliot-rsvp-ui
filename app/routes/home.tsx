import { NavLink } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Elliot RSVP" },
    { name: "description", content: "RSVP for Elliot's First Birthday" },
  ];
}

export default function Home() {
  return (
    <main>
      <img src='img/balloons.png' alt="Balloons" className="header" />
      <div className="container mx-auto pb-8 px-4">
        <h1 className="text-4xl font-bold mb-4 text-center">Welcome To</h1>
        <h2 className="text-4xl font-bold mb-4 text-center">은성이</h2>
        <h2 className="text-4xl font-bold mb-12 text-center">돌잔치</h2>
        
        <div className="frame-container mx-auto mb-12">
          <div className="frame-border"></div>
          <img src="/img/temp.jpg" alt="Baby photo" />
        </div>

        <div className="info text-center mb-12">
          <p className="mb-2"><b>일시:</b> 2026.05.02 12:00 PM - 1:30 PM</p>
          <div className="flex justify-center">
            <div className="text-left">
              <p className="mb-2"><b>장소:</b> dPlace Steak & Pasta</p>
              <p className="mb-1" style={{ marginLeft: '2.5rem' }}>1901 W Malvern Ave.</p>
              <p><span style={{ marginLeft: '2.5rem', display: 'inline-block' }}>Fullerton, CA 92833</span></p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <NavLink to="/rsvp" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition">
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
      
      <img src='img/balloons.png' alt="Balloons" className="footer"/>
    </main>
  );
}
