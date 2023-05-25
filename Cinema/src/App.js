import { Suspense, useState, useEffect } from "react";
import { BrowserRouter, Switch, Route, Link} from "react-router-dom";

// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

import ModalTrailer from "./components/ModalTrailer";
import LazyLoad from "./components/LazyLoad";
import Loading from "./components/Loading";
// layout
import MainLayout from "./layouts/MainLayout";
import AdminLayout from "./layouts/AdminLayout";
// guards
import AdminRoute from "./guards/AdminRoute";
import CheckoutRoute from "./guards/CheckoutRoute";
import UserProfileRoute from "./guards/UserProfileRoute";
// page
import Homepage from "./pages/Homepage";
import MovieDetail from "./pages/MovieDetail";
import UserProfile from "./pages/UserProfile";
import BookTicket from "./pages/BookTicket";
import UsersManagement from "./pages/UsersManagement";
import MoviesManagement from "./pages/MoviesManagement";
import CreateShowtime from "./pages/CreateShowtime";
import Book from "./pages/Book";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Page404 from "./pages/Page404";
import moviesApi from "./api/moviesApi";

import Backdrop from '@material-ui/core/Backdrop';
import Box from '@material-ui/core/Box';
import Modal from '@material-ui/core/Modal';
import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  boxShadow: 24,
  width : 370,
  p:2,
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

const btnMuaVe = {
    fontSize: "16px",
    textAlign :'center',
    width : "130px",
    borderRadius: "4px",
    padding: "8px 11px",
    transition: "all .2s",
    margin: '20px 2px',
    backgroundColor: "rgb(238, 130, 59)",
    border: "none",
    color: "#fbeeff",
    fontWeight:'600',
    "&:hover": {
      backgroundColor: "#b42a14",
  }
    
}

const text = {
  color: 'rgb(238, 130, 59)',
  margin: '6px 0',
  fontWeight : 'bold',
  textTransform : 'uppercase',
  backgroundImage : 'linear-gradient(-225deg, #231557 0%, #44107a 29%,  #ff1361 67%, #fff800 100%)',
  backgroundSize : 'auto auto',
  backgroundClip : 'border-box',
  backgroundSize : '200% auto',
  backgroundClip : 'text',
  textFillColor : 'transparent',
  webkitBackgroundClip: 'text',
  webkitTextFillColor: 'transparent',
  animation: 'textclip 2s linear infinite',
  display: 'inline-block',
}


const textTitle = {
  fontFamily: 'Courier Monospace',
  color :'#fff',
  fontSize :'38px',
  fontWeight : 'bold',
  marginTop : '16px',
  textTransform : 'uppercase',
  backgroundImage : 'linear-gradient(225deg, #231557 0%, #44107a 29%,  #ff1361 67%, #fff800 100%)',
  backgroundSize : 'auto auto',
  backgroundClip : 'border-box',
  backgroundSize : '200% auto',
  backgroundClip : 'text',
  textFillColor : 'transparent',
  webkitBackgroundClip: 'text',
  webkitTextFillColor: 'transparent',
  webkitAnimation: 'textclip 2.5s linear infinite',
  display: 'inline-block',
}
let dynamicStyles = null;

function addAnimation(body) {
  if (!dynamicStyles) {
    dynamicStyles = document.createElement('style');
    dynamicStyles.type = 'text/css';
    document.head.appendChild(dynamicStyles);
  }

  dynamicStyles.sheet.insertRule(body, dynamicStyles.length);
}

addAnimation(`
      @keyframes textclip { 
        from {
          background-position: 200% center;
        }
      }
    `);
const overLay = {
  position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Replace with your desired background color
    zIndex: 99,
}

function App() {
  const [open, setOpen] = useState(true);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [banner, setBanner] = useState({});


  useEffect(() => {
    const fetchData = async () => {
      await getListBanner();
    };
  
    fetchData();
  }, []);

  const getListBanner = async() => {
    try {
      const result = await moviesApi.getDanhSachPhim();
    if (result) {
      setBanner(result.data[result.data.length -1])
    }
    } catch (error) {
      console.log(error);
    }
  }

  console.log(banner);

  return (
      <BrowserRouter>
      <Loading />

        <ModalTrailer />
        <Suspense fallback={<LazyLoad />}>
          <Switch>
            <Route exact path={["/", "/detail/:maPhim", "/taikhoan"]}>
            <MainLayout>
            {open && <div style={overLay} />}
            <Modal
                  aria-labelledby="transition-modal-title"
                  aria-describedby="transition-modal-description"
                  open={open}
                  onClose={handleClose}
                  closeAfterTransition
                  slots={{ backdrop: Backdrop }}
                  slotProps={{
                    backdrop: {
                      timeout: 500,
                    },
                  }}
                >
                  <Fade in={open}>
                    <Box sx={style}>
                    <Link onClick={handleClose} to={`/detail/${banner.maPhim}`}><img style={{ width: '100%', objectFit: 'cover' }} src={banner.hinhAnh ?? ''} alt="hinh anh thong tin phim" /></Link>
                    <Typography style={textTitle}>Phim mới !</Typography>
                    <Typography style={text}>{ banner.tenPhim ?? ''}</Typography>
                    <Link to={`/detail/${banner.maPhim}`} style={btnMuaVe} onClick={handleClose}>Đặt ngay</Link>
                    </Box>
                  </Fade>
                </Modal>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/detail/:maPhim" component={MovieDetail} />
                <UserProfileRoute
                  exact
                  path="/taikhoan"
                  component={UserProfile}
                />
              </MainLayout>
            </Route>
           
              <CheckoutRoute
                exact
                path="/datve/:maLichChieu"
                component={BookTicket}
              />
         
            <Route
              exact
              path={["/admin/users", "/admin/movies", "/admin/showtimes", "/admin/films/addnew", "/admin/book"]}
            >
              <AdminLayout>
                <AdminRoute
                  exact
                  path="/admin/users"
                  component={UsersManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/movies"
                  component={MoviesManagement}
                />
                <AdminRoute
                  exact
                  path="/admin/showtimes"
                  component={CreateShowtime}
              />
              <AdminRoute
                  exact
                  path="/admin/book"
                  component={Book}
                />
                <AdminRoute
                  exact
                  path="/admin/films/addnew"
                />
              </AdminLayout>
            </Route>
  
            <Route exact path={["/login", "/signUp"]}>
              <MainLayout>
                <Route exact path="/login" component={Login} />
                <Route exact path="/signUp" component={Register} />
              </MainLayout>
            </Route>
  
            <Route component={Page404} />
          </Switch>
        </Suspense>
      </BrowserRouter>
  );
}

export default App;
