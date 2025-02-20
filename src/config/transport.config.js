import nodemailer from 'nodemailer';
//Mail
app.get("/mail", async (req, res) => {
    const {email} = req.body
    const result = await transport.sendMail({
      from: `Correo de prueva ${process.env.MAIL.USERNAME}`,
      to: email,
      subject: "Recupero de password",
      html:  `<div>
          <h1>Recipera tu password</h1>
          <p>Correo sin adjunto</p>
          ${email}
          <div>
      `, attachments: [
        {
          filename:'404.webp',
          path: paths.public + '/images/404.webp',
          cid:'error404'
        }
      ]
    });
    res.send('Correo enviado')
  })