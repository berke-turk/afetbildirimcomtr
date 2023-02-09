const express = require("express");
const morgan = require("morgan");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mysql = require('mysql2');
const rateLimit = require('express-rate-limit');
const app = express();

const pool = mysql.createPool({host:'213.238.183.151', user: 'httpdgsg_user', password:'N,G(R8YNF)^w', database: 'httpdgsg_user'});

const promisePool = pool.promise();

const limitenkaz = rateLimit({
      max: 3,
      windowMS: 10000*60*60*24, //10 seconds
      message: "Too many sign-in attempts. Try again later."
  })

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(morgan('tiny'))
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended: true
}));
var jwt = require('jsonwebtoken');  

let iller = {
    "1": "ADANA",
    "2": "ADIYAMAN",
    "3": "AFYONKARAHİSAR",
    "4": "AĞRI",
    "5": "AMASYA",
    "6": "ANKARA",
    "7": "ANTALYA",
    "8": "ARTVİN",
    "9": "AYDIN",
    "10": "BALIKESİR",
    "11": "BİLECİKK",
    "12": "BİNGÖL",
    "13": "BİTLİS",
    "14": "BOLU",
    "15": "BURDUR",
    "16": "BURSA",
    "17": "ÇANAKKALE",
    "18": "ÇANKIRI",
    "19": "ÇORUM",
    "20": "DENİZLİ",
    "21": "DİYARBAKIR",
    "22": "EDİRNE",
    "23": "ELAZIĞ",
    "24": "ERZİNCAN",
    "25": "ERZURUM",
    "26": "ESKİŞEHİR",
    "27": "GAZİANTEP",
    "28": "GİRESUN",
    "29": "GÜMÜŞHANE",
    "30": "HAKKARİ",
    "31": "HATAY",
    "32": "ISPARTA",
    "33": "MERSİN",
    "34": "İSTANBUL",
    "35": "İZMİR",
    "36": "KARS",
    "37": "KASTAMONU",
    "38": "KAYSERİ",
    "39": "KIRKLARELİ",
    "40": "KIRŞEHİR",
    "41": "KOCAELİ",
    "42": "KONYA",
    "43": "KÜTAHYA",
    "44": "MALATYA",
    "45": "MANİSA",
    "46": "KAHRAMANMARAŞ",
    "47": "MARDİN",
    "48": "MUĞLA",
    "49": "MUŞ",
    "50": "NEVŞEHİR",
    "51": "NİĞDE",
    "52": "ORDU",
    "53": "RİZE",
    "54": "SAKARYA",
    "55": "SAMSUN",
    "56": "SİİRT",
    "57": "SİNOP",
    "58": "SİVAS",
    "59": "TEKİRDAĞ",
    "60": "TOKAT",
    "61": "TRABZON",
    "62": "TUNCELİ",
    "63": "ŞANLIURFA",
    "64": "UŞAK",
    "65": "VAN",
    "66": "YOZGAT",
    "67": "ZONGULDAK",
    "68": "AKSARAY",
    "69": "BAYBURT",
    "70": "KARAMAN",
    "71": "KIRIKKALE",
    "72": "BATMAN",
    "73": "ŞIRNAK",
    "74": "BARTIN",
    "75": "ARDAHAN",
    "76": "IĞDIR",
    "77": "YALOVA",
    "78": "KARABüK",
    "79": "KİLİS",
    "80": "OSMANİYE",
    "81": "DÜZCE"
};

app.post('/login', async (req, res) => {
  let ad = req.body.ad;
  let sifre = req.body.sifre;

  // Kullanıcı adı ve şifreyi kontrol et
  const [rows, fields] = await promisePool.query('SELECT * FROM admin WHERE username = ? AND password = ?',
    [ad, sifre]
  );

  // Eğer kullanıcı adı ve şifre doğruysa, JWT token oluştur ve cookie'ye kaydet
  if (rows.length > 0) {
    let token = jwt.sign({
      ad
    }, 'secretKey');
    res.cookie('token', token, {
      maxAge: 60 * 60 * 24
    }); 
    res.redirect("/admin/enkaz");
  } else {
    res.status(401).send('Kullanıcı adı veya şifre yanlış');
  }
})

 


