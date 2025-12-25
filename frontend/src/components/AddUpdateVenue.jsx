import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VenueDataService from "../services/VenueDataService";
import Header from "./Header";

const AddUpdateVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tüm form alanlarını kapsayan state
  const [venue, setVenue] = useState({
    name: "",
    address: "",
    foodanddrink: "",
    lat: "",
    long: "",
    day1: "", open1: "", close1: "", isClosed1: false,
    day2: "", open2: "", close2: "", isClosed2: false
  });

  useEffect(() => {
    // GÜNCELLEME MODU: Verileri çekip forma doldur
    if (id) {
      VenueDataService.getVenue(id).then((response) => {
        const v = response.data;
        setVenue({
          name: v.name,
          address: v.address,
          foodanddrink: v.foodanddrink ? v.foodanddrink.join(",") : "",
          lat: v.coordinates ? v.coordinates[0] : "",
          long: v.coordinates ? v.coordinates[1] : "",
          // Backend'den gelen veri yapısına göre saatleri dolduruyoruz
          // "day" veya "days" karmaşasını önlemek için ikisini de kontrol ediyoruz
          day1: v.hours && v.hours[0] ? (v.hours[0].day || v.hours[0].days) : "",
          open1: v.hours && v.hours[0] ? v.hours[0].open : "",
          close1: v.hours && v.hours[0] ? v.hours[0].close : "",
          isClosed1: v.hours && v.hours[0] ? v.hours[0].isClosed : false,
          
          day2: v.hours && v.hours[1] ? (v.hours[1].day || v.hours[1].days) : "",
          open2: v.hours && v.hours[1] ? v.hours[1].open : "",
          close2: v.hours && v.hours[1] ? v.hours[1].close : "",
          isClosed2: v.hours && v.hours[1] ? v.hours[1].isClosed : false,
        });
      });
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setVenue({ ...venue, [name]: type === "checkbox" ? checked : value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const token = JSON.parse(localStorage.getItem("user"));
    
    // Veriyi Backend formatına hazırla
    const data = {
        ...venue,
        // String olan yiyecekleri diziye çevir
        foodanddrink: venue.foodanddrink.split(",").map(item => item.trim()),
        // Backend'deki isimlendirme karışıklığı için (days1 ve day1) önlem:
        days1: venue.day1, 
        days2: venue.day2,
    };

    if (id) {
      VenueDataService.updateVenue(id, data, token)
        .then(() => navigate("/admin"))
        .catch(e => alert("Güncelleme başarısız. Lütfen bilgileri kontrol edin."));
    } else {
      VenueDataService.addVenue(data, token)
        .then(() => navigate("/admin"))
        .catch(e => alert("Ekleme başarısız. Lütfen bilgileri kontrol edin."));
    }
  };

  return (
    <>
    <Header headerText={id ? "Mekanı Güncelle" : "Yeni Mekan Ekle"} />
    <div className="row">
      <div className="col-xs-12 col-md-6">
        <form className="form-horizontal" onSubmit={onSubmit}>
          
          {/* Temel Bilgiler */}
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Mekan Adı:</label>
            <div className="col-xs-12 col-sm-10">
                <input className="form-control" name="name" value={venue.name} onChange={handleChange} required />
            </div>
          </div>
          
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Adres:</label>
            <div className="col-xs-12 col-sm-10">
                <input className="form-control" name="address" value={venue.address} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">İmkanlar:</label>
            <div className="col-xs-12 col-sm-10">
                <input className="form-control" name="foodanddrink" value={venue.foodanddrink} onChange={handleChange} placeholder="Çay, Kahve, Kek (Virgülle ayırın)" />
            </div>
          </div>

          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Enlem (Lat):</label>
            <div className="col-xs-12 col-sm-10">
                <input className="form-control" name="lat" value={venue.lat} onChange={handleChange} placeholder="37.76" />
            </div>
          </div>

          <div className="form-group">
             <label className="col-xs-10 col-sm-2 control-label">Boylam (Long):</label>
             <div className="col-xs-12 col-sm-10">
                <input className="form-control" name="long" value={venue.long} onChange={handleChange} placeholder="30.55" />
             </div>
          </div>

          <hr />
          <h4>Çalışma Saatleri (1. Aralık)</h4>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Günler:</label>
            <div className="col-xs-12 col-sm-10">
                <input className="form-control" name="day1" value={venue.day1} onChange={handleChange} placeholder="Pazartesi - Cuma" />
            </div>
          </div>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Açılış:</label>
            <div className="col-xs-12 col-sm-4">
                <input className="form-control" name="open1" value={venue.open1} onChange={handleChange} placeholder="09:00" />
            </div>
            <label className="col-xs-10 col-sm-2 control-label">Kapanış:</label>
            <div className="col-xs-12 col-sm-4">
                <input className="form-control" name="close1" value={venue.close1} onChange={handleChange} placeholder="18:00" />
            </div>
          </div>

          <hr />
          <h4>Çalışma Saatleri (2. Aralık)</h4>
          <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Günler:</label>
            <div className="col-xs-12 col-sm-10">
                <input className="form-control" name="day2" value={venue.day2} onChange={handleChange} placeholder="Cumartesi - Pazar" />
            </div>
          </div>
           <div className="form-group">
            <label className="col-xs-10 col-sm-2 control-label">Açılış:</label>
            <div className="col-xs-12 col-sm-4">
                <input className="form-control" name="open2" value={venue.open2} onChange={handleChange} placeholder="10:00" />
            </div>
            <label className="col-xs-10 col-sm-2 control-label">Kapanış:</label>
            <div className="col-xs-12 col-sm-4">
                <input className="form-control" name="close2" value={venue.close2} onChange={handleChange} placeholder="22:00" />
            </div>
          </div>

          <button type="submit" className="btn btn-primary pull-right" style={{marginTop:"20px", marginBottom:"50px"}}>
             {id ? "Güncelle" : "Mekanı Kaydet"}
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default AddUpdateVenue;