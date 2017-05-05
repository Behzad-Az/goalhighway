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
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'courseFeed':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'courseReview':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'profName':
      regEx = new RegExp(/[^a-zA-Z\ \_\-\'\,\.\`]/);
      break;
    case 'tutorRequest':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'revTitle':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'revDesc':
      regEx = new RegExp(/[^a-zA-Z0-9\ \#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'emailSubject':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\$\#\&\*\(\)\_\-\\/\\~\:\"\'\,\.\[\]\|]/);
      break;
    case 'emailContent':
      regEx = new RegExp(/[^a-zA-Z0-9\ \!\@\#\$\%\^\&\*\(\)\_\+\-\=\\/\\`\~\:\;\"\'\<\>\,\.\?\[\]\{\}\|]/);
      break;
    case 'instLongName':
      regEx = new RegExp(/[^a-zA-Z\ \-\'\.]/);
      break;
    case 'instShortName':
      regEx = new RegExp(/[^a-zA-Z\ \-\'\.]/);
      break;
    default:
      regEx = 'iL5mdXEbyY';
      break;
  }

  return str.length > maxChar ||
         str.search(regEx) != -1;
};

export default InvalidCharChecker;
