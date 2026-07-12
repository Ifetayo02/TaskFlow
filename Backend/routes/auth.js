const {
  register, login, getMe, googleAuth,
  forgotPassword, resetPassword,
  updateProfile, changePassword, uploadAvatar,
} = require('../controllers/authController');
const { upload } = require('../config/cloudinary');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/google', googleAuth);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.patch('/update-profile', protect, updateProfile);
router.patch('/change-password', protect, changePassword);
router.post('/upload-avatar', protect, upload.single('avatar'), uploadAvatar);