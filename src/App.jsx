import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/route";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((item) => {
          const Layout = item.layout;

          let element = Layout ? <Layout>{item.element}</Layout> : item.element;

          if (item.isPrivate) {
            element = (
              <ProtectedRoute allowedRoles={item.allowedRoles || []}>
                {element}
              </ProtectedRoute>
            );
          } else {
            element = <PublicRoute>{element}</PublicRoute>;
          }

          return <Route key={item.path} path={item.path} element={element} />;
        })}
      </Routes>
    </Router>
  );
}

export default App;
