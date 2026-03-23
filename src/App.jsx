import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import routes from "./routes/route";

function App() {
  return (
    <Router>
      <Routes>
        {routes.map((item) => {
          const Layout = item.layout;

          return (
            <Route
              key={item.path}
              path={item.path}
              element={
                Layout ? <Layout>{item.element}</Layout> : item.element
              }
            />
          );
        })}
      </Routes>
    </Router>
  );
}

export default App;