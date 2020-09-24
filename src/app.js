require('dotenv').config()
import bodyParser from 'body-parser'
import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import sensors from './routes/sensors'
import {subscriber} from './event/subscriber'

let active_still_check = false;
global.active_still_check=active_still_check;

class App {

  constructor() 
  {
    this.app = express();
    this.setMiddleWare();
    this.getRouting();
    this.errorHandler();
    this.setEvent();
  }


  setMiddleWare()
  {    
    this.app.use(logger('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({extended: false}));
    this.app.use(cookieParser());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({extended : true}));
  }

  getRouting()
  {
    this.app.use('/', sensors)
  }

  errorHandler() 
  {
    
    this.app.use((req, res, next) => {

      next(createError(404))

    })

    // error handler
    this.app.use((err, req, res, next) => 
    {
      let apiError = err

      if (!err.status) 
      {
        apiError = createError(err)
      }

      // set locals, only providing error in development
      res.locals.message = apiError.message
      res.locals.error = process.env.NODE_ENV === 'development' ? apiError : {}

      // render the error page
      return res.status(apiError.status)
        .json({message: apiError.message})
    });
    
  }

  setEvent() {
    subscriber();
  }
}

module.exports = new App().app;