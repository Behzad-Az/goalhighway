const InvalidCharChecker = (str, maxChar, type) => {
  let regEx;

  switch(type) {
    case 'username':
      regEx = new RegExp(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/);
      break;
    case 'password':
      regEx = new RegExp(/[^a-zA-Z0-9\!\@\#\$\%\^\&\*\(\)\_\+]/);
      break;
    case 'coursePrefix':
      regEx = new RegExp(/[^a-zA-Z0-9]/);
      break;
    case 'courseSuffix':
      regEx = new RegExp(/[^a-zA-Z0-9]/);
      break;
    case 'courseDesc':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    default:
      regEx = 'iL5mdXEbyY';
      break;
  }

  return str.length > maxChar ||
         str.search(regEx) != -1;
};

export default InvalidCharChecker;
