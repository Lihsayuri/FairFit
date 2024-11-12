import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExploreMarkets from './pages/ExploreMarkets';
import MakeMealPlan from './pages/MakeMealPlan';
import SelectedCardsPage from './pages/selectedCards';
import Home from './pages/Home'; // Importando o componente Home
import './App.css'; // Importa o arquivo CSS para styling

function App() {
  return (
    <Router>
      <div className="App">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore-markets" element={<ExploreMarkets />} />
          <Route path="/make-meal-plan" element={<MakeMealPlan />} />
          <Route path="/next-page" element={<SelectedCardsPage />} />
        </Routes>

        <Routes>
          <Route path="/" element={
            <div className="button-container">
              <Link to="/explore-markets">
                <button className="nav-button">Explore Markets</button>
              </Link>
              <Link to="/make-meal-plan">
                <button className="nav-button">Make a Meal Plan</button>
              </Link>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
