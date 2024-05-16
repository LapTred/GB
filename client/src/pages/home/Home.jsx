import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import React, { useState, useEffect } from 'react';
import "./home.scss";


const Home = () => {  
  const [citas, setCitas] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3001/citas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener las citas');
            }
            return response.json();
        })
        .then(data => {
            setCitas([]); // Limpiar el estado de citas antes de establecer las nuevas citas
            setCitas(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}, []);

console.log(citas)

  return (
    <div className="home">
      <Sidebar />
      <div className="homeContainer">
        <Navbar />
        <div className="containers">
          <div className="containerL">
            <div className="containerLfirst">
              <div className="containerLinside">
              </div>
            </div>
            <div className="containerLsecond">
              <div className="containerLinside">
              </div>
            </div>
          </div>
          <div className="containerR">
            <div className="containerRfirst">
              <div className="containerRinside">
              </div>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
};

export default Home;
