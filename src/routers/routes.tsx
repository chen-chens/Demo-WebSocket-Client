import DemoPage from '@/pages/demo'
import BroadcastPage from '@/pages/broadcast'
import App from '@/App';
import DemoAPage from '@/pages/demoA';

const routes = [
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/demo',
    element: <DemoPage />,
  },
  {
    path: '/demoA',
    element: <DemoAPage />,
  },
  {
    path: '/broadcast',
    element: <BroadcastPage />,
  },
];

export default routes;