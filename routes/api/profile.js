const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth.js');
const Post = require('../../models/Post.js');
const Profile = require('../../models/Profile.js');
const User = require('../../models/User.js');
const { check, validationResult } = require('express-validator');

router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      youtube,
      facebook,
      instagram,
      twitter,
      linkedin,
      skills,
      bio,
      status,
      githubusername,
      location,
    } = req.body;

    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (location) profileFields.location = location;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills + '') {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);
    res.json(profiles);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found!' });
    res.json(profile);
  } catch (error) {
    console.error(error.message);
    if (error.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found!' });
    }
    res.status(500).send('Server Error');
  }
});

router.delete('/', auth, async (req, res) => {
  try {
    await Post.deleteMany({ user: req.user.id });
    await Profile.findOneAndRemove({ user: req.user.id });
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/experience',
  [
    auth,
    [
      check('company', 'Company is required').not().isEmpty(),
      check('title', 'Title is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { company, title, location, from, to, current, description } =
      req.body;

    const newExp = {
      company,
      title,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profileExp = await Profile.findOne({ user: req.user.id });
      profileExp.experience.unshift(newExp);
      await profileExp.save();
      res.json(profileExp);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profileExp = await Profile.findOne({ user: req.user.id });
    const removeIndexExp = profileExp.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profileExp.experience.splice(removeIndexExp, 1);
    await profileExp.save();
    res.json(profileExp);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School name is required').not().isEmpty(),
      check('degree', 'The degree  is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };

    try {
      const profileEdu = await Profile.findOne({ user: req.user.id });
      profileEdu.education.unshift(newEdu);
      await profileEdu.save();
      res.json(profileEdu);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profileEdu = await Profile.findOne({ user: req.user.id });
    const removeIndexEdu = profileEdu.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);
    profileEdu.education.splice(removeIndexEdu, 1);
    await profileEdu.save();
    res.json(profileEdu);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
