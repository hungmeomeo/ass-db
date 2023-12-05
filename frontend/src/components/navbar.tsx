import { Link } from "react-router-dom";
import "./nav.css";
import LogoutButton from "./logout";

const Nav = () => {
  return (
    <div className="flex items-center h-[50px] bg-[#F4F4F4] px-4 py-4 ">
      <nav>
        <ul>
          <li>
            <a href="/q1">Supply info</a>
          </li>
          <li>
            <a href="/q3">Category info</a>
          </li>
          <li>
            <a href="/q2">Adding Supplier</a>
          </li>
          <li>
            <a href="/q4">Orders</a>
          </li>
          <li>
            <a>
              <LogoutButton />
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Nav;
