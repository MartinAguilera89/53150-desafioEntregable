import { Router } from "express";
import userModel from "../dao/models/user.model.js";

const userRouter = Router();

userRouter.get('/', async (req, res) => {
  try {
    const users = await userModel.find();
    res.send({ result: "success", payload: users });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Error al obtener los usuarios" });
  }
});

userRouter.post('/', async (req, res) => {
  let { nombre, apellido, email } = req.body
  if (!nombre || !apellido || !email) {
      res.send({ status: "error", error: "Faltan parametros" })
  }
  let result = await userModel.create({ nombre, apellido, email })
  res.send({ result: "success", payload: result })
})

userRouter.put('/:uid', async (req, res) => {
  let { uid } = req.params

  let userToReplace = req.body

  if (!userToReplace.nombre || !userToReplace.apellido || !userToReplace.email) {
      res.send({ status: "error", error: "Parametros no definidos" })
  }
  let result = await userModel.updateOne({ _id: uid }, userToReplace)

  res.send({ result: "success", payload: result })
})

userRouter.delete('/:uid', async (req, res) => {
  let { uid } = req.params
  let result = await userModel.deleteOne({ _id: uid })
  res.send({ result: "success", payload: result })
})

export default userRouter;
