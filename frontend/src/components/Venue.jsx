// Gerekli bileşenleri ve kütüphaneleri içe aktar
import { NavLink } from "react-router-dom"; // Sayfa yönlendirme için link bileşeni
import Rating from "./Rating"; // Yıldız puanlama bileşeni
import FoodAndDrinkList from "./FoodAndDrinkList"; // Yiyecek/içecek listesi bileşeni
import CommentList from "./CommentList"; // Yorum listesi bileşeni
import React from "react";
import { formatDistance } from "../services/Utils"; // Mesafe formatlama fonksiyonu

// Tek bir mekan kartı bileşeni - Mekan bilgilerini gösterir
const Venue = ({ venue }) => {
  // coords: lat,lng biçimine dönüştür
  const coords = Array.isArray(venue.coordinates)
    ? venue.coordinates.join(",")
    : venue.coordinates || "";

  // Google Static Maps URL - kendi API anahtarınızı ekleyin (YOUR_API_KEY değiştirin)
  const mapSrc = coords
    ? `https://maps.googleapis.com/maps/api/staticmap?center=${coords}&zoom=14&size=600x300&markers=${coords}&scale=2&key=YOUR_API_KEY`
    : null;

  return (
    <div className="list-group">
      <div className="col-xs-12 col-sm-12">
        <div className="col-xs-12 list-group-item">
          {/* Mekan adı ve puanlama */}
          <h4>
            {/* Tıklanabilir mekan adı - Detay sayfasına yönlendirir */}
            <NavLink to={`/venue/${venue.id}`}>{venue.name} </NavLink>
            {/* Yıldız puanlama göster */}
            <Rating rating={venue.rating} />
          </h4>
          
          {/* Mesafe bilgisi (sağ üst köşede) */}
          <span className="span badge pull-right badge-default">
            {formatDistance(venue.distance)}
          </span>
          
          {/* Mekan adresi */}
          <p className="address"> {venue.address}</p>
          
          {/* Yiyecek ve içecek listesi */}
          <FoodAndDrinkList foodAndDrinkList={venue.foodanddrink} />

          {/* Yorumlar paneli (Yorum ekle butonu + yorum listesi) */}
          <div className="panel panel-primary" style={{ marginTop: "10px" }}>
            <div className="panel-heading">
              <NavLink
                className="btn btn-default pull-right"
                to={`/venue/${venue.id}/comment/new`}
                state={{ name: venue.name }}
              >
                Yorum Ekle
              </NavLink>
              <h2 className="panel-title">Yorumlar</h2>
            </div>
            <div className="panel-body" style={{ 
                    height: "70px", // Tek yorumun görüneceği yükseklik
                    overflowY: "scroll", 
                    scrollSnapType: "y mandatory", // Kilitlenme efekti
                    position: "relative"
                }}>
              {/* Yorum listesi bileşeni */}
              {venue.comments && venue.comments.length > 0 ? (
                venue.comments.slice().reverse().map((comment, index) => ( // En son yorumu başa al
                  <div key={index} style={{ borderBottom: "1px solid #eee", padding: "5px 0" }}>
                    <strong>{comment.author}</strong>&nbsp;
                    <span style={{fontSize:"12px", color:"#c93838ff"}}>
                       - <Rating rating={comment.rating} />
                    </span>
                    <p style={{ margin: "5px 0" }}>{comment.text}</p>
                  </div>
                ))
              ) : (
                <span style={{ fontStyle: "italic", color: "#999" }}>Henüz yorum yapılmamış.</span>
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
    
  );
};

// Bileşeni dışa aktar
export default Venue;

