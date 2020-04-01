import React from "react";
import { NavLink } from "react-router-dom";
import classes from "../../styles/styles.module.scss";

const Header: React.FC = () => {
  return (
    <nav>
      <div className={classes.item}>
        <NavLink activeClassName={classes.active} to="/films">
          Фильмы
        </NavLink>
        <NavLink activeClassName={classes.active} to="/bookmarks">
          Закладки
        </NavLink>
      </div>
    </nav>
  );
};

export default Header;
