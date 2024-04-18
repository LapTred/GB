import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import Widget from "../../components/widget/Widget";
import "./home.scss";

const Home = () => {
  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="containers">
          <div className="containerL">
            <div className="widgets">
              <Widget className="widget" type="citas" />
              <Widget className="widget" type="pacientes" />
            </div>
          </div>
          <div className="containerR">
            <div className="widgets">
              <Widget className="widget" type="agenda" />
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Home;
