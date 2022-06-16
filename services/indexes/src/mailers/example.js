const sendAnalyticsSuccessEmail = (ctx, email, data) => {
  // you can get all the additional data needed by using the provided one plus ctx
  return ctx.sendMail('analyticsSuccess', {
    to: email,
    subject: 'Pingtoc - Resultados Análisis' 
  }, 
  { data });
};


const sendAnalyticsFailEmail = (ctx, email, data) => {
  // you can get all the additional data needed by using the provided one plus ctx
  return ctx.sendMail('analyticsFail', {
    to: email,
    subject: 'Pingtoc - Error en análisis' 
  }, 
  { data });
};

module.exports = {
  sendAnalyticsSuccessEmail: sendAnalyticsSuccessEmail,
  sendAnalyticsFailEmail: sendAnalyticsFailEmail,
}
