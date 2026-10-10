const Profile = require('../models/Profile');

const getProfileData = async (req, res, next) => {
  try {
    const profile = await Profile.findOne() || await Profile.create({
      name: 'Memeriaw Adugnaw',
      title: 'Information System Student | Full-Stack Developer',
      bio: 'I build practical digital solutions with a focus on responsive web experiences.',
      email: 'memeriawadugnaw@gmail.com',
      location: 'Bahir Dar, Ethiopia'
    });
    req.profile = profile;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = getProfileData;
