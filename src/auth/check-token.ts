import express from "express";
import jwt from "jsonwebtoken";

export function checkToken(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if(!token) {
    return res.send({msg: 'Acesso negado'})
  }

  try {

    const secret = process.env.SECRET;

    jwt.verify(token, secret!)

    next()

  } catch(err) {
    res.status(400).send({msg: 'Token inválido'})
  }
}