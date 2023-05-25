import {React, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import "./style.css";
import { colors } from "@material-ui/core";
import axiosClient from "../../../api/axiosClient";
import { styled } from '@material-ui/styles';
import { PropTypes } from "prop-types";
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';

import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from "@material-ui/core/styles";
import getVideoId from "../../../utilities/getVideoIdFromUrlyoutube";
const useStyles = makeStyles((theme) => ({
  paper: {
    overflowY: "visible",
    backgroundColor: "black",
  },
  iframe: {
    width: "550px",
    height: "400px",
    [theme.breakpoints.down("lg")]: {
      width: "550px",
      height: "336px",
    },
    [theme.breakpoints.down("xs")]: {
      width: "fit-content",
      height: "fit-content",
    },
  },
}));
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
  },
  '& .MuiDialogActions-root': {
    
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;
  const closeBtn = {
    color : 'white'
  }
  return (
    <DialogTitle sx={{ m: 0, p: 2}} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon style ={closeBtn}/>
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};
const headerTitle = {
  padding: '0px' ,
  display: 'flex', 
  backgroundColor: '#571b03',
  justifyContent: 'flex-end'
}
const title = {
  textAlign: 'center',
  fontSize: '30px',
  color: 'orange',
  fontWeight: 'bold',
  marginBottom: '8px'
}
const content = {
  backgroundColor: '#571b03'
}
const infoMain = {
  color : '#fff',
  marginBottom : '8px'
}
const trailerTit = {
  textAlign : 'center',
  color: 'orange',
  fontWeight: 'bold',
  marginBottom : '6px'
}
const UpcomingMovie = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <div>
      <div>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle style ={headerTitle} id="customized-dialog-title" onClose={handleClose}></BootstrapDialogTitle>
        <DialogContent style={content}>
          <Typography style={title}>
            Thông tin phim
          </Typography>
          <Typography style={infoMain}>
            ĐẠO DIỄN: Louis Leterrier
          </Typography>
          <Typography style={infoMain}>
            DIỄN VIÊN: Vin Diesel, Jason Statham, Michelle Rodriguez,...
          </Typography>
          <Typography style={infoMain}>
            THỜI LƯỢNG: 141 phút
          </Typography>
          <Typography style={infoMain}>
            QUỐC GIA: Mỹ
          </Typography>
          <Typography style={trailerTit}>
            TRAILER
          </Typography>
          <iframe
            className={classes.iframe}
            src={`https://www.youtube.com/embed/${getVideoId(
              'https://www.youtube.com/watch?v=nIXKtldz5Yk'
            )}?autoplay=1`}
            allowFullScreen
            allow="autoplay"
            title="trailer movie"
      ></iframe>
        </DialogContent>
      </BootstrapDialog>
    </div>
      <div >
        <div id="phimsapchieu" className="title-UpMovie">Phim sắp chiếu</div>
        <div className="wrap-UpMovie">
          <div className="mb-30">
            <h5 className="title-date">Tháng 7</h5>
            <div className="wrap-Movie-week">
              <div className=" movie-item">
                <div>
                  <img src="https://traffic-edge24.cdn.vncdn.io/cinema/img/575493613191880-7tbQEN9yEFkuxhsvF0eh7dckLTQ.jpg" />
                </div>
                <div className="info">
                  <p className="color-red">Fast & Furious 10</p>
                  <p>Hành động, hình sự</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
              <div className="movie-item">
                <img src="https://traffic-edge27.cdn.vncdn.io/cinema/img/91248112558434555-7g4J08JRBGsYr7N7OYPMYYMKIbG.jpg" />
                <div className="info">
                  <p className="color-red">Du hành vũ trụ nhện</p>
                  <p>Khoa học viễn tưởng, hoạt hình</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
              <div className="movie-item">
                <img src=" https://traffic-edge27.cdn.vncdn.io/cinema/img/91346315107942627-ixLH2iM9at8BbuLr5wQWnCfwhJO.jpg" />
                <div className="info">
                  <p className="color-red">Oppenheimer</p>
                  <p>Lịch sử, chiến tranh</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-30">
            <h5 className="title-date">Tháng 8</h5>
            <div className="wrap-Movie-week">
              <div className=" movie-item">
                <img src="https://traffic-edge12.cdn.vncdn.io/cinema/img/7393010245356177-65moukkKV78Zwe7DMk81FQaL6DG.jpg" />
                <div className="info">
                  <p className="color-red">Doraemon: Nobita và vùng đất</p>
                  <p className="color-red">lí tưởng trên bầu trời</p>
                  <p>Khoa học viễn tưởng, hoạt hình</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
              <div className="movie-item">
                <img src="https://traffic-edge11.cdn.vncdn.io/cinema/img/7393226357399227-wrEKXTKoUuJuLmg52wT9ZybGXEC.jpg" />
                <div className="info">
                  <p className="color-red">Nàng tiên cá</p>
                  <p>Khoa học viễn tưởng, phiêu lưu</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
              <div className="movie-item">
                <img src="https://traffic-edge16.cdn.vncdn.io/cinema/img/1701037389469618-qTXa7CJAj2RzAgxzuplEemPb87b.jpg" />
                <div className="info">
                  <p className="color-red">Tia chớp</p>
                  <p>Khoa học viễn tưởng, phiêu lưu</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
              <div className="movie-item">
                <img src="https://img.cdn.vncdn.io/cinema/img/91850961751815439-vBExOKDhhzHSxlYsjkI9d1QBIar.jpg" />
                <div className="info">
                  <p className="color-red">Nhiệm vụ bất khả thi: Nghiệp báo</p>
                  <p>Phiêu lưu, hành động</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="mb-30">
            <h5 className="title-date">Tháng 11</h5>
            <div className="wrap-Movie-week">
              <div className=" movie-item">
                <img src="https://traffic-edge37.cdn.vncdn.io/cinema/img/90225202119197600-imzUKQbSanWDJcCsY9QKmk9qmDp.jpg" />
                <div className="info">
                  <p className="color-red">Transformers: Quái thú trỗi dậy</p>
                  <p>Khoa học viễn tưởng, phiêu lưu</p>
                  <Button class="button" onClick={handleClickOpen}>
                    Chi tiết
                  </Button>
                </div>
              </div>
              <div className=" movie-item">
                <img src="https://img.cdn.vncdn.io/cinema/img/5935942526876397-dbtd7QlhUlTQA2Krtl3qYqXhvVW.jpg" />
                <div className="info">
                  <p className="color-red">Xứ sở các nguyên tố</p>
                  <p>Hài, hoạt hình</p>
                  <button class="button">
                    Chi tiết
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   
  );
};
export default UpcomingMovie;
