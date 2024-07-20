import DemoPage from '@/pages/demo'
import BroadcastPage from '@/pages/broadcast'
import App from '@/App';

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
    path: '/broadcast',
    element: <BroadcastPage />,
  },
];

export default routes;