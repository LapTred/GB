import SidebarAuditado from "../../components/sidebarAuditado/SidebarAuditado";
import Navbar from "../../components/navbar/Navbar";
import "./HomeAuditado.scss";
import Widget from "../../components/widget/Widget";
import Chart from "../../components/chart/Chart";
import Table from "../../components/table/Table";

const HomeAuditado = () => {
  return (
    <div className="home">
      <SidebarAuditado/>
      <div className="homeContainer">
        <Navbar />
        <div className="container">
          <div className="widgets">
            <Widget className="widget" type="user" />
            <Widget className="widget" type="order" />
            <Widget className="widget" type="earning" />
            <Widget className="widget" type="balance" />
          </div>
          <div className="charts">
            <Chart title="Last 6 Months (Revenue)" aspect={2 / 1} />
          </div>
          <div className="listContainer">
            <div className="listTitle">Latest Transactions</div>
            <Table />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeAuditado;