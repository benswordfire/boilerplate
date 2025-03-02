import 'dotenv/config';
import express, { Request, Response } from 'express';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import session from 'express-session';
import { RedisStore } from 'connect-redis';
import { pool } from './config/database/redis';
import authRouter from './modules/authentication/routes/auth.routes';
import googleAuthRouter from './modules/authentication/google/routes/google.auth.routes';
import { authorize, currentUser } from './modules/authentication/middlewares/auth.middleware';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'modules', 'views'));

app.use(expressLayouts);
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use('/htmx', express.static(path.join(__dirname, '..', 'node_modules', 'htmx.org', 'dist')));

app.use(
  session({
    store: new RedisStore({ client: pool }),
    secret: process.env.REDIS_SESSION_SECRET || 'hello',
    resave: false,
    saveUninitialized: false,
    name: 'kuki',
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, 
      sameSite: 'lax', 
    },
  })
);

app.use(authRouter);
app.use(googleAuthRouter);

app.get('/', (request: Request, response: Response) => {
  response.render('index', { title: 'Home', layout: 'layouts/public' });
});

app.get('/login', (request: Request, response: Response) => {
  if (request.headers['hx-request']) {
    response.render('login', { title: 'Login', layout: false, user: request.user });
  } else {
    response.render('login', { title: 'Login', layout: 'layouts/public', user: request.user });
  }
});

app.get('/register', (request: Request, response: Response) => {
  if (request.headers['hx-request']) {
    response.render('register', { title: 'Registration', layout: false, user: request.user });
  } else {
    response.render('register', { title: 'Registration', layout: 'layouts/public', user: request.user });
  }
});

app.get('/email-verification', (request: Request, response: Response) => {
  response.render('verification', { title: 'Email Verification', token: request.query.token, layout: 'layouts/public' });
});

app.get('/settings', authorize, currentUser, (request: Request, response: Response) => {
  if (request.headers['hx-request']) {
    response.render('settings', { title: 'Settings', layout: false, user: request.user });
  } else {
    response.render('settings', { title: 'Settings', layout: 'layouts/private', user: request.user });
  }
});

app.get('/orders', authorize, currentUser, (request: Request, response: Response) => {
  if (request.headers['hx-request']) {
    response.render('orders', { title: 'Orders', layout: false, user: request.user });
  } else {
    response.render('orders', { title: 'Orders', layout: 'layouts/private', user: request.user });
  }
});

app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT: ${PORT}`));
