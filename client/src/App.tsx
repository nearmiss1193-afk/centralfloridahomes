import { Route, Switch } from 'wouter';
import Home from './pages/Home';
import Properties from './pages/Properties';
import PropertyDetail from './pages/PropertyDetail';
import AgentSignup from './pages/AgentSignup';
import Checkout from './pages/Checkout';
import NotFound from './pages/NotFound';

function App() {
  console.log('App rendering...')
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/properties" component={Properties} />
      <Route path="/properties/:id" component={PropertyDetail} />
      <Route path="/agent-signup" component={AgentSignup} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
