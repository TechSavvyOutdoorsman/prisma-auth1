import NextAuth from "next-auth"
import EmailProvider from 'next-auth/providers/email'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { PrismaClient } from '@prisma/client'
import path from 'path'
import nodemailer from 'nodemailer'
import Handlebars from 'handlebars'
import { readFileSync } from 'fs'

const prisma = new PrismaClient()


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: true
})

const emailDir = path.resolve(process.cwd(), 'emails')

const sendVerificationRequest = ({ identifier, url }) => {
  const emailFile = readFileSync(path.join(emailDir, 'confirm-email.html', {
    encoding: 'utf8'
  }))
  const emailTemplate = Handlebars.compile(emailFile)
  transporter.sendMail({
    from: `"Magic Link" ${process.env.SMTP_FROM}`,
    to: identifier,
    subject: 'Your sign-in link for the Magic Link',
    html: emailTemplate({
      base_url: process.env.NEXTAUTH_URL,
      signin_url: url,
      email: identifier
    }),
  })
}

const sendWelcomeEmail = async ({ user }) => {
  const { email } = user

  try {
    const emailFile = readFileSync(path.join(emailsDir, 'welcome.html'), {
      encoding: 'utf8',
    });
    const emailTemplate = Handlebars.compile(emailFile);
    await transporter.sendMail({
      from: `"⚡ Magic Link" ${process.env.SMTP_FROM}`,
      to: email,
      subject: 'Welcome to HELL 🎉',
      html: emailTemplate({
        base_url: process.env.NEXTAUTH_URL,
        support_email: 'support@metatechdigital.com',
      }),
    });
  } catch (error) {
    console.log(`❌ Unable to send welcome email to user (${email})`);
  }
}

export default NextAuth({
  pages: {
    signIn: '/auth/signin',
    signOut: '/'
  },
  providers: [
    EmailProvider({
      // server: {
      //   host: process.env.SMTP_HOST,
      //   port: process.env.SMTP_PORT,
      //   auth: {
      //     user: process.env.SMTP_USER,
      //     pass: process.env.SMTP_PASSWORD,
      //   },
      // },
      // from: process.env.SMTP_FROM,
      maxAge: 10 * 60, // Links are only valid for 10 minutes
      sendVerificationRequest
    }),
  ],
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
  events: { createUser: sendWelcomeEmail },
});