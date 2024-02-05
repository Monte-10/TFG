import React from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import Calendario from './components/Calendario';
import Entrenamientos from './components/Entrenamientos';
import Dieta from './components/Dieta';

function App() {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Calendario</Link>
            </li>
            <li>
              <Link to="/entrenamientos">Entrenamientos</Link>
            </li>
            <li>
              <Link to="/dieta">Dieta</Link>
            </li>
          </ul>
        </nav>

        <Switch>
          <Route path="/" exact component={Calendario} />
          <Route path="/entrenamientos" component={Entrenamientos} />
          <Route path="/dieta" component={Dieta} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
