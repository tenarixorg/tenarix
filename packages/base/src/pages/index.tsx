import React from "react";
import { HashRouter, Route, Routes, useNavigate } from "react-router-dom";
import { Extensions } from "./Extensions";
import { Favorites } from "./Favorites";
import { Settings } from "./Settings";
import { Library } from "./Library";
import { Details } from "./Details";
import { Home } from "./Home";
import { Read } from "./Read";

const NotFound = () => {
  const navigation = useNavigate();
  return (
    <div>
      <h1>404</h1>
      <button
        onClick={() => {
          navigation("/");
        }}
      >
        Home
      </button>
    </div>
  );
};

export const Pages: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Extensions />} />
        <Route path="/details/:route" element={<Details />} />
        <Route path="/read/:route/:id" element={<Read />} />
        <Route path="/library/:query" element={<Library />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/settings/*" element={<Settings />} />
        <Route path="/home" element={<Home />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
};
