import { TestStuff } from '@monorepo-demo/utilities';
import { Link, Route, Routes } from 'react-router';
import styled from 'styled-components';
import NxWelcome from './nx-welcome';

import {
  TemplateLiteralLogger,
  logger,
  makeFetchCall,
  setDefault,
  setDefaultCall2,
  useLog,
} from '@monorepo-demo/utilities';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  makeFetchCall({ baseURL: 'https://fakestoreapi.com/' }).get(
    'products',
    {},
    { onSuccess: (data) => console.log({ data }) }
  );
  const logDebugger = new TemplateLiteralLogger({
    enabled: true,
    minLevel: 'debug',
    prefix: '[TestLogger]',
  });
  const loggy = setDefaultCall2(logDebugger, (target, message, ...args) => {
    console.log('Intercepted call:', message, ...args);
    target.defaultBehaviour(message, ...args);
  });
  // loggy`Yolo ${2}`;
  const log2 = logger(`[Testing 123]`);
  log2.info`${loggy}`;
  log2.info`${1} ${{
    car: { fang: 'dastin', moo: ['lah', 'lah', 'lah'] },
  }}`;
  log2.info`${loggy}`;
  log2.info`${loggy.defaultBehaviour}`;
  const lolo = loggy.defaultBehaviour.bind(loggy);
  loggy.defaultBehaviour`Yolo ${2}`;
  TestStuff();
  const loggy2 = useLog({ prefix: '[TestLogger2]', enabled: true }, 'log');
  lolo`7777 ${11}`;
  loggy2`1234 ${5678}`;

  // const simpleProxy = new Proxy(
  //   {},
  //   {
  //     apply: function (target, thisArg, args) {
  //       console.log('Simple proxy apply triggered:', args);
  //       return 'Proxy called!';
  //     },
  //   }
  // );

  // simpleProxy`Test`;

  // log()`Testing 123 ${678} ${{ fire: 'fox', megan: ['dox', 'man'] }}`;
  // log`Testing 123 ${678} ${{ fire: 'fox', megan: ['dox', 'man'] }}`;
  // log`Testing 123 ${678} ${{ fire: 'fox', megan: ['dox', 'man'] }}`;
  return (
    <StyledApp>
      <NxWelcome title="@monorepo-demo/open-store" />

      {/* START: routes */}
      {/* These routes and navigation have been generated for you */}
      {/* Feel free to move and update them to fit your needs */}
      <br />
      <hr />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </StyledApp>
  );
}

export default App;
