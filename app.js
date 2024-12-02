const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const roleRouter = require('./routes/RoleRoutes');
const userRouter = require('./routes/UserRoutes');
const categoryRouter = require('./routes/CategoryRoutes');
const articleRouter = require('./routes/ArticleRoutes');
const filterRouter = require('./routes/FilterRoutes');

// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.listen(3003, () => {
  console.log('Server is running on port 3003');
});

app.use(cors());
app.use('/api/roles', roleRouter);
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/articles', articleRouter);
app.use('/api/filters', filterRouter);

// configure mongoose
mongoose.connect(
    process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/myblog',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log('Connected to MongoDB');
      }
    },
);
