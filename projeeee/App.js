import React, { useState, useEffect } from 'react';
import { Text, View, Image, TouchableOpacity, Animated, Modal, StyleSheet } from 'react-native';

const SECIMLER = [
  {
    isim: 'Taş',
    uri: require('./assets/taş.png')
  },
  {
    isim: 'Kağıt',
    uri: require('./assets/kagıt.png')
  },
  {
    isim: 'Makas',
    uri: require('./assets/makas.png')
  },
];

const rastgeleBilgisayarSecimi = () => SECIMLER[Math.floor(Math.random() * SECIMLER.length)];

const turSonucunuGetir = (kullaniciSecimi) => {
  const bilgisayarSecimi = rastgeleBilgisayarSecimi().isim;
  let sonuc;

  if (kullaniciSecimi === 'Taş') {
    sonuc = bilgisayarSecimi === 'Makas' ? 'Kazandınız!' : 'Kaybettiniz!';
  }
  if (kullaniciSecimi === 'Kağıt') {
    sonuc = bilgisayarSecimi === 'Taş' ? 'Kazandınız!' : 'Kaybettiniz!';
  }
  if (kullaniciSecimi === 'Makas') {
    sonuc = bilgisayarSecimi === 'Kağıt' ? 'Kazandınız!' : 'Kaybettiniz!';
  }

  if (kullaniciSecimi === bilgisayarSecimi) sonuc = 'Berabere!';
  return [sonuc, bilgisayarSecimi];
};

const SecimKarti = ({ oyuncu, secim: { uri, isim } }) => {
  const baslik = isim && isim.charAt(0).toUpperCase() + isim.slice(1);
  const imageSource = typeof uri === 'string' ? { uri } : uri;

  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000, 
      useNativeDriver: true, 
    }).start();
  }, []);

  return (
    <Animated.View style={[stiller.secimKarti, { opacity: fadeAnim }]}>
      <Text style={stiller.oyuncu}>{oyuncu}</Text>
      <Image source={imageSource} resizeMode="contain" style={stiller.secimResmi} />
      <Text style={stiller.secimBasligi}>{baslik}</Text>
    </Animated.View>
  );
};

export default function App() {
  const [oyunDurumu, setOyunDurumu] = useState('HAMLENİZİ SEÇİN');
  const [kullaniciSecimi, setKullaniciSecimi] = useState({});
  const [bilgisayarSecimi, setBilgisayarSecimi] = useState({});
  const [kurallarModalVisible, setKurallarModalVisible] = useState(false);
  const [nasılOynanırModalVisible, setNasılOynanırModalVisible] = useState(false);

  const onPress = (kullaniciSecimi) => {
    const [sonuc, bilgisayarSec] = turSonucunuGetir(kullaniciSecimi);

    const yeniKullaniciSecimi = SECIMLER.find(secim => secim.isim === kullaniciSecimi);
    const yeniBilgisayarSecimi = SECIMLER.find(secim => secim.isim === bilgisayarSec);

    setOyunDurumu(sonuc);
    setKullaniciSecimi(yeniKullaniciSecimi);
    setBilgisayarSecimi(yeniBilgisayarSecimi);
  };

  const sonucRenginiGetir = () => {
    if (oyunDurumu === 'Kazandınız!') return 'blue';
    if (oyunDurumu === 'Kaybettiniz!') return 'red';
    return null;
  };

  return (
    <View style={stiller.konteyner}>
      <Text style={{ fontSize: 35, color: sonucRenginiGetir() }}>{oyunDurumu}</Text>
      <View style={stiller.secimlerKonteyneri}>
        <SecimKarti oyuncu="kullanıcı" secim={kullaniciSecimi} />
        <Text style={{ color: 'red' }}>karşılaşma</Text>
        <SecimKarti oyuncu="Bilgisayar" secim={bilgisayarSecimi} />
      </View>
      {SECIMLER.map(secim => (
        <TouchableOpacity key={secim.isim} style={stiller.buton} onPress={() => onPress(secim.isim)}>
          <Text style={stiller.butonYazi}>{secim.isim}</Text>
        </TouchableOpacity>
      ))}

      <View style={stiller.butonKonteyner}>
        <TouchableOpacity style={stiller.buton} onPress={() => setKurallarModalVisible(true)}>
          <Text style={stiller.butonYazi}>Oyun Kuralları</Text>
        </TouchableOpacity>

        <TouchableOpacity style={stiller.buton} onPress={() => setNasılOynanırModalVisible(true)}>
          <Text style={stiller.butonYazi}>Nasıl Oynanır</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={kurallarModalVisible}
        onRequestClose={() => setKurallarModalVisible(!kurallarModalVisible)}
      >
        <View style={stiller.modalView}>
          <Text style={stiller.modalText}>Taş, kağıt, makas oyununun kuralları:</Text>
          <Text style={stiller.modalText}>- Taş makası yener.</Text>
          <Text style={stiller.modalText}>- Kağıt taşı yener.</Text>
          <Text style={stiller.modalText}>- Makas kağıdı yener.</Text>
          <Text style={stiller.modalText}>- Eğer iki oyuncu da aynı şeyi seçerse, oyun berabere biter.</Text>
          <TouchableOpacity
            style={[stiller.buton, stiller.butonKapat]}
            onPress={() => setKurallarModalVisible(!kurallarModalVisible)}
          >
            <Text style={stiller.butonYazi}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={nasılOynanırModalVisible}
        onRequestClose={() => setNasılOynanırModalVisible(!nasılOynanırModalVisible)}
      >
        <View style={stiller.modalView}>
          <Text style={stiller.modalText}>Nasıl Oynanır:</Text>
          <Text style={stiller.modalText}>- Oyun başladığında, 'Taş', 'Kağıt' veya 'Makas' seçeneklerinden birini seçin.</Text>
          <Text style={stiller.modalText}>- Bilgisayar da rastgele bir seçim yapacak.</Text>
          <Text style={stiller.modalText}>- Seçiminiz ve bilgisayarın seçimi karşılaştırılacak ve bir sonuç belirlenecek.</Text>
          <Text style={stiller.modalText}>- Kazanmak için: Taş makası yener, kağıt taşı yener, makas kağıdı yener.</Text>
          <TouchableOpacity
            style={[stiller.buton, stiller.butonKapat]}
            onPress={() => setNasılOynanırModalVisible(!nasılOynanırModalVisible)}
          >
            <Text style={stiller.butonYazi}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const stiller = StyleSheet.create({
  konteyner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  secimlerKonteyneri: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
  },
  buton: {
    width: 150,
    margin: 10,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#640D14',
  },
  butonYazi: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
  },
  secimKarti: {
    flex: 1,
    alignItems: 'center',
  },
  oyuncu: {
    fontSize: 20,
    color: '#250902',
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    borderBottomWidth: 2,
    borderBottomColor: 'blue',
  },
  secimResmi: {
    width: 100,
    height: 150,
    padding: 10,
  },
  secimBasligi: {
    fontSize: 0,
    color: '#250902',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  butonKapat: {
    backgroundColor: "#2196F3",
  },
  butonKonteyner: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  }
});
