import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import VenueDataService from "../services/VenueDataService";

const Register = () => {
  const navigate = useNavigate();

  // Form verileri için state
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.name || !credentials.email || !credentials.password) {
      setError("Lütfen tüm alanları doldurunuz.");
      return;
    }

    try {
      // Backend'e kayıt isteği atıyoruz
      const response = await VenueDataService.register(credentials);
      
      // Backend başarılı kayıtta hemen token döndürüyor (Auth.js'de gördük)
      if (response.data.token) {
        // Token'ı kaydedip otomatik giriş yapmış sayalım
        localStorage.setItem("user", JSON.stringify(response.data.token));
        
        // Ana sayfaya yönlendir
        navigate("/");
        window.location.reload();
      }
    } catch (err) {
      setError("Kayıt başarısız. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <Header headerText="Kayıt Ol" motto="Mekanbul ailesine katılın" />
      
      <div className="row">
        <div className="col-xs-12 col-md-6 col-md-offset-3">
          <form className="form-horizontal" onSubmit={handleSubmit}>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {/* İsim Alanı */}
            <div className="form-group">
              <label className="col-sm-2 control-label">Ad Soyad:</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  placeholder="Adınız Soyadınız"
                  value={credentials.name}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email Alanı */}
            <div className="form-group">
              <label className="col-sm-2 control-label">E-posta:</label>
              <div className="col-sm-10">
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="ornek@email.com"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Şifre Alanı */}
            <div className="form-group">
              <label className="col-sm-2 control-label">Şifre:</label>
              <div className="col-sm-10">
                <input
                  type="password"
                  className="form-control"
                  name="password"
                  placeholder="Şifreniz"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary pull-right">
              Kayıt Ol
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;