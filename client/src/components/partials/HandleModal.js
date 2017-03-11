const HandleModal = idName => {
  let form = document.getElementById(idName);
  let className = form.getAttribute('class');
  form.className = className.includes(' is-active') ? 'modal' : 'modal is-active';
};

export default HandleModal;
