const resetPasswordTemplate = (resetPasswordLink, username) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><meta name="viewport" content="initial-scale=1.0"><meta name="format-detection" content="telephone=no"><title>MOSAICO Responsive Email Designer</title><style type="text/css">.socialLinks {font-size: 6px;}
.socialLinks a {display: inline-block;}
.socialIcon {display: inline-block;vertical-align: top;padding-bottom: 0px;border-radius: 100%;}
table.vb-row, table.vb-content {border-collapse: separate;}
table.vb-row {border-spacing: 9px;}
table.vb-row.halfpad {border-spacing: 0;padding-left: 9px;padding-right: 9px;}
table.vb-row.fullwidth {border-spacing: 0;padding: 0;}
table.vb-container.fullwidth {padding-left: 0;padding-right: 0;}</style><style type="text/css">
    /* yahoo, hotmail */
    .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div{ line-height: 100%; }
    .yshortcuts a{ border-bottom: none !important; }
    .vb-outer{ min-width: 0 !important; }
    .RMsgBdy, .ExternalClass{
      width: 100%;
      background-color: #3f3f3f;
      background-color: white}

    /* outlook */
    table{ mso-table-rspace: 0pt; mso-table-lspace: 0pt; }
    #outlook a{ padding: 0; }
    img{ outline: none; text-decoration: none; border: none; -ms-interpolation-mode: bicubic; }
    a img{ border: none; }

    @media screen and (max-device-width: 600px), screen and (max-width: 600px) {
      table.vb-container, table.vb-row{
        width: 95% !important;
      }

      .mobile-hide{ display: none !important; }
      .mobile-textcenter{ text-align: center !important; }

      .mobile-full{
        float: none !important;
        width: 100% !important;
        max-width: none !important;
        padding-right: 0 !important;
        padding-left: 0 !important;
      }
      img.mobile-full{
        width: 100% !important;
        max-width: none !important;
        height: auto !important;
      }
    }
  </style><style type="text/css">#ko_singleArticleBlock_3 .links-color a, #ko_singleArticleBlock_3 .links-color a:link, #ko_singleArticleBlock_3 .links-color a:visited, #ko_singleArticleBlock_3 .links-color a:hover {color: #3f3f3f;color: #3f3f3f;text-decoration: underline;}
#ko_footerBlock_2 .links-color a, #ko_footerBlock_2 .links-color a:link, #ko_footerBlock_2 .links-color a:visited, #ko_footerBlock_2 .links-color a:hover {color: #ccc;color: #ccc;text-decoration: underline;}</style></head><body bgcolor="white" text="#919191" alink="#cccccc" vlink="#cccccc" style="margin: 0;padding: 0;background-color: white;color: #919191;">

  <center>

  <!-- preheaderBlock -->

  <!-- /preheaderBlock -->

  <table class="vb-outer" width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="white" style="background-color: white;" id="ko_singleArticleBlock_3"><tbody><tr><td class="vb-outer" align="center" valign="top" bgcolor="white" style="padding-left: 9px;padding-right: 9px;background-color: white;">

<!--[if (gte mso 9)|(lte ie 8)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
        <div class="oldwebkit" style="max-width: 570px;">
        <table width="570" border="0" cellpadding="0" cellspacing="18" class="vb-container fullpad" bgcolor="" style="border-collapse: separate;border-spacing: 18px;padding-left: 0;padding-right: 0;width: 100%;max-width: 570px;background-color: ;"><tbody><tr><td width="100%" valign="top" align="left" class="links-color">

                <img border="0" hspace="0" vspace="0" width="534" class="mobile-full" alt="" style="border: 0px;display: block;vertical-align: top;max-width: 534px;width: 100%;height: auto;" src="https://mosaico.io/srv/f-45jduuw/img?src=https%3A%2F%2Fmosaico.io%2Ffiles%2F45jduuw%2Fgoalhighway-logo_2.png&amp;method=resize&amp;params=534%2Cnull"></td>
          </tr><tr><td><table align="left" border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td style="font-size: 18px; font-family: Arial, Helvetica, sans-serif; color: #004E89; text-align: left;">
                <span style="color: #004E89;">Important account information:</span>
              </td>
            </tr><tr><td height="9" style="font-size: 1px; line-height: 1px;"> </td>
            </tr><tr><td align="left" class="long-text links-color" style="text-align: left; font-size: 13px; font-family: Arial, Helvetica, sans-serif; color: #3f3f3f;"><p style="margin: 1em 0px;margin-bottom: 0px;margin-top: 0px;">Your username is ${username}. Click on the link below to reset your password.<br></p></td>
            </tr><tr><td height="13" style="font-size: 1px; line-height: 1px;"> </td>
            </tr><tr><td valign="top">
                <table cellpadding="0" border="0" align="left" cellspacing="0" class="mobile-full"><tbody><tr><td width="auto" valign="middle" bgcolor="#004E89" align="center" height="26" style="font-size: 13px; font-family: Arial, Helvetica, sans-serif; text-align: center; color: WHITE; font-weight: normal; padding-left: 18px; padding-right: 18px; background-color: #004E89; border-radius: 4px;">
                      <a style="text-decoration: none; color: WHITE; font-weight: normal;" target="_new" href=${resetPasswordLink}>RESET PASSWORD</a>
                    </td>
                  </tr></tbody></table></td>
            </tr></tbody></table></td></tr></tbody></table></div>
<!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
      </td>
    </tr></tbody></table><!-- footerBlock --><table width="100%" cellpadding="0" border="0" cellspacing="0" bgcolor="white" style="background-color: white;" id="ko_footerBlock_2"><tbody><tr><td align="center" valign="top" bgcolor="white" style="background-color: white;">

<!--[if (gte mso 9)|(lte ie 8)]><table align="center" border="0" cellspacing="0" cellpadding="0" width="570"><tr><td align="center" valign="top"><![endif]-->
        <div class="oldwebkit" style="max-width: 570px;">
        <table width="570" style="border-collapse: separate;border-spacing: 9px;padding-left: 9px;padding-right: 9px;width: 100%;max-width: 570px;" border="0" cellpadding="0" cellspacing="9" class="vb-container halfpad" align="center"><tbody><tr><td class="long-text links-color" style="text-align: center; font-size: 13px; color: #919191; font-weight: normal; text-align: center; font-family: Arial, Helvetica, sans-serif;"><p style="margin: 1em 0px;margin-bottom: 0px;margin-top: 0px;"><br></p></td>
          </tr><tr><td style="text-align: center;">
              <a href="%5Bunsubscribe_link%5D" style="text-decoration: underline; color: #ffffff; text-align: center; font-size: 13px; font-weight: normal; font-family: Arial, Helvetica, sans-serif;" target="_new"><span><br data-mce-bogus="1"></span></a>
            </td>
          </tr>
          </tbody></table></div>
<!--[if (gte mso 9)|(lte ie 8)]></td></tr></table><![endif]-->
      </td>
    </tr></tbody></table><!-- /footerBlock --></center>

</body></html>`
};

module.exports = resetPasswordTemplate;
