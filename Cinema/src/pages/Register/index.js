import React, { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useLocation, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Swal from "sweetalert2";
import "./style.css";

import { register, resetErrorLoginRegister } from "../../reducers/actions/Auth";
import logoTix from "./logo/logoTix.png";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const { responseRegister, loadingRegister, errorRegister } = useSelector(
    (state) => state.authReducer
  );
  let location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    console.log(responseRegister);
    if (responseRegister) {
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Bạn đã đăng ký thành công",
        showConfirmButton: false,
        timer: 2000,
      });
      history.push("/login", location.state);
    }
  }, [responseRegister]);
  useEffect(() => {
    return () => {
      dispatch(resetErrorLoginRegister());
    };
  }, []);

  const phoneRegExp =
    /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const signupUserSchema = yup.object().shape({
    taiKhoan: yup.string().required("*Tài khoản không được bỏ trống !"),
    matKhau: yup.string().required("*Mật khẩu không được bỏ trống !"),
    email: yup
      .string()
      .required("*Email không được bỏ trống !")
      .email("* Email không hợp lệ "),
    soDt: yup
      .string()
      .required("*Số điện thoại không được bỏ trống !")
      .matches(phoneRegExp, "Số điện thoại không hợp lệ!"),
    hoTen: yup.string().required("*Tên không được bỏ trống !"),
  });

  const handleSubmit = (user) => {
    console.log(`user`, user);
    if (!loadingRegister && !responseRegister) {
      dispatch(register(user));
    }
  };
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  const handleLogin = () => {
    history.push("/login", location.state);
  };
  return (
    <>
      <section className="ftco-section">
        <div className="container">
          {/* <div className="row justify-content-center">
            <div className="col-md-6 text-center mb-5">
              <h2 className="heading-section">Login</h2>
            </div>
          </div> */}
          <div className="row justify-content-center">
            <div className="col-md-12 col-lg-10">
              <div className="wrap d-md-flex">
                <div className="img" style={{ backgroundImage: "" }}>
                  <img src="https://p4.wallpaperbetter.com/wallpaper/852/644/1008/alien-movie-poster-sigourney-weaver-movie-poster-wallpaper-preview.jpg" />
                </div>
                <div className="login-wrap p-4 p-md-5">
                  <div>
                    <Formik
                      initialValues={{
                        taiKhoan: "",
                        matKhau: "",
                        email: "",
                        soDt: "",
                        maNhom: "GP09",
                        maLoaiNguoiDung: "KhachHang", // điền QuanTri backend cũng áp dụng KhachHang
                        hoTen: "",
                      }}
                      validationSchema={signupUserSchema} // validationSchdema:  thu vien yup nhập sai ko submit được
                      onSubmit={handleSubmit}
                    >
                      {(formikProps) => (
                        <Form className="col-sm-12">
                          <div className="form-group">
                            <label>Tài khoản&nbsp;</label>
                            <ErrorMessage
                              name="taiKhoan"
                              render={(msg) => (
                                <span className="text-danger">{msg}</span>
                              )}
                            />
                            <Field
                              name="taiKhoan"
                              type="text"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                          <div>
                                <label>Mật khẩu&nbsp;</label>
                                <ErrorMessage
                                  name="matKhau"
                                  render={(msg) => (
                                    <span className="text-danger">{msg}</span>
                                  )}
                                />
                            </div>
                            <div className="wrap-input d-flex items-center justify-center border border-solid rounded-md" >
                                <Field
                                  type={showPassword ? "text" : "password"}
                                  className="custom-input form-control w-full py-2 focus:none focus:outline-none border border-white"
                                  name="matKhau"
                                />
                                <span
                                  onClick={handleShowPassword}
                                  className="flex pr-2 pt-2 text-[20px] text-red-900 cursor-pointer"
                                >
                                  {showPassword ? (
                                    <AiOutlineEye />
                                  ) : (
                                    <AiOutlineEyeInvisible />
                                  )}
                                </span>
                            </div>
                          </div>
                          <div className="form-group">
                            <label>Họ và tên&nbsp;</label>
                            <ErrorMessage
                              name="hoTen"
                              render={(msg) => (
                                <span className="text-danger">{msg}</span>
                              )}
                            />
                            <Field
                              name="hoTen"
                              type="text"
                              className="form-control"
                            />
                          </div>

                          <div className="form-group">
                            <label>Email&nbsp;</label>
                            <ErrorMessage
                              name="email"
                              render={(msg) => (
                                <span className="text-danger">{msg}</span>
                              )}
                            />
                            <Field
                              name="email"
                              type="email"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <label>Số điện thoại&nbsp;</label>
                            <ErrorMessage
                              name="soDt"
                              render={(msg) => (
                                <span className="text-danger">{msg}</span>
                              )}
                            />
                            <Field
                              name="soDt"
                              type="text"
                              className="form-control"
                            />
                          </div>

                          <div className="text-center">
                            <button
                              style={{
                                backgroundColor: "rgb(238, 130, 59)",
                                borderColor: "rgb(238, 130, 59)",
                                cursor: "pointer",
                                width: "100%",
                              }}
                              className="btn btn-success mt-3 container"
                              type="submit"
                              // className="btn btn-success" -- chú ý chỗ này
                              disable={loadingRegister.toString()}
                            >
                              Đăng Ký
                            </button>
                            <div className="d-flex align-items-center justify-content-between mt-3">
                              <p>Bạn đã có tài khoản ?</p>
                              <p
                                className="text-info "
                                style={{ cursor: "pointer" }}
                                onClick={handleLogin}
                              >
                                Đăng nhập
                              </p>
                            </div>
                            {errorRegister && (
                              <div className="alert alert-danger">
                                <span>{errorRegister}</span>
                              </div>
                            )}
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
