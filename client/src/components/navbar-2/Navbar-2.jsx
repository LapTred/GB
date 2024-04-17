import "./navbar-2.scss";
import profile from "./profile-picture.png";
import { Link } from "react-router-dom";

const Navbar2 = () => {
    return (
        <nav className="nav">
            <ul className="lista1">

            </ul>
            <ul className="lista2">
                <li className="lista-elemento"><Link to={"/tutoriales"}>Tutoriales</Link></li>
                <li className="lista-elemento"><Link to={"/asignacionesJefa"}>Asignaciones</Link></li>
                <li className="lista-elemento"><a href="#">Inconformidades</a></li>
                <li className="lista-elemento"><a href="#"><img className="profile-picture" alt="Logo" src={profile} /></a></li>
            </ul>
        </nav>
    );
};

export default Navbar2;
