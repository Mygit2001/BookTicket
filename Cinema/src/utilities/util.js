export const imageUpload = async (file) => {
    const formData = new FormData();

      formData.append("file", file);

    formData.append("upload_preset", "ncpanat5");
    formData.append("cloud_name", "khanhbatluc");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/khanhbatluc/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
  return data;
};