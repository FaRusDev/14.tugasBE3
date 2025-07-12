export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      console.error('No file uploaded. req.file:', req.file, 'req.body:', req.body);
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Update user image
    const user = req.user;
    user.image = req.file.filename;
    await user.save();
    res.json({ message: 'Image uploaded successfully', filename: req.file.filename });
  } catch (err) {
    next(err);
  }
}; 