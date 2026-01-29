import { NavLink } from "react-router";

export default function NotFound() {
    return (
        <div style={{ textAlign: 'center', padding: '50px 20px', backgroundColor: '#fef9f7', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '20px' }}>
            <img className="mx-auto" src="/img/404_not_found.png" alt="404 Not Found" style={{ maxWidth: '800px', width: '100%' }} />
            <div>
                <NavLink className="py-3 px-5 bg-cyan-500 text-white py-2 rounded-lg hover:bg-cyan-600 transition font-semibold text-playful text-lg" to="/">Go Home</NavLink>
            </div>
        </div>
    );
}