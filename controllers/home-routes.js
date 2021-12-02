const router = require('express').Router();
const { Topic, Comment, User } = require('../models');
// Import the custom middleware
const withAuth = require('../utils/auth')

// GET all topics for home -> home handlebar
router.get('/', async (req, res) => {
  try {
    const topicData = await Topic.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const topics = topicData.map((topic) =>
      topic.get({ plain: true })
    );

    res.render('home', {
      topics,
      loggedIn: req.session.loggedIn,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// GET one topic -> topic handlebar
router.get('/topic/:id', async (req, res) => {
  // If the user is not logged in, redirect the user to the login page
    // If the user is logged in, allow them to view the topic
    try {
      const topicData = await Topic.findByPk(req.params.id, {
        include: [
          {
            model: Comment,
            attributes: [
              'comment',
              'user_id',
            ],
          },
          {
            model: User,
            attributes: ['username'],
          },
        ],
      });
      const topic = topicData.get({ plain: true });

      res.render('topic', { topic, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// GET comment -> comment handlebar
router.get('/topic/:id/comment', async (req, res) => {
  try {
    const topicData = await Topic.findByPk(req.params.id, {
      include: [
        {
          model: Comment,
          attributes: [
            'comment',
            'user_id',
          ],
        },
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });
    const topic = topicData.get({ plain: true });

      res.render('comment', { topic });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

// GET dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const dashboardData = await Topic.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const dashboard = dashboardData.map((topic) =>
      topic.get({ plain: true })
    );

      console.log(dashboard)
      res.render('dashboard', { dashboard, loggedIn: req.session.loggedIn });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;
