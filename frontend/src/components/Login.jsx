import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Navbar'dan gelen bilgiyi al (admin mi user mı?)
  // Eğer doğrudan link yazıp girdiyse varsayılan 'user' olsun
  const loginType = location.state?.loginType || "user";

  const [creds, setCreds] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCreds({ ...creds, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!creds.email || !creds.password) {
      setError("Lütfen tüm alanları doldurunuz.");
      return;
    }

    try {
      const response = await VenueDataService.login(creds);
      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data.token));
        
        // Token'ı çözüp rol kontrolü yapalım
        const payload = JSON.parse(atob(response.data.token.split(".")[1]));

        // Güvenlik Önlemi:
        // Eğer "Yönetici Girişi"nden girdiyse ama hesabı "admin" değilse hata verelim!
        if (loginType === "admin" && payload.role !== "admin") {
            localStorage.removeItem("user");
            setError("Bu panel sadece Yöneticiler içindir!");
            return;
        }

        // Yönlendirme
        if (payload.role === "admin") {
            navigate("/admin");
        } else {
            navigate("/");
        }
        window.location.reload();
      }
    } catch (err) {
      setError("Giriş başarısız. Bilgilerinizi kontrol edin.");
    }
  };

  // Dinamik Tasarım Ayarları
  const isManager = loginType === "admin";
  const themeColor = isManager ? "#d9534f" : "#d9534f";
  const title = isManager ? "YÖNETİCİ GİRİŞİ" : "KULLANICI GİRİŞİ";

  return (
    <>
      {/* Özel Başlık - Header bileşeni yerine manuel yapıyoruz ki rengi değiştirebilelim */}
      <div className="page-header"style={{ marginTop: "100px" }}>
        <h1 style={{ color: themeColor, fontWeight: "bold" }}>
            {title} <small>{isManager ? "Yetkili Paneli" : "Hoşgeldiniz"}</small>
        </h1>
      </div>

      <div className="row">
        <div className="col-xs-12 col-md-6">
          <form className="form-horizontal" onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}

            <div className="form-group">
              <label className="col-sm-2 control-label">E-posta:</label>
              <div className="col-sm-10">
                <input 
                    type="email" 
                    name="email" 
                    className="form-control" 
                    value={creds.email} 
                    onChange={handleChange}
                    style={{ borderLeft: `5px solid ${themeColor}` }} // Input kenarını boya
                />
              </div>
            </div>

            <div className="form-group">
              <label className="col-sm-2 control-label">Şifre:</label>
              <div className="col-sm-10">
                <input 
                    type="password" 
                    name="password" 
                    className="form-control" 
                    value={creds.password} 
                    onChange={handleChange}
                    style={{ borderLeft: `5px solid ${themeColor}` }}
                />
              </div>
            </div>

            <div className="form-group">
                <div className="col-sm-offset-2 col-sm-10">
                    <button 
                        className="btn btn-primary pull-right"
                        style={{ backgroundColor: themeColor, borderColor: themeColor }}
                    >
                        Giriş Yap
                    </button>
                    {/* Sadece kullanıcı girişindeyken kayıt ol linki görünsün */}
                    {!isManager && (
                        <Link to="/register" className="btn btn-link pull-left">Kayıt Ol</Link>
                    )}
                </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;