app.get('/', async (req, res) => {
  let [enkazlar,fields] = await promisePool.query("SELECT * FROM enkaz order by id desc");
  let [erzaklar,fields1] = await promisePool.query("SELECT * FROM erzak order by id desc");

  for (let i = 0; i < enkazlar.length; i++) {
    enkazlar[i]['created_at'] = new Date(enkazlar[i]['created_at']).toLocaleDateString("tr-TR", {
      hour:"numeric",
      minute:"numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }

  for (let i = 0; i < erzaklar.length; i++) {
    erzaklar[i]['created_at'] = new Date(erzaklar[i]['created_at']).toLocaleDateString("tr-TR", {
      hour:"numeric",
      minute:"numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }


  console.log(enkazlar)

  res.render('index', { iller, erzaklar,fields,enkazlar,fields1 });
});


app.get('/72I3kFehjTrNdy1kzB0ekjeQCQNSvNFbPkaZcFUCCs', async (req, res) => {

    res.render('./admin/login');
});


app.get('/yararli-bilgiler', async (req, res) => {
  res.render('ybilgiler');
});



app.get('/admin/erzak', async (req, res) => {
  if(!req.cookies.token){
    res.redirect('/');
  }

  let [erzaklar,fields1] = await promisePool.query("SELECT * FROM erzak order by id desc");
  for (let i = 0; i < erzaklar.length; i++) {
    erzaklar[i]['created_at'] = new Date(erzaklar[i]['created_at']).toLocaleDateString("tr-TR", {
      hour:"numeric",
      minute:"numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }
    res.render('./admin/erzak',{erzaklar,fields1});
});



app.get('/admin/enkaz', async (req, res) => {
  if(!req.cookies.token){
    res.redirect('/');
  }

  let [enkazlar,fields] = await promisePool.query("SELECT * FROM enkaz order by id desc");
  for (let i = 0; i < enkazlar.length; i++) {
    enkazlar[i]['created_at'] = new Date(enkazlar[i]['created_at']).toLocaleDateString("tr-TR", {
      hour:"numeric",
      minute:"numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  }
  res.render('./admin/enkaz', { enkazlar,fields });
});

app.post('/logout', function (req, res) {
  res.clearCookie('token');
  res.clearCookie('ad');
  res.send('Çıkış yapıldı');
})  

  app.post('/enkaz', limitenkaz, async (req, res) => {
    console.log(req.body)
    let adsoyad = req.body.ad;
    let tel = req.body.tel;
    let il = req.body.il;
    let adres = req.body.adres;
    let kaynak = req.body.kaynak;
    let detay = req.body.detay;

    if (!adsoyad || !tel || !il || !adres ) {
      return res.status(400).send('Zorunlu olan alanları doldurunuz.');
    }

    await promisePool.query("INSERT INTO enkaz SET full_name=?, phone_number=?, city=?, address=?, source=?, detail=?", [adsoyad, tel, il, adres, kaynak, detay]);

    res.redirect("/")
  })
  
  app.post('/erzak', async (req, res) => {

    let adsoyad = req.body.ad;
    let tel = req.body.tel; 
    let il = req.body.il;
    let adres = req.body.adres;
    let detay = req.body.detay;
    let gida = req.body.gida;
    let barinma = req.body.barinma;
    let battaniye = req.body.battaniye;
    let isitici = req.body.isitici;
    let su = req.body.su;
    let ulasim = req.body.ulasim;

    if (!adsoyad || !tel || !il || !adres ) {
      return res.status(400).send('Zorunlu olan alanları doldurunuz.');
    }
 
    if (gida=="on"){
      gida = "Gıda";
    }
    else{
      gida = "";
    }
    if (barinma=="on"){
      barinma = "Barınma";
    }
    else{
      barinma = "";
    }
    if (battaniye=="on"){
      battaniye = "Battaniye";
    }
    else{
      battaniye = "";
    }
    if (isitici=="on"){
      isitici = "Isıtıcı";
    }
    else{
      isitici = "";
    }
    if (su=="on"){
      su = "Su";
    }
    else{
      su = "";
    }
    if (ulasim=="on"){
      ulasim = "Ulaşım";
    }
    else{ 
      ulasim = "";
    }

    let ihtiyac = gida + ", " + barinma + ", " + battaniye + ", " + isitici + ", " + su + ", " + ulasim + "";

    await promisePool.query("INSERT INTO erzak SET full_name=?, phone_number=?, city=?, address=?, ihtiyac=?, detail=?", [adsoyad, tel, il, adres, ihtiyac, detay]);
    res.redirect("/")}

  )
   
  app.post('/enkaz/sil', async (req, res) => {
    const id = req.body.id;
    await promisePool.query(`DELETE FROM enkaz WHERE id = ${id}`);
      res.redirect("/admin/enkaz")
  });

  app.post('/erzak/sil', async (req, res) => {
    const id = req.body.id;
    await promisePool.query(`DELETE FROM erzak WHERE id = ${id}`);
      res.redirect("/admin/erzak")
  });




  //HATA SAYFASI

app.use((req, res) => {
    res.status(200).render('404')
  })
  
  
  app.listen(4000, () => {
    console.log("Porttayız")
  });