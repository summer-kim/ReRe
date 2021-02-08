import { Route, Switch } from 'react-router-dom';

import Alert from './component/layout/Alert';

import Login from './component/auth/Login';
import Mypage from './component/auth/Mypage';
import About from './component/layout/About';
import Contents from './component/content/Contents';
import Tags from './component/tags/Tags';
import Makepost from './component/tags/Makepost';
import Editpost from './component/tags/Editpost';

import ContentItem from './component/content/ContentItem';

const App = () => {
  return (
    <section className='container'>
      <Alert />
      <Switch>
        <Route exact path='/login' component={Login} />
        <Route exact path='/mypage' component={Mypage} />
        <Route exact path='/contents/:type' component={Contents} />
        <Route exact path='/about' component={About} />
        <Route exact path='/tags' component={Tags} />
        <Route exact path='/makepost' component={Makepost} />
        <Route exact path='/editpost/:postid' component={Editpost} />
        <Route exact path='/post/:postid' component={ContentItem} />
      </Switch>
    </section>
  );
};

export default App;