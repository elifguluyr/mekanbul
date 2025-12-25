import React, { useState, useEffect } from "react";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";
import { useNavigate } from "react-router-dom";
import Rating from "./Rating";
import FoodAndDrinkList from "./FoodAndDrinkList";

const Admin = () => {
  const [venues, setVenues] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserAndLoadData = async () => {
      const userStr = localStorage.getItem("user");
      let isAdmin = false;

      if (userStr) {
        try {
          const token = JSON.parse(userStr);
          const payload = JSON.parse(atob(token.split(".")[1]));
          if (payload.role === "admin") isAdmin = true;
        } catch (e) { console.error("Token hatası"); }
      }

      if (!isAdmin) {
        navigate("/login");
        return; 
      }

      try {
        const result = await VenueDataService.nearbyVenues(37.7648, 30.5566);
        if (result.data) setVenues(result.data);
      } catch (error) { console.error("Mekanlar yüklenemedi", error); }
    };

    checkUserAndLoadData();
  }, [navigate]);

  const handleDelete = async (id, name) => {
    if (window.confirm(`${name} mekanını silmek istediğinize emin misiniz?`)) {
      try {
        const token = JSON.parse(localStorage.getItem("user"));
        await VenueDataService.removeVenue(id, token);
        setVenues(venues.filter((venue) => venue.id !== id));
      } catch (error) {
        alert("Silme işlemi başarısız!");
      }
    }
  };

  return (
    <div>
      <Header headerText="Yönetici" motto="Mekanlarınızı Yönetin!" />
      
      <div className="row">
        <div className="col-xs-12">
          
          {venues.map((venue) => (
            /* DÜZELTME BURADA: overflow: hidden ekledik ve içeriği row içine aldık */
            <div key={venue.id} className="list-group-item" style={{marginBottom: "15px", border: "1px solid #ddd", borderRadius: "5px", padding: "20px", overflow: "hidden"}}>
              <div className="row">
                  {/* Sol Taraf: Bilgiler */}
                  <div className="col-xs-12 col-sm-6">
                    <h4 style={{color: "#d9534f", marginTop: "0"}}>
                      {venue.name} <Rating rating={venue.rating} />
                    </h4>
                    <p style={{fontSize: "14px", color: "#333"}}>{venue.address}</p>
                    <FoodAndDrinkList foodAndDrinkList={venue.foodanddrink} />
                  </div>
                  
                  {/* Sağ Taraf: Butonlar */}
                  <div className="col-xs-12 col-sm-6 text-right">
                    <div style={{marginTop: "10px"}}>
                        <button
                          className="btn btn-primary"
                          onClick={() => navigate(`/admin/update/${venue.id}`)}
                          style={{ marginRight: "10px" }}
                        >
                          Güncelle
                        </button>
                        <button
                          className="btn btn-danger"
                          onClick={() => handleDelete(venue.id, venue.name)}
                        >
                          Sil
                        </button>
                    </div>
                  </div>
              </div>
            </div>
          ))}

          {/* MEKAN EKLE BUTONU */}
          <div className="col-xs-12">
            <button 
                className="btn btn-success pull-right"
                style={{ marginTop: "20px", marginBottom: "50px" }}
                onClick={() => navigate("/admin/add")}
            >
                Mekan Ekle
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;