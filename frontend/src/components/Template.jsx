// Gerekli bileşenleri içe aktar
// Outlet: React Router'ın nested route (iç içe rota) özelliği için kullanılır
// Alt sayfaların (child routes) render edildiği yerdir
// main.jsx'te Template içindeki Route'lar buraya render edilir
import React, {useEffect} from "react";
import { useNavigate, Outlet } from "react-router-dom";
import NavBar from "./NavBar"; // Üst navigasyon menüsü
import Footer from "./Footer"; // Alt bilgi (footer)

// Ana şablon bileşeni - Tüm sayfalar için ortak yapı
// Bu bileşen, tüm sayfalarda görünen ortak elemanları (NavBar, Footer) içerir
// Outlet ile alt sayfalar (Home, VenueDetail, About vb.) buraya render edilir
const Template = () => {
  const navigate = useNavigate();

useEffect(() => {
  let timeout;

  const resetTimer = () => {
    clearTimeout(timeout);
    // ÖNCE KONTROL ET: Kullanıcı giriş yapmış mı ve Rolü ne?
      const userString = localStorage.getItem("user");
      if (userString) {
        try {
            const token = JSON.parse(userString);
            const payload = JSON.parse(atob(token.split(".")[1]));
            
            // EĞER KULLANICI İSE: Fonksiyonu burada durdur, sayaç çalışmasın.
            if (payload.role !== "admin") {
                return; 
            }
        } catch (e) {
            // Token bozuksa zaten işlem yapma
            return;
        }
      } else {
          // Hiç giriş yapılmamışsa da sayaç çalışmasın
          return;
      }
    // 10 saniye sonra logout yap
    timeout = setTimeout(() => {
      if (localStorage.getItem("user")) {
        localStorage.removeItem("user");
        alert("10 saniye hareketsizlik nedeniyle oturumunuz kapatıldı.");
        navigate("/login");
        // State'in tamamen sıfırlanması ve navbarın güncellenmesi için reload gerekebilir
        window.location.reload();
      }
    }, 10000); // 10 saniye
  };

  // Fare hareketi veya tuş basımında sayacı sıfırla
  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("keydown", resetTimer);
  window.addEventListener("click", resetTimer);
  window.addEventListener("scroll", resetTimer);

  resetTimer(); // İlk açılışta başlat
return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <>
      {/* Üst navigasyon menüsü - Tüm sayfalarda görünür */}
      <NavBar />
      
      <div className="container">
        {/* Outlet: Alt sayfalar buraya render edilir (Home, VenueDetail, About vb.) */}
        {/* 
          Outlet nasıl çalışır:
          1. main.jsx'te Template bir parent route olarak tanımlanır
          2. Template içindeki Route'lar (Home, VenueDetail, About vb.) child route'lardır
          3. Kullanıcı "/" adresine gittiğinde: Home bileşeni Outlet'e render edilir
          4. Kullanıcı "/about" adresine gittiğinde: About bileşeni Outlet'e render edilir
          5. Her zaman NavBar ve Footer görünür kalır, sadece Outlet içindeki içerik değişir
          
          Örnek:
          - URL: "/" → Outlet içinde <Home /> gösterilir
          - URL: "/venue/123" → Outlet içinde <VenueDetail /> gösterilir
          - URL: "/about" → Outlet içinde <About /> gösterilir
        */}
        <Outlet />
        
        {/* Alt bilgi (footer) - Tüm sayfalarda görünür */}
        <Footer />
      </div>
    </>
  );
};

// Bileşeni dışa aktar
export default Template;
