import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ExploreMarkets from './pages/ExploreMarkets';
import MakeMealPlan from './pages/MakeMealPlan';
import Home from './pages/Home'; // Importando o componente Home

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          {/* Header pode ficar vazio ou você pode adicionar um título */}
        </header>

        <Routes>
          {/* Rota para a página inicial */}
          <Route path="/" element={<Home />} />
          
          {/* Rota para explorar mercados e criar plano de refeições */}
          <Route path="/explore-markets" element={<ExploreMarkets />} />
          <Route path="/make-meal-plan" element={<MakeMealPlan />} />
        </Routes>

        {/* Renderiza botões somente na página inicial */}
        <Routes>
          <Route path="/" element={
            <div>
              <Link to="/explore-markets">
                <button>Explore Markets</button>
              </Link>
              <Link to="/make-meal-plan">
                <button>Make a Meal Plan</button>
              </Link>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
