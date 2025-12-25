// HTTP istekleri için yapılandırılmış axios instance'ını içe aktar
import http from "./http-common";

// Mekan verileri için API servis sınıfı
// Backend API ile iletişim kurmak için kullanılır
class VenueDataService {
  // Yakındaki mekanları getir - Koordinatlara göre arama yapar
  // lat: Enlem (latitude)
  // long: Boylam (longitude)
  // Örnek: nearbyVenues(37.8322, 30.5247) -> /venues?lat=37.8322&long=30.5247
  nearbyVenues(lat, long) {
    return http.get(`/venues?lat=${lat}&long=${long}`);
  }
  // Kullanıcı giriş fonksiyonu
  login(data) {
    return http.post("/login", data);
  }
  // Kullanıcı kayıt fonksiyonu
  register(data) {
    return http.post("/signup", data);
  }
  
  // Belirli bir mekanı ID'ye göre getir
  // id: Mekan ID'si
  // Örnek: getVenue(123) -> /venues/123
  getVenue(id) {
    return http.get(`/venues/${id}`);
  }

  // Yeni mekan ekle - Kimlik doğrulama gerektirir
  // data: Eklenecek mekan bilgileri (name, address, coordinates vb.)
  // token: JWT token (kimlik doğrulama için)
  // Authorization header'ı ile token gönderilir
  // Örnek: addVenue({name: "Kafe", address: "İstanbul"}, "abc123token")
  addVenue(data, token) {
    return http.post("/venues", data, {
      headers: { Authorization: `Bearer ${token}` }, // Bearer token ile kimlik doğrulama
    });
  }
  
  // Mekan güncelleme fonksiyonu - Kimlik doğrulama gerektirir
  // id: Güncellenecek mekan ID'si
  // data: Güncellenmiş mekan bilgileri
  // token: JWT token (kimlik doğrulama için)
  // Örnek: updateVenue(123, {name: "Yeni Kafe"}, "abc123token")
  updateVenue(id, data, token) {
    return http.put(`/venues/${id}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  // Mekan silme fonksiyonu - Kimlik doğrulama gerektirir
  // id: Silinecek mekan ID'si
  // token: JWT token (kimlik doğrulama için)
  // Örnek: removeVenue(123, "abc123token")
  removeVenue(id, token) {
    return http.delete(`/venues/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
  // Yorum ekleme fonksiyonu (AddComment.jsx'te kullanılır)
  // Not: Bu fonksiyon şu an kodda yok ama AddComment.jsx'te kullanılıyor
  // addComment(id, comment) {
  //   return http.post(`/venues/${id}/comments`, comment);
  // }
  addComment(id, data, token) {
    return http.post(`/venues/${id}/comments`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}

// Sınıfın bir instance'ını oluştur ve dışa aktar
// Bu sayede diğer dosyalarda doğrudan kullanılabilir
// Örnek: VenueDataService.getVenue(123)
export default new VenueDataService();
