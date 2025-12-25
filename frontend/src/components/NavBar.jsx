import { useEffect, useState } from "react";
// React Router'dan NavLink bileşenini içe aktar (sayfa yönlendirme için)
import { NavLink, useNavigate, useLocation } from "react-router-dom";

// Navigasyon çubuğu (navbar) bileşeni - Sayfa üstünde sabit menü gösterir
function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);// Kullanıcı durumunu tutan state

  // Sayfa yüklendiğinde ve location değiştiğinde çalışır
  useEffect(() => {
    // LocalStorage'dan kullanıcı bilgilerini al
    const userStr = localStorage.getItem("user");

    if (userStr) {
      try {
        // userStr bazen JSON içinde { token: "..." } olarak saklanmış olabilir
        let token = userStr;
        try {
          const parsed = JSON.parse(userStr);
          // parsed bir obje ise parsed.token'e bak, string ise parsed'i token olarak kullan
          if (parsed && typeof parsed === "object" && parsed.token) token = parsed.token;
          else if (typeof parsed === "string") token = parsed;
        } catch (_) {
          // Not JSON, keep token as-is
        }

        // Token geçerli biçimde ise payload'ı al, yoksa hata fırlat ve catch'a düş
        const rawPayload = (token || "").split(".")[1];
        if (!rawPayload) throw new Error("Invalid token");
        const payload = JSON.parse(atob(rawPayload));

        // Eğer payload.exp * 1000 < Date.now() ise token süresi dolmuştur
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("user"); // Token süresi dolmuş, kullanıcıyı çıkış yapmış say
          setUser(null);
        } else {
          setUser(payload); // Geçerli kullanıcı bilgilerini state'e kaydet
        }
      } catch (error) {
        localStorage.removeItem("user"); // Token hatalıysa kullanıcıyı çıkış yapmış say
        setUser(null);
      }
    } else {
      setUser(null); // token yoksa kullanıcı yok demektir
    }
  }, [location]);
  const handleLogout = (e) => {
    e.preventDefault();
    localStorage.removeItem("user"); // LocalStorage'dan kullanıcı bilgilerini sil
    setUser(null);
    navigate("/"); // Ana sayfaya yönlendir
  };
  return (
    <div className="navbar-default navbar navbar-fixed-top">
      <div className="container">
        {/* Navbar başlık bölümü */}
        <div className="navbar-header">
          {/* Ana sayfa linki - Logo/başlık olarak gösterilir */}
          <NavLink className="navbar-brand" to="/">Mekanbul</NavLink>
          
          {/* Mobil cihazlar için hamburger menü butonu */}
          <button
            className="navbar-toggle"
            type="button"
            data-toggle="collapse"
            data-target="#navbar-main"
          >
            {/* Hamburger menü ikonu (3 çizgi) */}
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        
        {/* Menü öğeleri - Mobilde collapse (açılır/kapanır) olabilir */}
        <div id="navbar-main" className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right">
            {/* Hakkında sayfası linki */}
            <li>
              <NavLink to={"about"}>Hakkında</NavLink> 
            </li>
            {user ? (
              /* KULLANICI GİRİŞ YAPMIŞSA GÖRÜNECEKLER */
              <>
                {/* Sadece Admin ise Yönetici Paneli linkini göster */}
                {user.role === "admin" && (
                  <li>
                    <NavLink to="/admin" >Yönetici Paneli</NavLink>
                  </li>
                )}
                
                {/* Kullanıcı İsmi (Tıklanmaz) */}
                <li>
                  <a style={{ cursor: "default" }}>{user.name}</a>
                </li>
                
                {/* Çıkış Yap Butonu */}
                <li>
                  <a onClick={handleLogout} style={{ cursor: "pointer" }}>Çıkış Yap</a>
                </li>
              </>
            ) : (
              /* KULLANICI GİRİŞ YAPMAMIŞSA GÖRÜNECEKLER */
              <>
                <li>
                  <NavLink to="/login" state={{ loginType: "admin" }}>Yönetici</NavLink>
                </li>
                <li>
                  {/* İstersen burayı /register yapabilirsin ama login'den de kayıt olunuyor */}
                  <NavLink to="/login" state={{ loginType: "user" }}>Kullanıcı</NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Bileşeni dışa aktar
export default NavBar;
