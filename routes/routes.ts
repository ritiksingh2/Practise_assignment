import express from 'express';
import { getAllUsers, loginUser, registerUser, refreshTokenHandler, deleteUser,editUserProfile } from '../controllers/ucontroller';

const router = express.Router();

router.route("/all_users").get(getAllUsers);
router.route("/login").get(loginUser);
router.route("/profile").get();
router.post("/register", registerUser);
router.post("/refresh",refreshTokenHandler);
router.post("/delete",deleteUser);
router.put("/editprofile",editUserProfile)

export default router;