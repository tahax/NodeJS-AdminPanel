function copyFunction(a) {
  navigator.clipboard.writeText(
    a.parentElement.getElementsByTagName("p")[0].innerHTML
  );
}
