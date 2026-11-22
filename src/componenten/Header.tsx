import { Link } from "react-router";
import { NavLink } from "react-router";
import "./Header.css";

export const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <p className="@">@</p>CherylAitchedji
        </Link>

        {/* Desktop navigation */}
        <nav className="desktop-nav">
          <NavLink to="/tutorials">Tutorials</NavLink>
        </nav>
      </div>
    </header>
  );
};
