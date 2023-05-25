var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var md5 = require('md5');
var mysql = require('mysql');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { application } = require('express');
const CryptoJS = require('crypto-js');
const axios = require('axios')

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Set up Global configuration access
dotenv.config();

// route mặc định
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
// chỉnh port
app.listen(process.env.PORT || 4000, function () {
    console.log('Node app is running on port 4000');
});
module.exports = app;
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodeJsApi'
});
dbConn.connect();

const validateToken = (req, res) => {
    const tokenHeaderKey = process.env.TOKEN_HEADER_KEY;
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    try {
        const token = req.headers.authorization.split(" ")[1];
        const verified = jwt.verify(token, jwtSecretKey);
        if(!verified)
            return res.status(401).send(error);
    } catch (error) {
        console.log(error);
        return res.status(401).send(error);
    }
}
// QuanLyRap
app.get('/api/QuanLyRap/LayThongTinHeThongRap', function (req, res) {
    dbConn.query('SELECT * FROM hethongrap', [], function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

app.get('/api/getBooking', function (req, res) {
    dbConn.query('SELECT datve.*, lichchieuinsert.* FROM datve INNER JOIN lichchieuinsert ON datve.maLichChieu = lichchieuinsert.maLichChieu', [], function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});
// lấy voucher
// app.get('/api/getVoucher', function (req, res) {
//     dbConn.query('SELECT voucher.*, nguoidungvm.* FROM voucher INNER JOIN nguoidungvm ON voucher.nguoidungId = nguoidungvm.id', [], function (error, results, fields) {
//         if (error) throw error;
//         return res.send(results);
//     });
// })
// lấy phim sắp chiếu
// app.get('/api/getPhimSapChieu', function (req, res) {
//     dbConn.query('SELECT * FROM phimsapchieu', [], function (err, results, fields) {
//         if (error) throw error;
//         return res.send(results);
//     })
// })

app.get('/api/QuanLyRap/LayThongTinCumRapTheoHeThong', async (req, res) => {
    const final = [];
    dbConn.query('SELECT * FROM cumrap JOIN hethongrapvacumrap ON cumrap.cid = hethongrapvacumrap.cumrap JOIN hethongrap ON hethongrap.hid = hethongrapvacumrap.hethongrap WHERE hethongrap.maHeThongRap = ?', [req.query.maHeThongRap], async (error, results, fields) => {
        if (error) throw error;
        for(const result of results){
            let danhSachRap = [];
            danhSachRap = await new Promise((resolve, reject) => {
                dbConn.query('SELECT * FROM danhsachrap WHERE maCumRap = ?', [result.cid], async (error, results1, fields) => {
                    if (error) throw error;
                    for (const result1 of results1){
                        danhSachRap.push({
                            "maRap": result1.maRap,
                            "tenRap": result1.tenRap
                        })
                    }
                    resolve(danhSachRap);
                });
            })
            final.push({
                "danhSachRap": danhSachRap,
                "maCumRap": result.maCumRap,
                "tenCumRap": result.tenCumRap,
                "diaChi": result.diaChi,
            })
        }
        return res.send(final);
    });
});

// QuanLyNguoiDung

app.post('/api/QuanLyNguoiDung/DangKy', async (req, res) => {
    const final = await new Promise((resolve, reject) => {
        dbConn.query("INSERT INTO nguoidungvm SET ? ", { 
            taiKhoan: req.body.taiKhoan,
            matKhau: md5(req.body.matKhau),
            email: req.body.email,
            soDt: req.body.soDt,
            maNhom: req.body.maNhom,
            maLoaiNguoiDung: req.body.maLoaiNguoiDung,
            hoTen: req.body.hoTen, 
        }, function (error, results, fields) {
            if (error) throw error;
            resolve(res.send("Success"));
        });
    })
    return final;
});

app.post('/api/QuanLyNguoiDung/DangNhap', function (req, res) {
    dbConn.query('SELECT * FROM nguoidungvm WHERE taiKhoan=? AND matKhau=?', [req.body.taiKhoan, md5(req.body.matKhau)], function (error, results, fields) {
        if (error) throw error;
        if (results.length > 0){
            info = JSON.parse(JSON.stringify(results[0]))
            info["accessToken"] = jwt.sign(info, process.env.JWT_SECRET_KEY)
            return res.send(info);
        }
        return res.status(401).send({ error: true });
    });
});

app.get('/api/QuanLyNguoiDung/LayDanhSachNguoiDung', function (req, res) {
    dbConn.query('SELECT * FROM nguoidungvm WHERE maNhom=?', [req.query.MaNhom], function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});


app.post('/api/QuanLyNguoiDung/ThongTinTaiKhoan', function (req, res) {
    validateToken(req, res);
    dbConn.query('SELECT * FROM nguoidungvm WHERE taiKhoan = ?', [req.body.taiKhoan], function (error, results, fields) {
        if (error) throw error;
        return res.send(results[0]);
    });
});

app.put('/api/QuanLyNguoiDung/CapNhatThongTinNguoiDung', function (req, res) {
    validateToken(req, res);
    dbConn.query('UPDATE nguoidungvm SET ? WHERE taiKhoan = ?', [{
        taiKhoan: req.body.taiKhoan,
        matKhau: md5(req.body.matKhau),
        email: req.body.email,
        soDt: req.body.soDt,
        maNhom: req.body.maNhom,
        maLoaiNguoiDung: req.body.maLoaiNguoiDung,
        hoTen: req.body.hoTen,  
    },req.body.taiKhoan], function (error, results, fields) {
        if (error) throw error;
        return res.send(results[0]);
    });
});

app.delete('/api/QuanLyNguoiDung/XoaNguoiDung', function (req, res) {
    dbConn.query('DELETE FROM nguoidungvm WHERE taiKhoan=?', [req.query.TaiKhoan], function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

// QuanLyRap

app.get('/api/QuanLyRap/LayThongTinHeThongRap', function (req, res) {
    dbConn.query('SELECT * FROM hethongrap', [], function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});

app.get('/api/QuanLyRap/LayThongTinLichChieuHeThongRap', function (req, res) {
    const final = [];
    dbConn.query('SELECT * FROM hethongrap', [], async (error, results, fields) => {
        if (error) throw error;
        for (const result of results){
            let lstCumRap = [];
            lstCumRap = await new Promise((resolve, reject) => {
                dbConn.query('SELECT * FROM hethongrap JOIN hethongrapvacumrap ON hethongrap.hid = hethongrapvacumrap.hethongrap JOIN cumrap ON cumrap.cid = hethongrapvacumrap.cumrap WHERE hethongrap.hid = ?', [result.hid], async (error, results0, fields) => {
                    if (error) throw error;
                    for (const result0 of results0){
                        let danhSachPhim = [];
                        danhSachPhim = await new Promise((resolve, reject) => {
                            dbConn.query('SELECT * FROM phiminsert JOIN hethongrapvaphim ON phiminsert.maPhim = hethongrapvaphim.maPhim JOIN hethongrap ON hethongrap.hid = hethongrapvaphim.maHeThongRap JOIN phiminsertvalichchieuinsert ON phiminsert.maPhim = phiminsertvalichchieuinsert.phiminsert JOIN cumrapvalichchieuinsert ON phiminsertvalichchieuinsert.lichchieuinsert = cumrapvalichchieuinsert.lichchieuinsert WHERE hethongrap.hid = ? AND cumrapvalichchieuinsert.cumrap = ?', [result0.hid, result0.cid], async (error, results1, fields) => {
                                if (error) throw error;
                                for (const result1 of results1){
                                    let lstLichChieuTheoPhim = []
                                    lstLichChieuTheoPhim = await new Promise((resolve, reject) => {
                                        dbConn.query('SELECT * FROM lichchieuinsert JOIN phiminsertvalichchieuinsert ON lichchieuinsert.maLichChieu = phiminsertvalichchieuinsert.lichchieuinsert JOIN phiminsert ON phiminsert.maPhim = phiminsertvalichchieuinsert.phiminsert WHERE phiminsertvalichchieuinsert.phiminsert = ?', [result1.maPhim], async (error, results2, fields) => {
                                            if (error) throw error;
                                            for (const result2 of results2){
                                                lstLichChieuTheoPhim.push({
                                                    "maLichChieu": result2.maLichChieu,
                                                    "maRap": result2.maRap,
                                                    "tenRap": result2.tenRap,
                                                    "ngayChieuGioChieu": result2.ngayChieuGioChieu,
                                                    "giaVe": result2.giaVe,
                                                })
                                            }
                                            resolve(lstLichChieuTheoPhim);
                                        });
                                    })
                                    const phim = {
                                        "lstLichChieuTheoPhim": lstLichChieuTheoPhim,
                                        "maPhim": result1.maPhim,
                                        "tenPhim": result1.tenPhim,
                                        "hinhAnh": result1.hinhAnh,
                                        "daoDien": result1.daoDien,
                                        "dienVien": result1.dienVien,
                                        "theLoai": result1.theLoai,
                                        "quocGia": result1.quocGia,
                                        "thoiLuong": result1.thoiLuong,
                                    }
                                    danhSachPhim.push(phim)
                                }
                                resolve(danhSachPhim);
                            });

                        })
                        const cumrap = {
                            "danhSachPhim": danhSachPhim,
                            "maCumRap": result0.maCumRap,
                            "tenCumRap": result0.tenCumRap,
                            "diaChi": result0.diaChi
                        }
                        lstCumRap.push(cumrap)
                    }
                    resolve(lstCumRap);
                });
            })
            final.push({
                "lstCumRap": lstCumRap,
                "maHeThongRap": result.maHeThongRap,
                "tenHeThongRap": result.tenHeThongRap,
                "logo": result.logo,
                "mahom": "GP09"
            })
        }
        return res.send(final)
    });
});

app.get('/api/QuanLyRap/LayThongTinLichChieuPhim', function (req, res) {
    dbConn.query('SELECT * FROM phiminsert JOIN hethongrapvaphim ON phiminsert.maPhim = hethongrapvaphim.maPhim JOIN hethongrap ON hethongrap.hid = hethongrapvaphim.maHeThongRap WHERE phiminsert.maPhim = ?', [req.query.MaPhim], async (error, results0, fields) => {
        if (error) throw error;
        let heThongRapChieu = [];
        for (const result0 of results0){
            heThongRapChieu = await new Promise((resolve, reject) => {
                dbConn.query('SELECT * FROM hethongrap JOIN hethongrapvacumrap ON hethongrap.hid = hethongrapvacumrap.hethongrap JOIN cumrap ON cumrap.cid = hethongrapvacumrap.cumrap JOIN cumrapvalichchieuinsert ON cumrap.cid = cumrapvalichchieuinsert.cumrap JOIN phiminsertvalichchieuinsert ON cumrapvalichchieuinsert.lichchieuinsert = phiminsertvalichchieuinsert.lichchieuinsert WHERE hethongrap.hid = ? AND phiminsertvalichchieuinsert.phiminsert = ?', [result0.hid, result0.maPhim], async (error, results1, fields) => {
                    if (error) throw error;
                    let cumRapChieu = []
                    for (const result1 of results1){
                        cumRapChieu = await new Promise((resolve, reject) => {
                            dbConn.query('SELECT * FROM lichchieuinsert JOIN cumrapvalichchieuinsert ON lichchieuinsert.maLichChieu = cumrapvalichchieuinsert.lichchieuinsert JOIN cumrap ON cumrap.cid = cumrapvalichchieuinsert.cumrap JOIN phiminsertvalichchieuinsert ON cumrapvalichchieuinsert.lichchieuinsert = phiminsertvalichchieuinsert.lichchieuinsert WHERE cumrap.cid = ? AND phiminsertvalichchieuinsert.phiminsert = ?', [result1.cumrap, result0.maPhim], async (error, results2, fields) => {
                                if (error) throw error;
                                let lichChieuPhim = [];
                                for (const result2 of results2){
                                    lichChieuPhim.push({
                                        "maLichChieu": result2.maLichChieu,
                                        "maRap": result2.maRap,
                                        "tenRap": result2.tenRap,
                                        "ngayChieuGioChieu": result2.ngayChieuGioChieu,
                                        "giaVe": result2.giaVe,
                                        "thoiLuong": result2.thoiLuong
                                    })
                                }
                                const cumrap = {
                                    "lichChieuPhim": lichChieuPhim,
                                    "maCumRap": result1.maCumRap,
                                    "tenCumRap": result1.tenCumRap,
                                    "hinhAnh": null
                                }
                                cumRapChieu.push(cumrap)
                                resolve(cumRapChieu);
                            });
                        })
                    }
                    const hethong = {
                        "cumRapChieu": cumRapChieu,
                        "maHeThongRap": results1[0].maHeThongRap,
                        "tenHeThongRap": results1[0].tenHeThongRap,
                        "logo": results1[0].logo
                    }
                    heThongRapChieu.push(hethong)
                    resolve(heThongRapChieu);
                });
            })
        }
        const final = {
            "heThongRapChieu": heThongRapChieu,
            "maPhim": results0[0].maPhim,
            "tenPhim": results0[0].tenPhim,
            "biDanh": results0[0].biDanh,
            "trailer": results0[0].trailer,
            "hinhAnh": results0[0].hinhAnh,
            "moTa": results0[0].moTa,
            "maNhom": "GP09",
            "ngayKhoiChieu": results0[0].ngayKhoiChieu,
            "danhGia": results0[0].danhGia,
            "daoDien": results0[0].daoDien,
            "dienVien": results0[0].dienVien,
            "theLoai": results0[0].theLoai,
            "quocGia": results0[0].quocGia,
            "thoiLuong": results0[0].thoiLuong,
        }
        return res.send(final)
    });
});

// QuanLyPhim

app.get('/api/QuanLyPhim/LayDanhSachPhim', function (req, res) {
    dbConn.query('SELECT * FROM phiminsert', [], function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
    });
});


app.get('/api/QuanLyPhim/LayThongTinPhim', function (req, res) {
    dbConn.query('SELECT * FROM phiminsert JOIN phiminsertvalichchieuinsert ON phiminsert.maPhim = phiminsertvalichchieuinsert.phiminsert JOIN lichchieuinsert ON lichchieuinsert.maLichChieu = phiminsertvalichchieuinsert.lichchieuinsert WHERE phiminsert.maPhim = ?', [req.query.MaPhim], async (error, results0, fields) => {
        if (error) throw error;
        let lichchieu = [];
        for (const result0 of results0){
            lichchieu = await new Promise((resolve, reject) => {
                dbConn.query('SELECT * FROM lichchieuinsert JOIN cumrapvalichchieuinsert ON lichchieuinsert.maLichChieu = cumrapvalichchieuinsert.lichchieuinsert JOIN cumrap ON cumrap.id = cumrapvalichchieuinsert.cumrap WHERE lichchieuinsert.maLichChieu = ?', [result0.maLichChieu], async (error, results1, fields) => {
                    if (error) throw error;
                    let thongtinrap = {}
                    for (const result1 of results1){
                        thongtinrap = await new Promise((resolve, reject) => {
                            dbConn.query('SELECT * FROM danhsachrap JOIN cumrap ON danhsachrap.maCumRap = cumrap.id JOIN hethongrapvacumrap ON cumrap.id = hethongrapvacumrap.cumrap JOIN hethongrap ON hethongrap.id = hethongrapvacumrap.hethongrap WHERE danhsachrap.maRap = ?', [result1.maRap], async (error, results2, fields) => {
                                if (error) throw error;
                                thongtinrap = {
                                    "maRap": parseInt(results2[0].maRap),
                                    "tenRap": results2[0].tenRap,
                                    "maCumRap": results2[0].maCumRap,
                                    "tenCumRap": results2[0].tenCumRap,
                                    "maHeThongRap": results2[0].maHeThongRap,
                                    "tenHeThongRap": results2[0].tenHeThongRap
                                }
                                resolve(thongtinrap)
                            });
                        })
                        const val = {
                            "thongTinRap": thongtinrap,
                            "maLichChieu": result1.maLichChieu,
                            "maRap": result1.maRap,
                            "maPhim": result0.maPhim,
                            "tenPhim": result0.tenPhim,
                            "ngayChieuGioChieu": result1.ngayChieuGioChieu,
                            "giaVe": result1.giaVe,
                            "thoiLuong": result1.thoiLuong
                        }
                        lichchieu.push(val)
                    }
                    resolve(lichchieu);
                });
            })
        }
        const final = {
            lichchieu: lichchieu,
            "maPhim": results0[0].maPhim,
            "tenPhim": results0[0].tenPhim,
            "biDanh": results0[0].biDanh,
            "trailer": results0[0].trailer,
            "hinhAnh": results0[0].hinhAnh,
            "moTa": results0[0].moTa,
            "maNhom": "GP09",
            "ngayKhoiChieu": results0[0].ngayKhoiChieu,
            "danhGia": results0[0].danhGia,
            "daoDien": results0[0].daoDien,
            "dienVien": results0[0].dienVien,
            "theLoai": results0[0].theLoai,
            "quocGia": results0[0].quocGia,
            "thoiLuong" : results0[0].thoiLuong
        }
        return res.send(final)
    });
});
// quản lí phim sắp chiếu 
// app.get('/api/QuanLyRap/LayThongTinHeThongRap', function (req, res) {
//     dbConn.query('SELECT * FROM hethongrap', [], function (error, results, fields) {
//         if (error) throw error;
//         return res.send(results);
//     });
// });
// QuanLyDatVe

app.get('/api/QuanLyDatVe/LayDanhSachPhongVe', function (req, res) {
    dbConn.query('SELECT * FROM lichchieuinsert JOIN phiminsertvalichchieuinsert ON lichchieuinsert.maLichChieu = phiminsertvalichchieuinsert.lichchieuinsert JOIN phiminsert ON phiminsert.maPhim = phiminsertvalichchieuinsert.phiminsert JOIN cumrapvalichchieuinsert ON lichchieuinsert.maLichChieu = cumrapvalichchieuinsert.lichchieuinsert JOIN cumrap ON cumrap.cid = cumrapvalichchieuinsert.cumrap WHERE maLichChieu = ?', [req.query.MaLichChieu], async (error, results, fields) => {
        if (error) throw error;
        let danhSachGhe = Array.apply(null, Array(160)).map(function () {})
        danhSachGhe = await new Promise((resolve, reject) => {
            dbConn.query('SELECT * FROM datve WHERE maLichChieu = ?', [req.query.MaLichChieu], async (error, results1, fields) => {
                if (error) throw error;
                for(const result1 of results1){
                    danhSachGhe[result1.tenGhe] = {
                        "maGhe": result1.maGhe,
                        "tenGhe": result1.tenGhe,
                        "maRap": result1.maRap,
                        "loaiGhe": result1.loaiGhe,
                        "stt": result1.tenGhe,
                        "giaVe": result1.giaVe,
                        "daDat": true,
                        "taiKhoanNguoiDat": result1.taiKhoanNguoiDat
                    }
                }
                resolve(danhSachGhe)
            });
        })
        for(let i = 0; i < 160; i++){
            if (danhSachGhe[i] === undefined){
                danhSachGhe[i] = {
                    "maGhe": i,
                    "tenGhe": i > 9 ? String(i) : "0" + String(i),
                    "maRap": results[0].maRap,
                    "loaiGhe": i > 44 && i < 90 ? "Vip" : "Thuong",
                    "stt": i > 9 ? String(i) : "0" + String(i),
                    "giaVe": i > 44 && i < 90 ? results[0].giaVe + 15000 : results[0].giaVe,
                    "daDat": false,
                    "taiKhoanNguoiDat": null
                }
            }
        }
        return res.send({
            "thongTinPhim": {
                "maLichChieu": results[0].maLichChieu,
                "tenCumRap": results[0].tenCumRap,
                "tenRap": results[0].tenRap,
                "diaChi": results[0].diaChi,
                "tenPhim": results[0].tenPhim,
                "hinhAnh": results[0].hinhAnh,
                "ngayChieu": results[0].ngayChieuGioChieu,
                "gioChieu": results[0].ngayChieuGioChieu
            },
            "danhSachGhe": danhSachGhe
        });
    });
});

function formatDate(date) {
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    const seconds = padZero(date.getSeconds());
    
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  }
  
  function padZero(value) {
    return String(value).padStart(2, '0');
}
  

function sortObject(o) {
    var sorted = {},
      key,
      a = [];
  
    for (key in o) {
      if (o.hasOwnProperty(key)) {
        a.push(key);
      }
    }
  
    a.sort();
  
    for (key = 0; key < a.length; key++) {
      sorted[a[key]] = o[a[key]];
    }
    return sorted;
  }

  

app.post('/api/QuanLyDatVe/DatVe', async (req, res) => {



    for (const ve of req.body.danhSachVe){
        await new Promise((resolve, reject) => {
            dbConn.query("INSERT INTO datve SET ? ", { 
                tenGhe: ve.maGhe,
                loaiGhe: ve.giaVe > 75000 ? "Vip" : "Thuong",
                giaVe: ve.giaVe,
                taiKhoanNguoiDat: req.body.taiKhoanNguoiDung,
                maLichChieu: req.body.maLichChieu, 
            }, function (error, results, fields) {
                if (error) throw error;
            });
            resolve();
        })
    }
    return res.send("Success");
});

app.post('/api/QuanLyDatVe/TaoLichChieu', async (req, res) => {
    dbConn.query("INSERT INTO lichchieuinsert SET ? ", { 
        ngayChieuGioChieu: req.body.ngayChieuGioChieu,
        maRap: req.body.maRap,
        tenRap: req.body.tenRap,
        giaVe: req.body.giaVe, 
        thoiLuong: 120
    }, function (error, results, fields) {
        if (error) throw error;
        dbConn.query("INSERT INTO phiminsertvalichchieuinsert SET ? ", { 
            phiminsert: req.body.maPhim,
            lichchieuinsert : results.insertId,
        }, function (error, results0, fields) {
            if (error) throw error;
        });
        dbConn.query("SELECT * FROM cumrap JOIN hethongrapvacumrap ON cumrap.cid = hethongrapvacumrap.cumrap WHERE tenCumRap = ?",[req.body.cumRap], function (error, results1, fields) {
            if (error) throw error;
            dbConn.query("INSERT INTO cumrapvalichchieuinsert SET ? ",{ 
                cumrap: results1[0].cid,
                lichchieuinsert : results.insertId,
            }, function (error, results2, fields) {
                if (error) throw error;
                console.log(results1[0].hethongrap);
                dbConn.query("SELECT * FROM hethongrapvaphim WHERE maHeThongRap = ? AND maPhim = ?",[results1[0].hethongrap, req.body.maPhim], function (error, results3, fields) {
                    if (error) throw error;
                    if (!(results3.length > 0)){
                        dbConn.query("INSERT INTO hethongrapvaphim SET ? ", { 
                            maHeThongRap: results1[0].hethongrap,
                            maPhim: req.body.maPhim,
                        }, function (error, results0, fields) {
                            if (error) throw error;
                        });
                    }
                });
            });
        });
        return res.send("Success");
    });
});

// QuanLyPhim


// app.post('/api/QuanLyPhim/ThemPhim', async (req, res) => {
//     const final = await new Promise((resolve, reject) => {
//         dbConn.query(`INSERT INTO phiminsert (tenPhim, biDanh, trailer, hinhAnh,moTa, maNhom, ngayKhoiChieu, danhGia) VALUES ("${req.body.tenPhim}","${req.body.biDanh}", "${req.body.trailer}", "${req.body.hinhAnh}", "${req.body.moTa}", "${req.body.maNhom}", "${req.body.ngayKhoiChieu}", "${req.body.danhGia}")`
//        , function (error, results, fields) {
//             if (error) throw error;
//             resolve(res.send("Success"));
//         });
//     })
//     return final;
// });

app.post('/api/QuanLyPhim/ThemPhim', async (req, res) => {
    try {
      await new Promise((resolve, reject) => {
        dbConn.query(
          "INSERT INTO phiminsert SET ? ",
          {
            tenPhim: req.body.tenPhim,
            biDanh: req.body.biDanh,
            trailer: req.body.trailer,
            hinhAnh: req.body.hinhAnh,
            moTa: req.body.moTa,
            maNhom: req.body.maNhom,
            ngayKhoiChieu: req.body.ngayKhoiChieu,
            danhGia: req.body.danhGia,
            daoDien: req.body.daoDien,
            dienVien: req.body.dienVien,
            quocGia: req.body.quocGia,
            theLoai: req.body.theLoai,
            thoiLuong : req.body.thoiLuong
          },
          function (error, results, fields) {
            if (error) {
              reject(error);
            } else {
              resolve(results);
            }
          }
        );
      });
      
      res.send("Thêm thành công !");
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  });
  

app.post('/api/QuanLyPhim/CapNhatPhim', async (req, res) => {
    const final = await new Promise((resolve, reject) => {
        dbConn.query("UPDATE phiminsert SET ? WHERE maPhim = ?", [{ 
            "tenPhim": req.body.tenPhim,
            "biDanh": req.body.biDanh,
            "trailer": req.body.trailer,
            "hinhAnh": req.body.hinhAnh,
            "moTa": req.body.moTa,
            "maNhom": req.body.maNhom,
            "ngayKhoiChieu": req.body.ngayKhoiChieu,
            "danhGia": req.body.danhGia,
            "daoDien": req.body.daoDien,
            "dienVien": req.body.dienVien,
            "quocGia": req.body.quocGia,
            "theLoai": req.body.theLoai,
            "thoiLuong" : req.body.thoiLuong
        }, req.body.maPhim], function (error, results, fields) {
            if (error) throw error;
            resolve(res.send("Cập nhật phim thành công !"));
        });
    })
    return final;
});

// app.post('/api/QuanLyPhim/XoaPhim', async (req, res) => {
//     console.log(req);
// });

app.delete('/api/QuanLyPhim/XoaPhim', function (req, res) {
    dbConn.query('DELETE FROM phiminsert WHERE MaPhim=?', [req.query.MaPhim], function (error, results, fields) {
        if (error) throw error;
        resolve(res.send("Xóa thành công !"));
        return res.send(results);
    });
});
// app.delete('/api/QuanLyDatVe/XoaLichChieu', function (req, res) {
//     dbConn.query('DELETE FROM lichchieuinsert WHERE maLichChieu=?', [req.query.maLichChieu], function (error, results, fields) {
//         if (error) throw error;
//         resolve(res.send("Xóa thành công !"));
//         return res.send(results);
//     });
// });