import Navbar from "./components/Navbar";
import Home from "./Home";

function App() {
  return (
    
    <div className="min-h-screen bg-slate-950 text-white selection:bg-indigo-500/30">
      <Navbar />


      <main className="pt-24">
        <Home />
      </main>
    </div>
  );
}

export default App;
