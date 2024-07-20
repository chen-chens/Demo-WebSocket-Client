import DemoPage from '@/pages/demo'
import GlobalBroadcastPage from '@/pages/globalBroadcast'
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
    path: '/globalBroadcast',
    element: <GlobalBroadcastPage />,
  },
];

export default routes;