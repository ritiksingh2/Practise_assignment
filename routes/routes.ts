import express from 'express';
import { getAllUsers, loginUser, registerUser, refreshTokenHandler, deleteUser,editUserProfile } from '../controllers/ucontroller';

const router = express.Router();

router.route("/").get(getAllUsers);
router.route("/login").post(loginUser);
router.route("/profile").get();
router.post("/register", registerUser);
router.post("/refresh",refreshTokenHandler);
router.post("/delete",deleteUser);
router.put("/editprofile",editUserProfile)

export default router;