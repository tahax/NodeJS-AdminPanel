document.getElementById("imageUpload").onclick = function () {
  let xhttp = new XMLHttpRequest(); // create new AJAX request

  var selectedImage = document.getElementById("selectedImage");
  var imageStatus = document.getElementById("imageStatus");
  var progressDiv = document.getElementById("progressDiv");
  var progressBar = document.getElementById("progressBar");

  xhttp.onreadystatechange = function () {
    console.log(this.status);
    if (xhttp.status == 201) {
      document.getElementById("uploadsResult").innerHTML = this.responseText;
      imageStatus.innerHTML = "آپلود عکس موفقیت آمیز بود";
      selectedImage.value = "";
    } else {
      imageStatus.innerHTML = this.responseText;
    }
  };

  xhttp.open("POST", "/post-image-upload");

  xhttp.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      let result = Math.floor((e.loaded / e.total) * 100);
      if (result !== 100) {
        progressBar.innerHTML = result + "%";
        progressBar.style = "width:" + result + "%";
      } else {
        progressDiv.style = "display: none;";
      }
    }
  };

  let formData = new FormData();

  if (selectedImage.files.length > 0) {
    progressDiv.style = "display: block;";
    formData.append("image", selectedImage.files[0]);
    xhttp.send(formData);
  } else {
    imageStatus.innerHTML = "لطفا عکس انتخاب کن";
  }
};
